'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

type HeaderProps = {
  platformName?: string
  platformLogo?: string
  brandColor?: string
}

export function Header({ platformName = 'Cruze', platformLogo, brandColor }: HeaderProps) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [failedAvatarSrc, setFailedAvatarSrc] = useState<string | null>(null)
  const [avatarVersion, setAvatarVersion] = useState(() => Date.now())
  const [organizerAvatarPreview, setOrganizerAvatarPreview] = useState<string | null>(null)
  const accountMenuRef = useRef<HTMLDivElement | null>(null)

  const isOrganizer = session?.user?.roles?.includes('ORGANIZER')
  const isSuperAdmin = session?.user?.roles?.includes('SUPER_ADMIN')
  const canManageEvents = Boolean(isOrganizer || isSuperAdmin)
  const avatarFallback = (session?.user?.email?.[0] || 'U').toUpperCase()
  const displayName = session?.user?.name?.trim() || session?.user?.email?.split('@')[0] || 'Account'
  const profileHref = '/dashboard/profile'
  const avatarSrc = organizerAvatarPreview
    ? organizerAvatarPreview
    : isOrganizer
      ? `/api/organizers/me/logo?v=${avatarVersion}`
      : `/api/users/me/avatar?v=${avatarVersion}`
  const shouldRenderAvatarImage = status === 'authenticated' && failedAvatarSrc !== avatarSrc && (isOrganizer || Boolean(session?.user?.image))

  const isOrganizerRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin')
  const isAuthPage =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/verify-email') ||
    pathname.startsWith('/choose-password')

  const isPublicPage = !isOrganizerRoute && !isAuthPage

  useEffect(() => {
    function onPointerDown(event: MouseEvent | TouchEvent) {
      if (!accountMenuRef.current) return
      if (!accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false)
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setAccountMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  useEffect(() => {
    function onOrganizerLogoUpdated(event: Event) {
      const detail = (event as CustomEvent<{ previewUrl?: string | null }>).detail
      setOrganizerAvatarPreview(detail?.previewUrl || null)
      setFailedAvatarSrc(null)
      setAvatarVersion(Date.now())
    }

    window.addEventListener('openevents:organizer-logo-updated', onOrganizerLogoUpdated)
    return () => {
      window.removeEventListener('openevents:organizer-logo-updated', onOrganizerLogoUpdated)
    }
  }, [])

  if (isPublicPage) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-[#f1efe8]/15 bg-[#11110f]/95 backdrop-blur-md transition-all duration-300 print:hidden">
        <nav className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 sm:px-10 lg:px-12 text-[#f1efe8]">
          {/* Brand Mark */}
          <Link href="/" className="group flex items-baseline gap-3.5" aria-label="Cruze Qatar home">
            <span className="text-[22px] font-black uppercase tracking-[-0.06em] text-[#f1efe8]">
              CRUZE<span className="text-[#d8763d]">®</span>
            </span>
            <span className="hidden font-mono text-[9.5px] uppercase tracking-[0.2em] text-[#f1efe8]/50 md:inline-block">
              Live event ticketing · QATAR / 2026
            </span>
          </Link>

          {/* Desktop Numbered Nav Links (SeatWise Signature) */}
          <div className="hidden items-center gap-7 lg:flex">
            <Link
              href="/#top"
              className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#f1efe8]/70 transition-colors duration-200 hover:text-[#f1efe8]"
            >
              <span className="text-[9px] text-[#d8763d]">01</span>
              <span>Home</span>
            </Link>
            <Link
              href="/#event-universe"
              className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#f1efe8]/70 transition-colors duration-200 hover:text-[#f1efe8]"
            >
              <span className="text-[9px] text-[#d8763d]">02</span>
              <span>Universe</span>
            </Link>
            <Link
              href="/#happening"
              className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#f1efe8]/70 transition-colors duration-200 hover:text-[#f1efe8]"
            >
              <span className="text-[9px] text-[#d8763d]">03</span>
              <span>Happening</span>
            </Link>
            <Link
              href="/events"
              className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#f1efe8]/70 transition-colors duration-200 hover:text-[#f1efe8]"
            >
              <span className="text-[9px] text-[#d8763d]">04</span>
              <span>Events</span>
            </Link>
            <Link
              href="/dashboard/profile"
              className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#f1efe8]/70 transition-colors duration-200 hover:text-[#f1efe8]"
            >
              <span className="text-[9px] text-[#d8763d]">05</span>
              <span>My Tickets</span>
            </Link>
          </div>

          {/* Right Actions */}
          <div className="hidden items-center gap-5 sm:flex">
            <div className="hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[#f1efe8]/40 xl:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d8763d] animate-pulse" />
              <span>DOHA LIVE · 25° 17′ N</span>
            </div>

            {canManageEvents ? (
              <Link
                href="/dashboard"
                className="seatwise-btn !py-2.5 !px-4 text-[10px]"
              >
                <span>Dashboard</span>
                <span className="seatwise-btn-arrow">↗</span>
              </Link>
            ) : status === 'authenticated' ? (
              <div ref={accountMenuRef} className="relative">
                <button
                  type="button"
                  className="seatwise-btn !py-2.5 !px-4 text-[10px]"
                  onClick={() => setAccountMenuOpen((open) => !open)}
                  aria-expanded={accountMenuOpen}
                >
                  <span>{displayName}</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {accountMenuOpen && (
                  <div className="absolute right-0 z-50 mt-1 w-48 border border-[#f1efe8]/20 bg-[#11110f] p-1 shadow-2xl">
                    <Link
                      href={profileHref}
                      className="block px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-[#f1efe8] hover:bg-[#f1efe8]/10"
                      onClick={() => setAccountMenuOpen(false)}
                    >
                      Profile & Tickets
                    </Link>
                    <button
                      type="button"
                      className="block w-full px-4 py-2.5 text-left font-mono text-[11px] uppercase tracking-wider text-[#d8763d] hover:bg-[#f1efe8]/10"
                      onClick={() => {
                        setAccountMenuOpen(false)
                        signOut({ callbackUrl: '/' })
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="seatwise-btn !py-2.5 !px-4 text-[10.5px]"
              >
                <span>Account</span>
                <span className="seatwise-btn-arrow">↗</span>
              </Link>
            )}

            <Link
              href="/#event-universe"
              className="inline-flex items-center gap-3 border border-[#d8763d] bg-[#d8763d] px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#11110f] transition-all hover:bg-[#f1efe8] hover:border-[#f1efe8]"
            >
              <span>Explore</span>
              <span>↗</span>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center border border-[#f1efe8]/20 text-[#f1efe8] hover:bg-[#f1efe8]/10 lg:hidden"
            aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* Mobile Full-width Drawer (SeatWise Numbered Style) */}
        {mobileMenuOpen && (
          <div className="border-t border-[#f1efe8]/15 bg-[#11110f] px-6 py-8 lg:hidden">
            <div className="flex flex-col space-y-4">
              <Link
                href="/#top"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between border-b border-[#f1efe8]/10 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[#d8763d]">01</span>
                  <span className="text-lg font-bold uppercase tracking-tight text-[#f1efe8]">Home</span>
                </div>
                <span className="text-xs text-[#f1efe8]/40">Claim your place</span>
              </Link>
              <Link
                href="/#event-universe"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between border-b border-[#f1efe8]/10 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[#d8763d]">02</span>
                  <span className="text-lg font-bold uppercase tracking-tight text-[#f1efe8]">Universe</span>
                </div>
                <span className="text-xs text-[#f1efe8]/40">Explore experiences</span>
              </Link>
              <Link
                href="/events"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between border-b border-[#f1efe8]/10 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[#d8763d]">03</span>
                  <span className="text-lg font-bold uppercase tracking-tight text-[#f1efe8]">Events</span>
                </div>
                <span className="text-xs text-[#f1efe8]/40">What&apos;s happening</span>
              </Link>
              <Link
                href="/dashboard/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between border-b border-[#f1efe8]/10 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[#d8763d]">04</span>
                  <span className="text-lg font-bold uppercase tracking-tight text-[#f1efe8]">My Tickets</span>
                </div>
                <span className="text-xs text-[#f1efe8]/40">Your bookings</span>
              </Link>
              <Link
                href={canManageEvents ? '/dashboard' : status === 'authenticated' ? '/dashboard/profile' : '/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between pt-2"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[#d8763d]">05</span>
                  <span className="text-lg font-bold uppercase tracking-tight text-[#f1efe8]">
                    {canManageEvents ? 'Dashboard' : status === 'authenticated' ? 'My Account' : 'Account'}
                  </span>
                </div>
                <span className="text-[#d8763d]">↗</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    )
  }

  // Dashboard / Admin Header (Clean, Functional, Matching)
  return (
    <header className="border-b border-gray-200 bg-white print:hidden">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              {platformLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={platformLogo} alt={platformName} className="h-8 w-auto sm:h-9" />
              ) : (
                <span className="text-xl font-extrabold tracking-tight sm:text-2xl" style={{ color: brandColor || 'var(--brand-color)' }}>
                  {platformName}
                </span>
              )}
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-6">
            {canManageEvents && (
              <Link
                href="/create-event"
                className="inline-flex min-w-[132px] items-center justify-center rounded-lg bg-[#d8763d] px-4 py-2 text-sm font-semibold tracking-wide text-white shadow-sm transition hover:bg-[#c2622b]"
              >
                Create Event
              </Link>
            )}
            {status === 'authenticated' ? (
              <>
                {canManageEvents && (
                  <Link
                    href="/dashboard"
                    className={pathname.startsWith('/dashboard') ? 'font-semibold text-[#d8763d]' : 'font-medium text-gray-600 hover:text-gray-900'}
                  >
                    Dashboard
                  </Link>
                )}
                <div ref={accountMenuRef} className="relative">
                  <button
                    type="button"
                    className="inline-flex max-w-[260px] items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1.5 transition hover:bg-gray-50 lg:max-w-none lg:gap-3 lg:px-2.5"
                    onClick={() => setAccountMenuOpen((open) => !open)}
                    aria-haspopup="menu"
                    aria-expanded={accountMenuOpen}
                  >
                    <div className="h-8 w-8 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                      {shouldRenderAvatarImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={avatarSrc}
                          alt="Profile"
                          className="h-full w-full object-cover"
                          onError={() => setFailedAvatarSrc(avatarSrc)}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-600">
                          {avatarFallback}
                        </div>
                      )}
                    </div>
                    <div className="hidden min-w-0 text-left leading-tight sm:block">
                      <p className="truncate text-sm font-medium text-gray-900">{displayName}</p>
                      <p className="hidden truncate text-xs text-gray-500 lg:block">{session.user.email}</p>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition ${accountMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {accountMenuOpen && (
                    <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                      <Link
                        href={profileHref}
                        className={`block px-4 py-2 text-sm ${pathname.startsWith(profileHref) ? 'font-semibold text-[#d8763d]' : 'text-gray-700 hover:bg-gray-50'}`}
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        View profile
                      </Link>
                      <button
                        type="button"
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => {
                          setAccountMenuOpen(false)
                          signOut({ callbackUrl: '/' })
                        }}
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </nav>
    </header>
  )
}
