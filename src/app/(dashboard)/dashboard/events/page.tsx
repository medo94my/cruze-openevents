import Link from 'next/link'
import { EventStatus, Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { requireOrganizerProfile, buildEventWhereClause } from '@/lib/dashboard/organizer'
import { EventsTable } from '@/components/dashboard/EventsTable'
import { Input } from '@/components/ui/input'

import { WorkspacePageHeader } from '@/components/layout/WorkspaceShell'

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function param(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0]
  return value
}

export default async function OrganizerEventsPage({ searchParams }: PageProps) {
  await requireOrganizerProfile()
  const params = await searchParams

  const status = param(params.status) as EventStatus | undefined
  const query = param(params.q)

  const additionalWhere: Prisma.EventWhereInput = {}

  if (status && ['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'].includes(status)) {
    additionalWhere.status = status
  }

  if (query) {
    additionalWhere.title = {
      contains: query,
      mode: 'insensitive',
    }
  }

  const where = buildEventWhereClause(null, true, additionalWhere)

  const events = await prisma.event.findMany({
    where,
    select: {
      id: true,
      slug: true,
      title: true,
      startDate: true,
      endDate: true,
      status: true,
      visibility: true,
      ticketTypes: {
        select: {
          soldCount: true,
        },
      },
      _count: {
        select: {
          orders: true,
        },
      },
    },
    orderBy: {
      startDate: 'desc',
    },
  })

  const eventsWithTicketsSold = events.map((event) => ({
    ...event,
    ticketsSold: event.ticketTypes.reduce((sum, tt) => sum + tt.soldCount, 0),
  }))

  return (
    <div className="space-y-6">
      <WorkspacePageHeader
        badge="// QATAR CURATOR CATALOG"
        title="Events Directory"
        description="Search, filter, and manage all curated experiences across Qatar."
        actions={(
          <Link
            href="/create-event"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#d8763d] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#c4652e]"
          >
            Create Event ↗
          </Link>
        )}
      />

      <form className="grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-[#161614] p-5 md:grid-cols-4">
        <div className="md:col-span-2">
          <label htmlFor="q" className="block text-[11px] font-mono uppercase tracking-wider text-[#f1efe8]/60">
            Search by title
          </label>
          <div className="mt-1">
            <Input id="q" name="q" defaultValue={query || ''} placeholder="Search event titles..." />
          </div>
        </div>
        <div>
          <label htmlFor="status" className="block text-[11px] font-mono uppercase tracking-wider text-[#f1efe8]/60">
            Status filter
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status || ''}
            className="mt-1 h-10 w-full rounded-lg border border-white/15 bg-[#11110f] px-3 font-mono text-xs text-[#f1efe8] focus:border-[#d8763d] focus:outline-none focus:ring-2 focus:ring-[#d8763d]/40"
          >
            <option value="">All statuses</option>
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED (LIVE)</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="h-10 w-full rounded-lg bg-[#d8763d] px-5 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-[#c4652e] cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </form>

      <EventsTable events={eventsWithTicketsSold} />
    </div>
  )
}
