'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, ChevronDown, MapPin, Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

type HeaderProps = {
  platformName?: string
  platformLogo?: string
  brandColor?: string
}

export function Header({ platformName = 'OpenEvents', platformLogo, brandColor }: HeaderProps) {
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

  // Determine route context for conditional rendering
  const isOrganizerRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin')
  const isAuthPage =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/verify-email') ||
    pathname.startsWith('/choose-password')

  // Show full auth UI (login/register buttons) on organizer routes.
  // On public pages and auth pages, keep header minimal for logged-out users.
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
      <header className="sticky top-0 z-50 border-b border-[#e9d8d2] bg-[#fbf8f3]/95 text-[#321d28] backdrop-blur-xl print:hidden">
        <nav className="mx-auto flex h-[74px] max-w-[1350px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
          <Link href="/" className="flex items-center gap-3" aria-label="Cruze Doha home">
            <span className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-[#641633] text-[23px] font-black tracking-[-0.08em] text-white">C<span className="text-[#e4b98c]">.</span></span>
            <span className="flex flex-col leading-none">
              <span className="text-[23px] font-black tracking-[-0.07em] text-[#48142d]">CRUZE<span className="text-[#b57d83]">.</span></span>
              <span className="mt-1 text-[9px] font-extrabold tracking-[0.31em] text-[#a16c7a]">DOHA EXPERIENCES</span>
            </span>
          </Link>
          <div className="hidden items-center gap-8 lg:flex">
            <Link href="/events" className="text-[14px] font-bold text-[#4b3540] transition hover:text-[#9e365b]">Discover events</Link>
            <Link href="/events?when=weekend" className="text-[14px] font-bold text-[#4b3540] transition hover:text-[#9e365b]">This weekend</Link>
            <Link href="/#discover" className="text-[14px] font-bold text-[#4b3540] transition hover:text-[#9e365b]">Explore by interest</Link>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <span className="me-2 hidden items-center gap-1.5 text-xs font-semibold text-[#977b85] xl:inline-flex"><MapPin size={14}/>Qatar</span>
            {canManageEvents ? (
              <Link href="/dashboard" className="rounded-full border border-[#d8bdc5] px-5 py-2.5 text-sm font-bold text-[#641633] transition hover:bg-[#f2e9e3]">Dashboard</Link>
            ) : status === 'authenticated' ? (
              <Link href="/dashboard/profile" className="rounded-full border border-[#d8bdc5] px-5 py-2.5 text-sm font-bold text-[#641633]">My account</Link>
            ) : (
              <Link href="/login" className="rounded-full border border-[#d8bdc5] px-5 py-2.5 text-sm font-bold text-[#641633] transition hover:bg-[#f2e9e3]">Sign in</Link>
            )}
            <Link href="/events" className="inline-flex items-center gap-2 rounded-full bg-[#641633] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#812849]">Explore <ArrowUpRight size={16}/></Link>
          </div>
          <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e8dcd5] text-[#641633] sm:hidden" aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)}>
            {mobileMenuOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </nav>
        {mobileMenuOpen && (
          <div className="border-t border-[#e5d8d0] bg-[#fbf8f3] px-5 py-5 sm:hidden">
            <div className="flex flex-col gap-3 text-sm font-bold">
              <Link href="/events" onClick={() => setMobileMenuOpen(false)}>Discover events</Link>
              <Link href="/events?when=weekend" onClick={() => setMobileMenuOpen(false)}>This weekend</Link>
              <Link href="/#discover" onClick={() => setMobileMenuOpen(false)}>Explore by interest</Link>
              <Link href={canManageEvents ? '/dashboard' : status === 'authenticated' ? '/dashboard/profile' : '/login'} onClick={() => setMobileMenuOpen(false)} className="mt-2 rounded-full bg-[#641633] px-4 py-3 text-center text-white">{canManageEvents ? 'Dashboard' : status === 'authenticated' ? 'My account' : 'Sign in'}</Link>
            </div>
          </div>
        )}
      </header>
    )
  }

  return (
    <header className={isPublicPage ? "sticky top-0 z-40 border-b border-[#ecdfd9] bg-[#fffbf6]/95 backdrop-blur-lg print:hidden" : "bg-white border-b border-gray-200 print:hidden"}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              {platformLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={platformLogo} alt={platformName} className="h-8 w-auto sm:h-9" />
              ) : (
                <span className="text-xl font-extrabold tracking-tight sm:text-2xl" style={{ color: brandColor || 'var(--brand-color)' }}>{platformName}</span>
              )}
            </Link>
          </div>

          {isPublicPage && (
            <div className="hidden items-center gap-6 md:flex">
              <Link href="/events" className="text-sm font-semibold text-[#473039] transition hover:text-[#8a1538]">Explore events</Link>
              <Link href="/events?when=weekend" className="text-sm font-semibold text-[#685760] transition hover:text-[#8a1538]">This weekend</Link>
              <Link href="/events?q=culture" className="hidden text-sm font-semibold text-[#685760] transition hover:text-[#8a1538] lg:block">Culture & more</Link>
            </div>
          )}
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {canManageEvents && (
              <Link
                href="/create-event"
                className="inline-flex min-w-[132px] items-center justify-center rounded-lg bg-[#5C8BD9] px-4 py-2 text-sm font-semibold tracking-wide text-white shadow-sm transition hover:bg-[#4a7ac8]"
              >
                Create Event
              </Link>
            )}
            {status === 'authenticated' ? (
              <>
                {canManageEvents && (
                  <Link
                    href="/dashboard"
                    className={pathname.startsWith('/dashboard') ? 'text-[#5C8BD9] font-semibold' : 'text-gray-600 hover:text-gray-900 font-medium'}
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

                  {accountMenuOpen ? (
                    <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                      <Link
                        href={profileHref}
                        className={`block px-4 py-2 text-sm ${pathname.startsWith(profileHref) ? 'text-[#5C8BD9] font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
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
                  ) : null}
                </div>
              </>
            ) : status === 'unauthenticated' ? (
              isAuthPage || isPublicPage ? null : (
                <div className="flex items-center space-x-4">
                  <Link href="/login">
                    <Button variant="ghost" className={pathname === '/login' ? 'text-[#5C8BD9] font-semibold' : ''}>Sign In</Button>
                  </Link>
                  <Link href="/register">
                    <Button className={`tracking-wide ${pathname === '/register' ? 'font-semibold' : ''}`}>Get Started</Button>
                  </Link>
                </div>
              )
            ) : null}
          </div>

          {isPublicPage && <Link href="/events" className="ml-auto hidden rounded-full bg-[#8a1538] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#68122e] md:inline-flex">Find an experience</Link>}
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="rounded-md p-1 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="space-y-2 border-t border-gray-100 py-4 md:hidden">
            {canManageEvents && (
              <Link
                href="/create-event"
                className="block rounded-lg bg-[#5C8BD9] px-3 py-2.5 text-center text-sm font-semibold tracking-wide text-white hover:bg-[#4a7ac8]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Create Event
              </Link>
            )}

            {status === 'authenticated' ? (
              <>
                {canManageEvents && (
                  <Link
                    href="/dashboard"
                    className={`block px-3 py-2 rounded-md ${pathname.startsWith('/dashboard') ? 'text-[#5C8BD9] font-semibold' : 'text-gray-600 hover:bg-gray-50 font-medium'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  href={profileHref}
                  className={`block px-3 py-2 rounded-md ${pathname.startsWith(profileHref) ? 'text-[#5C8BD9] font-semibold' : 'text-gray-600 hover:bg-gray-50 font-medium'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  View profile
                </Link>
                <button
                  className="block w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    signOut({ callbackUrl: '/' })
                  }}
                >
                  Sign out
                </button>
              </>
            ) : status === 'unauthenticated' ? (
              isAuthPage || isPublicPage ? null : (
                <>
                  <Link
                    href="/login"
                    className={`block px-3 py-2 rounded-md ${pathname === '/login' ? 'text-[#5C8BD9] font-semibold' : 'text-gray-600 hover:bg-gray-50 font-medium'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className={`block px-3 py-2 rounded-md tracking-wide text-[#5C8BD9] ${pathname === '/register' ? 'font-semibold' : 'font-medium hover:bg-gray-50'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )
            ) : null}
          </div>
        )}
      </nav>
    </header>
  )
}
