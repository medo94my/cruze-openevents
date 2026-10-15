'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

type MenuItem = {
  number: string
  title: string
  href: string
  meta: string
}

export function SiteMenu() {
  const [open, setOpen] = useState(false)
  const [activeItem, setActiveItem] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isOrganizer = session?.user?.roles?.includes('ORGANIZER')
  const isSuperAdmin = session?.user?.roles?.includes('SUPER_ADMIN')
  const canManageEvents = Boolean(isOrganizer || isSuperAdmin)

  const accountItem: MenuItem = session
    ? {
        number: '05',
        title: canManageEvents ? 'Curator Profile' : 'My Account',
        href: canManageEvents ? '/dashboard/profile' : '/orders',
        meta: session.user?.name || session.user?.email || 'My Account',
      }
    : {
        number: '05',
        title: 'Sign In',
        href: '/login',
        meta: 'Sign in / Create account',
      }

  const baseItems: MenuItem[] = [
    {
      number: '01',
      title: 'Home',
      href: '/',
      meta: 'Claim your place',
    },
    {
      number: '02',
      title: 'Universe',
      href: '/#event-universe',
      meta: 'Kinetic 3D Orbit',
    },
    {
      number: '03',
      title: 'Events',
      href: '/events',
      meta: "What's happening in Qatar",
    },
    {
      number: '04',
      title: 'My Tickets',
      href: '/orders',
      meta: 'Your booked seats & passes',
    },
    accountItem,
    canManageEvents
      ? {
          number: '06',
          title: 'Curator',
          href: '/dashboard',
          meta: 'Event Management & Check-in',
        }
      : {
          number: '06',
          title: 'About Cruze',
          href: '/about',
          meta: 'Exact seating engineered for Qatar',
        },
  ]

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        setActiveItem(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const closeMenu = () => {
    setOpen(false)
    setActiveItem(null)
  }

  const menuContent = (
    <div
      className={`seatwise-menu ${open ? 'seatwise-menu--open' : ''}`}
      aria-hidden={!open}
    >
      {/* Architectural grid overlay */}
      <div className="seatwise-menu__grid" />

      {/* Top bar */}
      <div className="seatwise-menu__top">
        <div>
          <div className="seatwise-menu__brand">
            CRUZE
            <sup>®</sup>
          </div>
          <div className="seatwise-menu__brand-sub">
            LIVE EVENT EXPERIENCES · QATAR
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="seatwise-menu__edition">
            QAT / 2026
          </div>
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close navigation menu"
            className="flex items-center gap-2 border border-white/20 bg-white/10 px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-[#f1efe8] hover:border-[#d8763d] hover:bg-[#d8763d] hover:text-[#11110f] transition-all cursor-pointer"
          >
            <span>Close</span>
            <span className="text-base leading-none">✕</span>
          </button>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="seatwise-menu__nav">
        {baseItems.map((item, index) => (
          <Link
            key={item.title}
            href={item.href}
            className="seatwise-menu__item"
            style={{
              transitionDelay: open ? `${140 + index * 70}ms` : '0ms',
            }}
            onMouseEnter={() => setActiveItem(index)}
            onMouseLeave={() => setActiveItem(null)}
            onClick={closeMenu}
          >
            <span className="seatwise-menu__number">{item.number}</span>

            <span className="seatwise-menu__title">{item.title}</span>

            <span className="seatwise-menu__meta">{item.meta}</span>

            <span
              className={`seatwise-menu__dot ${
                activeItem === index ? 'seatwise-menu__dot--active' : ''
              }`}
            />
          </Link>
        ))}
      </nav>

      {/* Bottom metadata */}
      <div className="seatwise-menu__bottom">
        <span>DISCOVER / BOOK / BE THERE</span>
        <span>LIVE EXPERIENCES / DOHA · QATAR</span>
        <span>© 2026 CRUZE EVENTS</span>
      </div>
    </div>
  )

  return (
    <>
      {/* =====================================================
          MENU TRIGGER
      ===================================================== */}
      <button
        type="button"
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`seatwise-menu-trigger ${open ? 'seatwise-menu-trigger--open' : ''}`}
      >
        <span className="seatwise-menu-trigger__label">
          {open ? 'Close' : 'Menu'}
        </span>

        <span className="seatwise-menu-trigger__circle">
          <span className="seatwise-menu-trigger__line seatwise-menu-trigger__line--one" />
          <span className="seatwise-menu-trigger__line seatwise-menu-trigger__line--two" />
        </span>
      </button>

      {/* =====================================================
          FULLSCREEN MENU PORTAL (Escapes header backdrop-filter)
      ===================================================== */}
      {mounted ? createPortal(menuContent, document.body) : null}
    </>
  )
}

export default SiteMenu
