import Link from 'next/link'
import { OrderStatus, PaymentMethod } from '@prisma/client'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { getPendingOrderLabel } from '@/lib/orders/pendingLabel'

type RecentOrdersProps = {
  orders: Array<{
    id: string
    orderNumber: string
    status: OrderStatus
    paymentMethod: PaymentMethod | null
    totalAmount: number
    currency: string
    buyerEmail: string
    createdAt: Date
    reminderSentAt?: Date | string | null
    event: {
      id: string
      title: string
    }
  }>
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#161614] p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#d8763d]" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#f1efe8]">
            Recent Orders & Ticket Sales
          </h2>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] py-8 text-center">
          <p className="text-xs font-mono uppercase tracking-wider text-[#f1efe8]/50">
            No orders placed yet
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const pendingLabel = getPendingOrderLabel(order)
            const pendingIsReminder = order.reminderSentAt != null
            return (
              <div
                key={order.id}
                className="rounded-xl border border-white/10 bg-[#11110f] p-4 transition-colors hover:border-white/20"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link
                    href={`/dashboard/events/${order.event.id}/orders/${order.id}`}
                    className="font-mono text-xs font-bold uppercase tracking-wider text-[#d8763d] transition-colors hover:text-[#e08955]"
                  >
                    #{order.orderNumber}
                  </Link>
                  <p className="font-mono text-sm font-bold text-[#f1efe8]">
                    {formatCurrency(order.totalAmount, order.currency || 'QAR')}
                  </p>
                </div>
                <p className="mt-1 text-xs font-medium text-[#f1efe8]/80">{order.event.title}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] font-mono text-[#f1efe8]/50">
                  <span className="text-white/60">{order.buyerEmail}</span>
                  <span>·</span>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      order.status === 'PAID'
                        ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/30'
                        : order.status === 'PENDING'
                          ? 'bg-amber-950/50 text-amber-300 border border-amber-500/30'
                          : 'bg-white/5 text-white/60 border border-white/10'
                    }`}
                  >
                    {order.status}
                  </span>
                  {pendingLabel && (
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        pendingIsReminder
                          ? 'bg-blue-950/50 text-blue-300 border border-blue-500/30'
                          : 'bg-amber-950/50 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {pendingLabel}
                    </span>
                  )}
                  {order.paymentMethod === 'INVOICE' && (
                    <span className="inline-flex rounded-full border border-amber-500/30 bg-amber-950/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                      Invoice
                    </span>
                  )}
                  {order.paymentMethod === 'FREE' && (
                    <span className="inline-flex rounded-full border border-blue-500/30 bg-blue-950/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-300">
                      Free
                    </span>
                  )}
                  <span>·</span>
                  <span>{formatDateTime(order.createdAt)}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
