import Link from 'next/link'
import { Calendar } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

type TopEvent = {
  eventId: string
  title: string
  revenue: number
  ticketsSold: number
  startDate: Date
}

type SalesChartProps = {
  title?: string
  data: TopEvent[]
  currency?: string
  showCreateEventCta?: boolean
}

function formatStartDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function SalesChart({ title = 'Top Selling Events', data, currency = 'QAR', showCreateEventCta = false }: SalesChartProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#161614] p-6 shadow-sm">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <span className="h-2 w-2 rounded-full bg-[#d8763d]" />
        <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#f1efe8]">
          {title}
        </h3>
      </div>

      {data.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center py-8 text-center rounded-xl border border-dashed border-white/15 bg-white/[0.02]">
          <p className="text-xs font-mono uppercase tracking-wider text-[#f1efe8]/50">
            No sales data recorded yet
          </p>
          <p className="mt-1 text-xs text-[#f1efe8]/40 max-w-xs">
            Your top selling Qatar events will appear here once orders are confirmed.
          </p>
          {showCreateEventCta && (
            <Link
              href="/create-event"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#d8763d] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-[#c4652e]"
            >
              Create Event ↗
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {data.map((event, i) => (
            <Link
              key={event.eventId}
              href={`/dashboard/events/${event.eventId}`}
              className="flex items-center gap-4 rounded-xl border border-white/5 bg-[#11110f] p-4 transition-colors hover:border-white/20"
            >
              {/* Rank badge */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/5 font-mono text-xs font-bold text-[#d8763d]">
                <span>0{i + 1}</span>
              </div>

              {/* Event info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#f1efe8]">{event.title}</p>
                <div className="mt-1 flex items-center gap-2 text-xs font-mono text-[#f1efe8]/50">
                  <Calendar className="h-3.5 w-3.5 text-[#d8763d]" />
                  <span>{formatStartDate(event.startDate)}</span>
                </div>
              </div>

              {/* Revenue + tickets */}
              <div className="shrink-0 text-right">
                <p className="text-sm font-mono font-bold text-[#d8763d]">
                  {formatCurrency(event.revenue, currency)}
                </p>
                <p className="text-[11px] font-mono text-[#f1efe8]/50">{event.ticketsSold} tickets sold</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
