import Link from 'next/link'
import { prisma } from '@/lib/db'
import { requireOrganizerProfile, buildEventWhereClause } from '@/lib/dashboard/organizer'
import { EventStatusBadge } from '@/components/dashboard/EventStatusBadge'
import { formatDateTime } from '@/lib/utils'

import { WorkspacePageHeader } from '@/components/layout/WorkspaceShell'

export const dynamic = 'force-dynamic'

export default async function DashboardScanPage() {
  await requireOrganizerProfile()

  const where = buildEventWhereClause(null, true, {
    status: { notIn: ['DRAFT', 'CANCELLED'] },
    endDate: { gte: new Date() },
  })

  const events = await prisma.event.findMany({
    where,
    select: {
      id: true,
      title: true,
      status: true,
      startDate: true,
      _count: {
        select: {
          orders: true,
        },
      },
    },
    orderBy: [
      { startDate: 'asc' },
      { createdAt: 'desc' },
    ],
  })

  return (
    <div className="space-y-6">
      <WorkspacePageHeader
        badge="// GATE ENTRY CONTROL"
        title="Ticket Verification"
        description="Select an active Qatar event to launch the high-contrast gate check-in camera scanner."
      />

      {events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-12 text-center text-sm font-mono text-[#f1efe8]/50">
          No active events ready for ticket scanning at this time.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl border border-white/10 bg-[#161614] p-5 shadow-sm transition-colors hover:border-white/20"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-base font-bold text-[#f1efe8]">{event.title}</h2>
                <EventStatusBadge status={event.status} />
              </div>
              <p className="mt-2 text-xs font-mono text-[#f1efe8]/60">{formatDateTime(event.startDate)}</p>
              <p className="mt-1 text-[11px] font-mono text-[#f1efe8]/40">{`${event._count.orders} registered orders`}</p>
              <div className="mt-5 flex items-center gap-2 border-t border-white/5 pt-3">
                <Link
                  href={`/dashboard/events/${event.id}/scan`}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#d8763d] px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#c4652e]"
                >
                  Open Scanner ↗
                </Link>
                <Link
                  href={`/dashboard/events/${event.id}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/20 bg-white/5 px-3.5 py-2 font-mono text-xs uppercase tracking-wider text-[#f1efe8] transition-colors hover:bg-white/10"
                >
                  Manage ↗
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
