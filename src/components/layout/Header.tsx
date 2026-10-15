'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import SiteMenu from '@/components/seatwise/SiteMenu'

type HeaderProps = {
  platformName?: string
  platformLogo?: string
  brandColor?: string
}

export function Header({ platformName = 'Cruze' }: HeaderProps) {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  const isOrganizer = session?.user?.roles?.includes('ORGANIZER')
  const isSuperAdmin = session?.user?.roles?.includes('SUPER_ADMIN')
  const canManageEvents = Boolean(isOrganizer || isSuperAdmin)

  // Hide the public header inside administrative dashboard and auth login/signup flows
  const isOrganizerRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin')
  const isAuthPage =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/verify-email') ||
    pathname.startsWith('/choose-password')

  if (isOrganizerRoute || isAuthPage) {
    return null
  }

  // Determine contextual telemetry badge in center
  let telemetryBadge = '// DOHA LIVE · 25° 17′ N · QATAR'
  if (pathname.startsWith('/events/')) {
    telemetryBadge = '// 01 LIVE EXPERIENCE · QATAR'
  } else if (pathname === '/events') {
    telemetryBadge = "// 03 WHAT'S HAPPENING / ALL EVENTS"
  } else if (pathname.startsWith('/orders') || pathname === '/my-tickets') {
    telemetryBadge = '// 04 BOOKED TICKETS & PASSES'
  } else if (pathname === '/about') {
    telemetryBadge = '// ABOUT CRUZE QATAR'
  } else if (pathname === '/contact' || pathname === '/support') {
    telemetryBadge = '// CONCIERGE & SUPPORT'
  } else if (pathname === '/terms' || pathname === '/privacy') {
    telemetryBadge = '// COMPLIANCE & LEGAL · QATAR'
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#11110f]/90 backdrop-blur-md transition-all duration-300 print:hidden">
      <nav className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-5 md:px-8 text-[#f1efe8]">
        {/* Brand Mark (Exact SeatWise Identity) */}
        <Link
          href="/"
          className="group flex flex-col justify-center select-none shrink-0"
          aria-label="Cruze Qatar home"
        >
          <div className="text-[24px] sm:text-[26px] md:text-[28px] font-black leading-none tracking-[-0.07em] text-[#f1efe8]">
            CRUZE
            <sup className="ml-1 text-[8px] font-medium text-[#d8763d]">®</sup>
          </div>
          <div className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.2em] text-white/45 whitespace-nowrap">
            Live event ticketing · Qatar
          </div>
        </Link>

        {/* Center Monospace Telemetry Strip (Wide screens) */}
        <div className="hidden lg:flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-white/40 whitespace-nowrap">
          <span className="h-1.5 w-1.5 rounded-full bg-[#d8763d] animate-pulse" />
          <span>{telemetryBadge}</span>
        </div>

        {/* Right Actions: Edition Kicker + Quick Action + SiteMenu */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <span className="hidden sm:inline-block font-mono text-[9px] uppercase tracking-[0.18em] text-white/45 whitespace-nowrap">
            QAT / 2026
          </span>

          {/* Quick Context Action Button */}
          {pathname.startsWith('/events/') ? (
            <Link
              href="/events"
              className="hidden sm:inline-flex items-center gap-1.5 border border-white/25 bg-white/[0.04] px-3.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f1efe8] hover:border-[#d8763d] hover:text-[#d8763d] transition-colors whitespace-nowrap"
            >
              <span>← Back to Events</span>
            </Link>
          ) : pathname !== '/events' ? (
            <Link
              href="/events"
              className="hidden sm:inline-flex items-center gap-1.5 border border-white/25 bg-white/[0.04] px-3.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f1efe8] hover:border-[#d8763d] hover:text-[#d8763d] transition-colors whitespace-nowrap"
            >
              <span>Discover</span>
              <span className="text-[#d8763d]">↗</span>
            </Link>
          ) : null}

          {/* User Account / Curator Button */}
          {canManageEvents ? (
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 border border-[#d8763d]/60 bg-[#d8763d]/20 px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#d8763d] hover:bg-[#d8763d] hover:text-[#11110f] transition-all whitespace-nowrap"
            >
              <span>Curator</span>
              <span>↗</span>
            </Link>
          ) : status === 'authenticated' ? (
            <Link
              href="/orders"
              className="hidden sm:inline-flex items-center gap-1.5 border border-white/25 bg-white/[0.04] px-3.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f1efe8] hover:border-[#d8763d] hover:text-[#d8763d] transition-colors whitespace-nowrap"
            >
              <span>My Tickets</span>
              <span className="text-[#d8763d]">↗</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1.5 border border-white/25 bg-white/[0.04] px-3.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f1efe8] hover:border-[#d8763d] hover:text-[#d8763d] transition-colors whitespace-nowrap"
            >
              <span>Sign In</span>
              <span className="text-[#d8763d]">↗</span>
            </Link>
          )}

          {/* Authentic SeatWise SiteMenu Trigger (Full-screen overlay drawer) */}
          <SiteMenu />
        </div>
      </nav>
    </header>
  )
}
export default Header
