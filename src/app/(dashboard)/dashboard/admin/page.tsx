import Link from 'next/link'
import { prisma } from '@/lib/db'
import { WorkspacePageHeader, WorkspaceStatsGrid } from '@/components/layout/WorkspaceShell'

export const dynamic = 'force-dynamic'

export default async function DashboardAdminOverviewPage() {
  const [totalUsers, organizerCount, totalEvents] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.userRole.count({ where: { role: 'ORGANIZER' } }),
    prisma.event.count({ where: { deletedAt: null } }),
  ])

  return (
    <div className="space-y-6">
      <WorkspacePageHeader
        badge="// PLATFORM ADMINISTRATION"
        title="Admin Overview"
        description="Platform-wide statistics, curator directory, and system controls."
        actions={(
          <Link
            href="/dashboard/admin/users"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#d8763d] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#c4652e]"
          >
            Manage Users ↗
          </Link>
        )}
      />

      <WorkspaceStatsGrid
        columns={3}
        items={[
          { label: 'Total Users', value: totalUsers },
          { label: 'Organizers', value: organizerCount },
          { label: 'Total Events', value: totalEvents },
        ]}
      />
    </div>
  )
}
