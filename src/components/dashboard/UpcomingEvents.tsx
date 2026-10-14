import Link from 'next/link'
import { EventStatus } from '@prisma/client'
import { EventStatusBadge } from '@/components/dashboard/EventStatusBadge'
import { formatDateTime } from '@/lib/utils'

type UpcomingEventsProps = {
  events: Array<{
    id: string
    slug: string
    title: string
    startDate: Date
    status: EventStatus
  }>
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#161614] p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#d8763d]" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#f1efe8]">
            Upcoming Qatar Events
          </h2>
        </div>
        <Link
          href="/dashboard/events"
          className="text-xs font-mono uppercase tracking-wider text-[#d8763d] hover:text-[#e08955]"
        >
          View all ↗
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] py-8 text-center">
          <p className="text-xs font-mono uppercase tracking-wider text-[#f1efe8]/50">
            No upcoming events scheduled
          </p>
          <Link
            href="/create-event"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#d8763d] px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-white hover:bg-[#c4652e]"
          >
            Create Event ↗
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-xl border border-white/10 bg-[#11110f] p-4 transition-colors hover:border-white/20"
            >
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/dashboard/events/${event.id}`}
                  className="font-bold text-sm text-[#f1efe8] transition-colors hover:text-[#d8763d]"
                >
                  {event.title}
                </Link>
                <EventStatusBadge status={event.status} />
              </div>
              <p className="mt-2 text-xs font-mono text-[#f1efe8]/60">
                {formatDateTime(event.startDate)}
              </p>
              <div className="mt-3 flex items-center gap-3 border-t border-white/5 pt-2 text-[11px] font-mono uppercase tracking-wider">
                <Link
                  href={`/dashboard/events/${event.id}`}
                  className="text-white/70 hover:text-white"
                >
                  Manage ↗
                </Link>
                <span className="text-white/20">·</span>
                <Link
                  href={`/events/${event.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#d8763d] hover:text-[#e08955]"
                >
                  Public Page ↗
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
