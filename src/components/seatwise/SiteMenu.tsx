'use client'

import { useEffect, useState } from 'react'
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
  const { data: session } = useSession()

  const isOrganizer = session?.user?.roles?.includes('ORGANIZER')
  const isSuperAdmin = session?.user?.roles?.includes('SUPER_ADMIN')
  const canManageEvents = Boolean(isOrganizer || isSuperAdmin)

  const accountItem: MenuItem = session
    ? {
        number: '05',
        title: 'Account',
        href: '/dashboard/profile',
        meta: session.user?.name || session.user?.email || 'My Profile',
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
      title: 'Discover',
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
          title: 'Contact',
          href: '/events',
          meta: 'Doha · Qatar',
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
          FULLSCREEN MENU
      ===================================================== */}
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

          <div className="seatwise-menu__edition">
            QAT / 2026
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
    </>
  )
}

export default SiteMenu
