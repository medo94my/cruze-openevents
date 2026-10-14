import { NextRequest, NextResponse } from 'next/server'
import { PaymentMethod } from '@prisma/client'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { canAccessOrder } from '@/lib/orders/authorization'
import { capturePayment, getPaymentStatus } from '@/lib/payments'
import { fulfillOrder } from '@/lib/orders/fulfillment'
import { expirePendingOrderIfNeeded } from '@/lib/orders/expirePendingOrder'
import { getAppUrl } from '@/lib/url'

interface RouteContext {
  params: Promise<{ id: string }>
}

/**
 * Handle Stripe return after user approval.
 * Stripe redirects here with ?session_id=CHECKOUT_SESSION_ID.
 * Stub mode uses ?token=stub_payment_id.
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id: orderId } = await context.params
    const { searchParams } = new URL(request.url)
    const paymentSessionId = searchParams.get('session_id') || searchParams.get('token')

    if (!paymentSessionId) {
      return NextResponse.redirect(`${getAppUrl()}/checkout-error?error=invalid_token`)
    }

    // Find the order first (before auth check) so we can redirect properly on session expiry
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        event: {
          select: {
            id: true,
            slug: true,
            title: true,
            startDate: true,
            locationType: true,
            venue: true,
            city: true,
            country: true,
            onlineUrl: true,
            organizer: {
              select: {
                userId: true,
              },
            },
          },
        },
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
      },
    })

    if (!order) {
      return NextResponse.redirect(`${getAppUrl()}/checkout-error?error=order_not_found`)
    }

    // Check authentication - allow both authenticated and anonymous orders
    const user = await getCurrentUser()

    // For anonymous orders (userId is null), verify the payment session id matches
    const isAnonymousOrder = order.userId === null
    const isValidAnonymousAccess = isAnonymousOrder && order.paymentId === paymentSessionId

    if (!user && !isValidAnonymousAccess) {
      // Session expired for authenticated order - redirect to a helpful status page
      // Include the session id so we can check payment status
      const statusUrl = new URL(`${getAppUrl()}/checkout-status/${order.orderNumber}`)
      statusUrl.searchParams.set('session_expired', 'true')
      statusUrl.searchParams.set('session_id', paymentSessionId)
      return NextResponse.redirect(statusUrl.toString())
    }

    // For authenticated users or valid anonymous access, check permissions
    if (user) {
      const canManageOrder = canAccessOrder({
        orderUserId: order.userId,
        organizerUserId: order.event.organizer.userId,
        requesterUserId: user.id,
        requesterRoles: user.roles,
        isAnonymousOrderWithValidToken: false,
      })
      if (!canManageOrder) {
        console.error('[Capture] Forbidden order capture attempt:', {
          orderId: order.id,
          orderUserId: order.userId,
          organizerUserId: order.event.organizer.userId,
          requesterUserId: user.id,
        })
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    } else if (!isValidAnonymousAccess) {
      // This should not happen due to the check above, but just in case
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Verify the payment session id matches
    if (order.paymentId !== paymentSessionId) {
      console.error('[Capture] Token mismatch:', { expected: order.paymentId, received: paymentSessionId })
      return NextResponse.redirect(`${getAppUrl()}/checkout-error?error=invalid_token`)
    }

    // Check if already paid
    if (order.status === 'PAID') {
      return NextResponse.redirect(`${getAppUrl()}/orders/${order.orderNumber}`)
    }

    if (order.status === 'PENDING' && order.expiresAt && order.expiresAt <= new Date()) {
      await expirePendingOrderIfNeeded(order.id)
      return NextResponse.redirect(`${getAppUrl()}/checkout-error?error=reservation_expired`)
    }

    // Check if order can be paid
    if (order.status !== 'PENDING' && order.status !== 'PENDING_INVOICE') {
      return NextResponse.redirect(
        `${getAppUrl()}/checkout-error?error=invalid_status&status=${order.status}`
      )
    }

    const providerPaymentId = paymentSessionId || order.paymentId

    if (!providerPaymentId) {
      return NextResponse.redirect(`${getAppUrl()}/checkout-error?error=no_payment_id`)
    }

    // Verify the order is approved
    const paymentStatus = await getPaymentStatus(providerPaymentId)

    if (!paymentStatus.isApproved) {
      console.error('[Capture] Order not approved:', paymentStatus)
      return NextResponse.redirect(`${getAppUrl()}/checkout-error?error=not_approved`)
    }

    // Capture the payment
    const captureResult = await capturePayment(providerPaymentId)

    if (captureResult.status !== 'completed') {
      console.error('[Capture] Payment capture failed:', captureResult)
      return NextResponse.redirect(`${getAppUrl()}/checkout-error?error=capture_failed`)
    }

    // Complete order idempotently in database using shared fulfillment
    const paidOrder = await fulfillOrder({
      orderId: order.id,
      paymentId: captureResult.captureId,
      paymentMethod: PaymentMethod.PAYPAL,
    })

    // Redirect to confirmation page
    return NextResponse.redirect(`${getAppUrl()}/orders/${paidOrder.orderNumber}`)
  } catch (error) {
    console.error('[Capture] Failed to capture payment:', error)
    return NextResponse.redirect(`${getAppUrl()}/checkout-error?error=capture_exception`)
  }
}
