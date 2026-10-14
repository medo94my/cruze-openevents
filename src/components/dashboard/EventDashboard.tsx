import { EventStatus } from '@prisma/client'
import { ChevronDown } from 'lucide-react'
import { EventActionButtons } from '@/components/dashboard/EventActionButtons'
import { EventStatusBadge } from '@/components/dashboard/EventStatusBadge'
import { SalesTrendChart } from '@/components/dashboard/SalesTrendChart'
import { formatCurrency, formatDateTime } from '@/lib/utils'

type EventDashboardProps = {
  event: {
    id: string
    slug: string
    title: string
    status: EventStatus
    startDate: Date
    endDate: Date
    createdAt: Date
  }
  stats: {
    totalRevenue: number
    totalTicketsSold: number
    totalOrders: number
    paidOrders: number
    pendingInvoiceOrders: number
    cancelledOrders: number
    refundedOrders: number
    refundedAmount: number
    refundRate: number
    ticketsByType: Array<{
      name: string
      revenue: number
      sold: number
      remaining: number | null
    }>
    dailySales: Array<{ date: string; revenue: number; ticketsSold: number }>
  }
}

export function EventDashboard({ event, stats }: EventDashboardProps) {
  const orderBreakdown = [
    { label: 'Paid', value: stats.paidOrders },
    { label: 'Pending Invoice', value: stats.pendingInvoiceOrders },
    { label: 'Cancelled', value: stats.cancelledOrders },
    { label: 'Refunded', value: stats.refundedOrders },
  ]

  return (
    <div className="space-y-6">
      {/* Event header */}
      <section className="rounded-2xl border border-white/10 bg-[#161614] p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#d8763d]">
                // EVENT TELEMETRY
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-extrabold uppercase tracking-tight text-[#f1efe8]">
              {event.title}
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <EventStatusBadge status={event.status === 'PUBLISHED' && new Date(event.endDate) < new Date() ? 'PASSED' : event.status} />
              <span className="text-xs font-mono text-[#f1efe8]/40">
                {`Created ${formatDateTime(event.createdAt)}`}
              </span>
            </div>
            <p className="mt-2 text-xs font-mono text-[#f1efe8]/60">
              {formatDateTime(event.startDate)} - {formatDateTime(event.endDate)}
            </p>
          </div>

          <EventActionButtons eventId={event.id} eventSlug={event.slug} />
        </div>
      </section>

      {/* Core metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="h-full rounded-xl border border-white/10 bg-[#161614] p-5 shadow-sm transition-colors hover:border-white/20">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#f1efe8]/50">Gross Revenue</p>
          <p className="mt-2 text-2xl font-bold font-mono tracking-tight text-[#f1efe8]">
            {formatCurrency(stats.totalRevenue, 'QAR')}
          </p>
          <p className="mt-1 text-xs font-mono text-[#f1efe8]/40">Excluding unpaid orders</p>
        </div>

        <div className="h-full rounded-xl border border-white/10 bg-[#161614] p-5 shadow-sm transition-colors hover:border-white/20">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#f1efe8]/50">Tickets Sold</p>
          <p className="mt-2 text-2xl font-bold font-mono tracking-tight text-[#f1efe8]">
            {stats.totalTicketsSold}
            {(() => {
              const totalCapacity = stats.ticketsByType.every(tt => tt.remaining !== null)
                ? stats.ticketsByType.reduce((sum, tt) => sum + (tt.sold + (tt.remaining ?? 0)), 0)
                : null
              return totalCapacity !== null ? (
                <span className="text-sm font-normal text-[#f1efe8]/40"> / {totalCapacity}</span>
              ) : null
            })()}
          </p>
          {stats.ticketsByType.length > 0 && (
            <div className="mt-2 space-y-1">
              {stats.ticketsByType.map((tt, i) => (
                <p key={i} className="text-xs font-mono text-[#f1efe8]/50">
                  {tt.name}: {tt.sold}{tt.remaining !== null ? ` / ${tt.sold + tt.remaining}` : ''}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="h-full rounded-xl border border-white/10 bg-[#161614] p-5 shadow-sm transition-colors hover:border-white/20">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#f1efe8]/50">Total Orders</p>
          <p className="mt-2 text-2xl font-bold font-mono tracking-tight text-[#f1efe8]">{stats.totalOrders}</p>
          <details className="group mt-3">
            <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg border border-white/10 bg-[#11110f] px-2.5 py-2 font-mono text-xs uppercase tracking-wider text-[#f1efe8]/70 [&::-webkit-details-marker]:hidden hover:bg-white/5">
              <span>Breakdown</span>
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {orderBreakdown.map(({ label, value }) => (
                <div key={label} className="rounded-lg border border-white/10 bg-[#11110f] px-2 py-1.5 text-center">
                  <p className="text-sm font-bold font-mono text-[#f1efe8]">{value}</p>
                  <p className="mt-0.5 text-[10px] font-mono uppercase tracking-wider text-[#f1efe8]/50">{label}</p>
                </div>
              ))}
            </div>
          </details>
        </div>

        <div className="h-full rounded-xl border border-white/10 bg-[#161614] p-5 shadow-sm transition-colors hover:border-white/20">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#f1efe8]/50">Refund Rate</p>
          <p className="mt-2 text-2xl font-bold font-mono tracking-tight text-[#f1efe8]">
            {stats.totalOrders === 0 ? '—' : `${Number.isNaN(stats.refundRate) ? 0 : stats.refundRate}%`}
          </p>
          {stats.refundedAmount > 0 && (
            <p className="mt-1 text-xs font-mono text-[#f1efe8]/40">
              {`${formatCurrency(stats.refundedAmount, 'QAR')} refunded`}
            </p>
          )}
        </div>
      </div>

      {/* 30-day sales trend — full width */}
      <SalesTrendChart
        title="Sales Trend – Last 30 Days"
        noDataText="No sales data recorded yet"
        data={stats.dailySales}
        currency="QAR"
      />

      {/* Ticket type breakdown table */}
      {stats.ticketsByType.length > 0 && (
        <section className="rounded-2xl border border-white/10 bg-[#161614] p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <span className="h-2 w-2 rounded-full bg-[#d8763d]" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#f1efe8]">
              Ticket Inventory Tiers
            </h3>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="pb-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#f1efe8]/50">Tier Name</th>
                  <th className="pb-3 text-right font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#f1efe8]/50">Sold</th>
                  <th className="pb-3 text-right font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#f1efe8]/50">Remaining</th>
                  <th className="pb-3 text-right font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#f1efe8]/50">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.ticketsByType.map((tt, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 font-bold text-[#f1efe8]">{tt.name}</td>
                    <td className="py-3.5 text-right text-[#f1efe8]/70">{tt.sold}</td>
                    <td className="py-3.5 text-right text-[#f1efe8]/70">
                      {tt.remaining === null ? '∞' : tt.remaining}
                    </td>
                    <td className="py-3.5 text-right font-bold text-[#d8763d]">
                      {formatCurrency(tt.revenue, 'QAR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
