import { formatCurrency } from '@/lib/utils'
import { WorkspaceStatsGrid } from '@/components/layout/WorkspaceShell'

type DashboardStatsProps = {
  stats: {
    totalEvents: number
    publishedEvents: number
    draftEvents: number
    upcomingEvents: number
    totalTicketsSold: number
    totalRevenue: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const cards = [
    { label: 'Total Events', value: String(stats.totalEvents).padStart(2, '0') },
    { label: 'Published (Live)', value: String(stats.publishedEvents).padStart(2, '0') },
    { label: 'Draft', value: String(stats.draftEvents).padStart(2, '0') },
    { label: 'Upcoming', value: String(stats.upcomingEvents).padStart(2, '0') },
    { label: 'Tickets Sold', value: stats.totalTicketsSold.toLocaleString('en-US') },
    { label: 'Gross Revenue', value: formatCurrency(stats.totalRevenue, 'QAR'), subtitle: 'Paid card & sandbox orders' },
  ]

  return <WorkspaceStatsGrid items={cards} columns={3} />
}
