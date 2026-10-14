import { EventStatus } from '@prisma/client'

type DisplayStatus = EventStatus | 'PASSED'

const statusStyles: Record<DisplayStatus, { pill: string; dot: string }> = {
  PUBLISHED: {
    pill: 'bg-[#1f7a4d]/20 text-[#34d399] border-[#1f7a4d]/50',
    dot: 'bg-[#34d399]',
  },
  DRAFT: {
    pill: 'bg-[#a8761c]/20 text-[#fbbf24] border-[#a8761c]/50',
    dot: 'bg-[#fbbf24]',
  },
  CANCELLED: {
    pill: 'bg-red-950/40 text-red-400 border-red-500/40',
    dot: 'bg-red-400',
  },
  COMPLETED: {
    pill: 'bg-blue-950/40 text-blue-300 border-blue-500/40',
    dot: 'bg-blue-400',
  },
  PASSED: {
    pill: 'bg-neutral-900 text-neutral-400 border-white/10',
    dot: 'bg-neutral-500',
  },
}

type EventStatusBadgeProps = {
  status: DisplayStatus
}

export function EventStatusBadge({ status }: EventStatusBadgeProps) {
  const current = statusStyles[status] ?? statusStyles.DRAFT

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${current.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} aria-hidden="true" />
      {status === 'PUBLISHED' ? 'LIVE' : status}
    </span>
  )
}

