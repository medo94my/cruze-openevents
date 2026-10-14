import Link from 'next/link'
import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import { prisma } from '@/lib/db'
import { getPaymentStatus, isPaymentProviderConfigured } from '@/lib/payments'

export const dynamic = 'force-dynamic'

interface CheckoutStatusPageProps {
  params: Promise<{ orderNumber: string }>
  searchParams: Promise<{ token?: string; session_id?: string; session_expired?: string }>
}

type OrderStatusInfo = {
  exists: boolean
  orderNumber: string
  status: string | null
  paymentCaptured: boolean
  eventTitle: string | null
  eventSlug: string | null
  buyerEmail: string | null
}

async function getOrderStatus(orderNumber: string, paymentSessionId?: string): Promise<OrderStatusInfo> {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      paymentId: true,
      buyerEmail: true,
      event: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
  })

  if (!order) {
    return {
      exists: false,
      orderNumber,
      status: null,
      paymentCaptured: false,
      eventTitle: null,
      eventSlug: null,
      buyerEmail: null,
    }
  }

  let paymentCaptured = order.status === 'PAID'

  if (!paymentCaptured && paymentSessionId && isPaymentProviderConfigured()) {
    try {
      const paymentStatus = await getPaymentStatus(paymentSessionId)
      paymentCaptured = paymentStatus.isApproved
    } catch {
      console.log('[CheckoutStatus] Could not verify payment status')
    }
  }

  return {
    exists: true,
    orderNumber: order.orderNumber,
    status: order.status,
    paymentCaptured,
    eventTitle: order.event.title,
    eventSlug: order.event.slug,
    buyerEmail: order.buyerEmail,
  }
}

export default async function CheckoutStatusPage({ params, searchParams }: CheckoutStatusPageProps) {
  const { orderNumber } = await params
  const { token, session_id, session_expired } = await searchParams

  const orderStatus = await getOrderStatus(orderNumber, session_id || token)
  const isSessionExpired = session_expired === 'true'

  return (
    <main className="min-h-[75vh] bg-[#11110f] text-[#f1efe8] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg space-y-6">
        <div className="border border-white/10 bg-[#161614] p-8 sm:p-10 text-center space-y-6">
          {/* Status Icon */}
          <div className="flex justify-center">
            {orderStatus.paymentCaptured ? (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#34d399]/10 border border-[#34d399]/30 text-[#34d399]">
                <CheckCircle2 className="h-8 w-8" />
              </div>
            ) : isSessionExpired ? (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Clock className="h-8 w-8" />
              </div>
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#d8763d]/10 border border-[#d8763d]/30 text-[#d8763d]">
                <Clock className="h-8 w-8" />
              </div>
            )}
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#d8763d]">
              CRUZE® / ORDER #{orderNumber}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#f1efe8]">
              {orderStatus.paymentCaptured
                ? 'ADMISSION CONFIRMED'
                : isSessionExpired
                  ? 'HOLD WINDOW EXPIRED'
                  : 'PROCESSING PAYMENT'}
              <span className="text-[#d8763d]">.</span>
            </h1>
          </div>

          {/* Body Text */}
          <p className="font-mono text-xs uppercase tracking-wider leading-relaxed text-[#f1efe8]/70">
            {orderStatus.paymentCaptured ? (
              <>
                Your admission passes are confirmed. A receipt and digital ticket have been sent to{' '}
                <strong className="text-[#f1efe8]">{orderStatus.buyerEmail || 'your email'}</strong>.
              </>
            ) : isSessionExpired ? (
              <>
                Your temporary seat hold window has elapsed. Unconfirmed tickets have been returned to inventory.
              </>
            ) : (
              <>
                Your transaction is being confirmed by the gateway. Passes will appear under My Tickets upon clearance.
              </>
            )}
          </p>

          {/* Event Details snippet */}
          {orderStatus.eventTitle && (
            <div className="border-t border-white/10 pt-4 text-left">
              <span className="font-mono text-[8px] uppercase tracking-widest text-[#f1efe8]/40 block mb-1">
                EVENT
              </span>
              <p className="font-mono text-xs uppercase font-bold text-[#f1efe8]">
                {orderStatus.eventTitle}
              </p>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col gap-3 font-mono">
            {orderStatus.paymentCaptured ? (
              <Link
                href={`/orders/${orderNumber}`}
                className="w-full bg-[#d8763d] py-3 text-xs font-bold uppercase tracking-wider text-[#11110f] hover:bg-[#e2844d] transition-colors"
              >
                VIEW YOUR PASSES ↗
              </Link>
            ) : (
              orderStatus.eventSlug && (
                <Link
                  href={`/events/${orderStatus.eventSlug}`}
                  className="w-full bg-[#d8763d] py-3 text-xs font-bold uppercase tracking-wider text-[#11110f] hover:bg-[#e2844d] transition-colors"
                >
                  RETRY RESERVATION ↗
                </Link>
              )
            )}

            <Link
              href="/"
              className="w-full border border-white/20 py-3 text-xs uppercase tracking-wider text-[#f1efe8] hover:border-white hover:bg-white/5 transition-colors"
            >
              RETURN TO HOME
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
