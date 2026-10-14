import { revalidateTag } from 'next/cache'
import { Prisma, PaymentMethod } from '@prisma/client'
import { prisma } from '@/lib/db'
import { sendOrderConfirmationEmail, sendAttendeeTicketEmailsForOrder } from '@/lib/email'
import { generateTicketCreateInput, lockTicketTypes } from '@/lib/orders'
import { formatDateTime } from '@/lib/utils'

export interface FulfillOrderOptions {
  orderId: string
  paymentId: string
  paymentMethod?: PaymentMethod
}

/**
 * Idempotent order fulfillment after payment confirmation.
 * Safely executes in a Serializable transaction, allocates inventory,
 * generates unique tickets, and dispatches confirmation emails.
 */
export async function fulfillOrder({
  orderId,
  paymentId,
  paymentMethod = PaymentMethod.PAYPAL,
}: FulfillOrderOptions) {
  const orderWithDetailsInclude = {
    items: {
      include: {
        ticketType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
    tickets: true,
    event: {
      select: {
        title: true,
        startDate: true,
        locationType: true,
        venue: true,
        city: true,
        country: true,
        onlineUrl: true,
      },
    },
  } as const satisfies Prisma.OrderInclude

  // 1. Fetch current order state
  const existingOrder = await prisma.order.findUnique({
    where: { id: orderId },
    include: orderWithDetailsInclude,
  })

  if (!existingOrder) {
    throw new Error(`Order ${orderId} not found`)
  }

  // Idempotency check: if already fulfilled, return without duplicate operations
  if (existingOrder.status === 'PAID') {
    return existingOrder
  }

  const ticketTypeIds = Array.from(new Set(existingOrder.items.map((item) => item.ticketTypeId)))

  // 2. Execute serializable inventory and order completion transaction
  const paidOrder = await prisma.$transaction(
    async (tx) => {
      await lockTicketTypes(tx, ticketTypeIds)

      const latestOrder = await tx.order.findUniqueOrThrow({
        where: { id: orderId },
        include: orderWithDetailsInclude,
      })

      // Race condition check inside locked transaction
      if (latestOrder.status === 'PAID') {
        return latestOrder
      }

      if (latestOrder.status !== 'PENDING' && latestOrder.status !== 'PENDING_INVOICE') {
        throw new Error(`Order cannot be paid in status ${latestOrder.status}`)
      }

      // Update ticket counts
      for (const item of latestOrder.items) {
        await tx.ticketType.update({
          where: { id: item.ticketTypeId },
          data: {
            reservedCount: {
              decrement: item.quantity,
            },
            soldCount: {
              increment: item.quantity,
            },
          },
        })
      }

      // Mark order as paid
      await tx.order.update({
        where: { id: latestOrder.id },
        data: {
          status: 'PAID',
          paidAt: new Date(),
          expiresAt: null,
          paymentId,
          paymentMethod,
        },
      })

      // Generate tickets
      const ticketCreateData = generateTicketCreateInput(
        latestOrder.id,
        latestOrder.items.map((item) => ({
          ticketTypeId: item.ticketTypeId,
          ticketTypeName: item.ticketType.name,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          totalPrice: Number(item.totalPrice),
          currency: latestOrder.currency,
          attendees: Array.isArray(item.attendeeData)
            ? (item.attendeeData as unknown as import('@/lib/orders').AttendeeData[])
            : undefined,
        }))
      )

      if (ticketCreateData.length > 0) {
        await tx.ticket.createMany({
          data: ticketCreateData,
        })
      }

      return tx.order.findUniqueOrThrow({
        where: { id: latestOrder.id },
        include: orderWithDetailsInclude,
      })
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    }
  )

  // 3. Dispatch emails (non-blocking for transaction completion)
  const eventLocation =
    paidOrder.event.locationType === 'ONLINE'
      ? paidOrder.event.onlineUrl || 'Online event'
      : [paidOrder.event.venue, paidOrder.event.city, paidOrder.event.country]
          .filter(Boolean)
          .join(', ')
  const eventDate = formatDateTime(paidOrder.event.startDate)
  const buyerName = `${paidOrder.buyerFirstName} ${paidOrder.buyerLastName}`
  const paidOrderTickets = (
    paidOrder as typeof paidOrder & {
      tickets: Array<{
        ticketCode: string
        ticketTypeId: string
        attendeeFirstName: string | null
        attendeeLastName: string | null
        attendeeEmail: string | null
      }>
    }
  ).tickets

  try {
    await sendOrderConfirmationEmail(paidOrder.buyerEmail, {
      orderNumber: paidOrder.orderNumber,
      orderId: paidOrder.id,
      eventTitle: paidOrder.event.title,
      eventDate,
      eventLocation,
      tickets: paidOrder.items.map((item) => ({
        name: item.ticketType.name,
        quantity: item.quantity,
        price: `${item.totalPrice.toString()} ${paidOrder.currency}`,
      })),
      totalAmount: `${paidOrder.totalAmount.toString()} ${paidOrder.currency}`,
      buyerName,
      vatRate: parseFloat(paidOrder.vatRate.toString()),
      vatAmount: paidOrder.vatAmount.toString(),
      ticketCodes: paidOrderTickets.map((t) => t.ticketCode),
    })
  } catch (emailError) {
    console.error('[Fulfillment] Confirmation email failed:', emailError)
  }

  try {
    await sendAttendeeTicketEmailsForOrder({
      orderNumber: paidOrder.orderNumber,
      buyerEmail: paidOrder.buyerEmail,
      buyerName,
      eventTitle: paidOrder.event.title,
      eventDate,
      eventLocation,
      tickets: paidOrderTickets,
      items: paidOrder.items,
    })
  } catch (emailError) {
    console.error('[Fulfillment] Attendee ticket emails failed:', emailError)
  }

  revalidateTag('event-analytics', 'max')
  revalidateTag('dashboard-analytics', 'max')

  return paidOrder
}
