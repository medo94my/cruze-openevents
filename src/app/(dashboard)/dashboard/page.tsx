import Link from 'next/link'
import { OrderStatus, Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { requireOrganizerProfile } from '@/lib/dashboard/organizer'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents'
import { RecentOrders } from '@/components/dashboard/RecentOrders'
import { SalesChart } from '@/components/dashboard/SalesChart'
import { SalesTrendChart } from '@/components/dashboard/SalesTrendChart'
import { getDashboardAnalytics } from '@/lib/analytics/dashboard-analytics'
import { WorkspacePageHeader } from '@/components/layout/WorkspaceShell'

export const dynamic = 'force-dynamic'

const revenueStatuses: OrderStatus[] = ['PAID']

export default async function DashboardHomePage() {
  const { organizerProfile, user } = await requireOrganizerProfile()

  const now = new Date()

  const eventWhere: Prisma.EventWhereInput = { deletedAt: null }
  const ticketWhere: Prisma.TicketTypeWhereInput = { event: { deletedAt: null } }
  const orderWhere: Prisma.OrderWhereInput = { event: { deletedAt: null } }

  // Run cached analytics and live dashboard data in parallel
  const [analytics, [eventsByStatus, ticketAgg, revenueAgg, upcomingEvents, recentOrders]] =
    await Promise.all([
      getDashboardAnalytics(),
      prisma.$transaction([
        prisma.event.findMany({
          where: eventWhere,
          select: { status: true },
        }),
        prisma.ticketType.aggregate({
          where: ticketWhere,
          _sum: { soldCount: true },
        }),
        prisma.order.aggregate({
          where: {
            ...orderWhere,
            status: { in: revenueStatuses },
            paymentMethod: 'PAYPAL',
          },
          _sum: { totalAmount: true },
        }),
        prisma.event.findMany({
          where: {
            ...eventWhere,
            endDate: { gte: now },
          },
          select: { id: true, slug: true, title: true, startDate: true, status: true },
          orderBy: { startDate: 'asc' },
          take: 6,
        }),
        prisma.order.findMany({
          where: orderWhere,
          select: {
            id: true,
            orderNumber: true,
            status: true,
            paymentMethod: true,
            totalAmount: true,
            currency: true,
            buyerEmail: true,
            createdAt: true,
            reminderSentAt: true,
            event: { select: { id: true, title: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 8,
        }),
      ]),
    ])

  const statusCounts = eventsByStatus.reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = (acc[row.status] ?? 0) + 1
    return acc
  }, {})

  const stats = {
    totalEvents: Object.values(statusCounts).reduce((sum, count) => sum + count, 0),
    publishedEvents: statusCounts.PUBLISHED ?? 0,
    draftEvents: statusCounts.DRAFT ?? 0,
    upcomingEvents: upcomingEvents.length,
    totalTicketsSold: ticketAgg._sum.soldCount ?? 0,
    totalRevenue: Number(revenueAgg._sum.totalAmount?.toString() ?? '0'),
  }

  const welcomeName = organizerProfile?.orgName || user.name || 'Admin'

  return (
    <div className="space-y-6">
      <WorkspacePageHeader
        badge="// QATAR PLATFORM TELEMETRY"
        title={`Dashboard: ${welcomeName}`}
        description="Platform-wide overview of Qatar curated events, ticket velocity, and gross revenue."
        actions={(
          <Link
            href="/create-event"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#d8763d] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#c4652e]"
          >
            Create Event ↗
          </Link>
        )}
      />

      {stats.totalEvents === 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#161614] p-6 shadow-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#d8763d]">
                Getting Started
              </span>
              <h2 className="mt-1 text-lg font-bold uppercase text-[#f1efe8]">
                Curate Your First Qatar Event
              </h2>
              <p className="mt-1 text-xs text-[#f1efe8]/60">
                Publish verified experiences in Doha to start issuing tickets and tracking attendee metrics.
              </p>
            </div>
            <Link
              href="/create-event"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#d8763d] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-[#c4652e]"
            >
              Create Event ↗
            </Link>
          </div>
        </div>
      )}

      {/* Primary figures */}
      <DashboardStats stats={stats} />

      {/* Utilitarian Quick Actions Strip */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-[#161614] px-4 py-3 font-mono text-xs uppercase tracking-wider">
        <span className="text-white/40">QUICK ACTIONS:</span>
        <Link href="/create-event" className="text-[#d8763d] hover:text-[#e08955]">
          + New Event ↗
        </Link>
        <span className="text-white/20">/</span>
        <Link href="/dashboard/events" className="text-white/80 hover:text-white">
          Manage Events ↗
        </Link>
        <span className="text-white/20">/</span>
        <Link href="/dashboard/scan" className="text-white/80 hover:text-white">
          Gate Scanner ↗
        </Link>
        <span className="text-white/20">/</span>
        <Link href="/dashboard/admin" className="text-white/80 hover:text-white">
          Admin Settings ↗
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UpcomingEvents events={upcomingEvents} />
        <RecentOrders
          orders={recentOrders.map((order) => ({
            ...order,
            totalAmount: Number(order.totalAmount.toString()),
          }))}
        />
      </div>

      {/* Analytics section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <span className="h-2 w-2 rounded-full bg-[#d8763d]" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#f1efe8]">
            Platform Sales Analytics & Velocity
          </h2>
        </div>
        <div className="space-y-6">
          <SalesTrendChart
            title="Sales Trend – Last 30 Days"
            noDataText="No sales data recorded yet"
            data={analytics.dailySales}
            currency="QAR"
            showCreateEventCta={stats.totalEvents === 0}
          />
          <SalesChart
            title="Top Selling Events"
            data={analytics.topEvents}
            currency="QAR"
            showCreateEventCta={stats.totalEvents === 0}
          />
        </div>
      </div>
    </div>
  )
}
