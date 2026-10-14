import { ReactNode } from 'react'
import Link from 'next/link'

type WorkspaceLayoutContainerProps = {
  sidebarTitle: string
  sidebarNav: ReactNode
  children: ReactNode
}

type WorkspaceAccessDeniedProps = {
  message: string
}

type WorkspacePageHeaderProps = {
  title: string
  description: string
  actions?: ReactNode
  badge?: string
}

export type WorkspaceStatItem = {
  label: string
  value: string | number
  subtitle?: string
}

type WorkspaceStatsGridProps = {
  items: WorkspaceStatItem[]
  columns?: 2 | 3 | 4
}

export function WorkspaceLayoutContainer({
  sidebarTitle,
  sidebarNav,
  children,
}: WorkspaceLayoutContainerProps) {
  return (
    <div className="min-h-screen bg-[#11110f] text-[#f1efe8]">
      {/* Top telemetry bar matching SeatWise .organizer__head */}
      <div className="border-b border-white/10 bg-[#141412]/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 text-[11px] font-mono tracking-[0.16em] uppercase">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#f1efe8]">CRUZE® / CURATOR & ADMIN</span>
            <span className="hidden text-white/30 sm:inline">·</span>
            <span className="hidden text-white/50 sm:inline">QAT / 2026</span>
            <span className="hidden text-white/30 md:inline">·</span>
            <span className="hidden text-[#d8763d] md:inline">ASIA/QATAR</span>
          </div>
          <Link
            href="/"
            className="text-white/60 transition-colors hover:text-[#d8763d]"
          >
            ← PUBLIC SITE
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:py-8 md:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-2xl border border-white/10 bg-[#161614] p-5 shadow-xl md:sticky md:top-20">
          <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#d8763d]">
              {sidebarTitle}
            </h2>
            <span className="text-[10px] font-mono text-white/30">SYS</span>
          </div>
          {sidebarNav}
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  )
}

export function WorkspaceAccessDenied({ message }: WorkspaceAccessDeniedProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="rounded-2xl border border-red-500/30 bg-[#161614] p-8 text-center shadow-xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400 font-mono text-xl font-bold">
          !
        </div>
        <h2 className="text-xl font-bold uppercase tracking-tight text-[#f1efe8]">
          ACCESS RESTRICTED<span className="text-[#d8763d]">.</span>
        </h2>
        <p className="mt-2 text-sm text-[#f1efe8]/70">{message}</p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#f1efe8] hover:bg-white/10"
          >
            ← Return to public site
          </Link>
        </div>
      </div>
    </div>
  )
}

export function WorkspacePageHeader({ title, description, actions, badge }: WorkspacePageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {badge && (
          <span className="mb-1.5 inline-block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#d8763d]">
            {badge}
          </span>
        )}
        <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#f1efe8]">
          {title}
          <span className="text-[#d8763d]">.</span>
        </h1>
        <p className="mt-1 text-sm text-[#f1efe8]/60">{description}</p>
      </div>
      {actions ? <div className="shrink-0 flex items-center gap-2">{actions}</div> : null}
    </div>
  )
}

export function WorkspaceStatsGrid({ items, columns = 3 }: WorkspaceStatsGridProps) {
  const gridCols =
    columns === 2
      ? 'grid grid-cols-1 gap-4 sm:grid-cols-2'
      : columns === 4
        ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'
        : 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <div className={gridCols}>
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-white/10 bg-[#161614] p-5 shadow-sm transition-colors hover:border-white/20"
        >
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#f1efe8]/50">
            {item.label}
          </p>
          <p className="mt-2 text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[#f1efe8]">
            {item.value}
          </p>
          {item.subtitle && (
            <p className="mt-1 text-xs font-mono text-[#f1efe8]/40">{item.subtitle}</p>
          )}
        </div>
      ))}
    </div>
  )
}

