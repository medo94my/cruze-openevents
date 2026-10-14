import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { TicketDisplay } from '@/components/tickets/TicketDisplay'

export const dynamic = 'force-dynamic'

interface ConfirmationPageProps {
  params: Promise<{ orderNumber: string }>
}

function getPageTitle(status: string, paymentMethod: string | null): string {
  if (status === 'PENDING_INVOICE') {
    return 'Invoice Order Received'
  }
  if (status === 'PAID') {
    return 'Admission Confirmed'
  }
  if (status === 'PENDING' && paymentMethod === 'INVOICE') {
    return 'Invoice Order Received'
  }
  if (status === 'CANCELLED') {
    return 'Order Cancelled'
  }
  if (status === 'REFUNDED' || status === 'PARTIALLY_REFUNDED') {
    return 'Order Refunded'
  }
  return 'Order Details'
}

export default async function OrderConfirmationPage({ params }: ConfirmationPageProps) {
  const user = await getCurrentUser()
  const { orderNumber } = await params

  const order = await prisma.order.findFirst({
    where: {
      orderNumber,
      ...(user && {
        OR: [{ userId: user.id }, { event: { organizer: { userId: user.id } } }],
      }),
    },
    include: {
      event: {
        select: {
          title: true,
          slug: true,
          startDate: true,
          endDate: true,
          locationType: true,
          venue: true,
          city: true,
          country: true,
          onlineUrl: true,
        },
      },
      items: {
        select: {
          id: true,
          quantity: true,
          unitPrice: true,
          ticketType: {
            select: {
              name: true,
            },
          },
        },
      },
      tickets: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      groupDiscount: {
        select: {
          minQuantity: true,
          discountType: true,
          discountValue: true,
        },
      },
    },
  })

  if (!order) {
    notFound()
  }

  const pageTitle = getPageTitle(order.status, order.paymentMethod)

  return (
    <main className="min-h-screen bg-[#11110f] text-[#f1efe8] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-8 font-mono text-xs uppercase tracking-wider text-white/50">
          <span>CRUZE® / ORDER #{order.orderNumber}</span>
          <Link href="/orders" className="hover:text-[#d8763d] transition-colors">
            ← BACK TO MY TICKETS
          </Link>
        </div>

        <h1 className="mb-8 font-sans text-4xl sm:text-5xl font-black uppercase tracking-tight text-white">
          {pageTitle}<span className="text-[#d8763d]">.</span>
        </h1>

        <div className="rounded-none border border-white/15 bg-white/[0.02] p-6 sm:p-8">
          <TicketDisplay order={order} />
        </div>
      </div>
    </main>
  )
}
