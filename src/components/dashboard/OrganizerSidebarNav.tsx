'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'

type NavItem = {
  id: 'scan' | 'overview' | 'events' | 'adminUsers' | 'adminLegal' | 'adminCustomization'
  href: string
  label: string
  badge?: 'attention'
}

function isActive(pathname: string, item: NavItem): boolean {
  switch (item.id) {
    case 'scan':
      return pathname === '/dashboard/scan' || (pathname.startsWith('/dashboard/events/') && pathname.endsWith('/scan'))
    case 'overview':
      return pathname === '/dashboard'
    case 'events':
      return pathname.startsWith('/dashboard/events') && !pathname.endsWith('/scan')
    case 'adminUsers':
      return pathname.startsWith('/dashboard/admin/users')
    case 'adminLegal':
      return pathname.startsWith('/dashboard/admin/legal')
    case 'adminCustomization':
      return pathname.startsWith('/dashboard/admin/customization')
    default:
      return false
  }
}

export function OrganizerSidebarNav() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const isSuperAdmin = session?.user?.roles?.includes('SUPER_ADMIN')
  const mustChangePassword = session?.user?.mustChangePassword ?? false
  const [legalNeedsAttention, setLegalNeedsAttention] = useState(false)
  const [customizationNeedsAttention, setCustomizationNeedsAttention] = useState(false)

  const checkLegalStatus = useCallback(() => {
    if (!isSuperAdmin) return

    fetch('/api/admin/legal')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (!data?.data) return
        const { tos, about, privacy, contact } = data.data
        const allDefaults = !tos?.plainText?.trim() && !about?.plainText?.trim() && !privacy?.plainText?.trim() && !contact?.email && !contact?.phone && !contact?.companyName && !contact?.address
        setLegalNeedsAttention(allDefaults)
      })
      .catch(() => {})
  }, [isSuperAdmin])

  const checkCustomizationStatus = useCallback(() => {
    if (!isSuperAdmin) return

    fetch('/api/admin/homepage')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (!data?.data) return
        const { heroText, heroImage } = data.data
        const isDefault = heroText === 'Events made for business' && !heroImage
        setCustomizationNeedsAttention(isDefault)
      })
      .catch(() => {})
  }, [isSuperAdmin])

  useEffect(() => {
    checkLegalStatus()
    checkCustomizationStatus()

    window.addEventListener('legal-content-updated', checkLegalStatus)
    window.addEventListener('customization-updated', checkCustomizationStatus)
    return () => {
      window.removeEventListener('legal-content-updated', checkLegalStatus)
      window.removeEventListener('customization-updated', checkCustomizationStatus)
    }
  }, [checkLegalStatus, checkCustomizationStatus])

  const navItems: (NavItem & { code: string })[] = [
    { id: 'overview', href: '/dashboard', label: 'Overview', code: '01' },
    { id: 'events', href: '/dashboard/events', label: 'Events', code: '02' },
    { id: 'scan', href: '/dashboard/scan', label: 'Scan Tickets', code: '03' },
  ]
  const adminNavItems: (NavItem & { code: string })[] = [
    { id: 'adminUsers', href: '/dashboard/admin/users', label: 'User Directory', code: '04.1' },
    { id: 'adminLegal', href: '/dashboard/admin/legal', label: 'Legal & Contact', code: '04.2', badge: legalNeedsAttention ? 'attention' : undefined },
    { id: 'adminCustomization', href: '/dashboard/admin/customization', label: 'Platform Theme', code: '04.3', badge: customizationNeedsAttention ? 'attention' : undefined },
  ]

  const profileSectionActive = pathname === '/dashboard/profile' || pathname.startsWith('/dashboard/settings')
  const adminSectionActive = pathname === '/dashboard/admin' || pathname.startsWith('/dashboard/admin/users') || pathname.startsWith('/dashboard/admin/legal') || pathname.startsWith('/dashboard/admin/customization')
  const [adminMenuExpanded, setAdminMenuExpanded] = useState(false)
  const [adminMenuOverride, setAdminMenuOverride] = useState<{ path: string; open: boolean } | null>(null)
  const autoAdminOpen = adminMenuExpanded || adminSectionActive
  const adminOpen = adminMenuOverride?.path === pathname ? adminMenuOverride.open : autoAdminOpen
  const [profileMenuExpanded, setProfileMenuExpanded] = useState(false)
  const [profileMenuOverride, setProfileMenuOverride] = useState<{ path: string; open: boolean } | null>(null)
  const autoProfileOpen = profileMenuExpanded || profileSectionActive
  const profileOpen = profileMenuOverride?.path === pathname ? profileMenuOverride.open : autoProfileOpen

  return (
    <nav className="mt-2 space-y-1.5 text-xs font-mono">
      {navItems.map((item) => {
        const active = isActive(pathname, item)

        return (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-2.5 uppercase tracking-wider transition-colors',
              active
                ? 'bg-white/10 text-[#f1efe8] font-bold border-l-2 border-[#d8763d]'
                : 'text-[#f1efe8]/65 hover:text-[#f1efe8] hover:bg-white/5'
            )}
            aria-current={active ? 'page' : undefined}
          >
            <span className={cn('text-[10px]', active ? 'text-[#d8763d]' : 'text-white/30')}>
              {item.code}
            </span>
            <span>{item.label}</span>
          </Link>
        )
      })}

      {isSuperAdmin ? (
        <div className="pt-2">
          <div className="flex items-center gap-1">
            <Link
              href="/dashboard/admin"
              className={cn(
                'flex-1 flex items-center justify-between rounded-lg px-3 py-2.5 uppercase tracking-wider transition-colors',
                pathname === '/dashboard/admin'
                  ? 'bg-white/10 text-[#f1efe8] font-bold border-l-2 border-[#d8763d]'
                  : 'text-[#f1efe8]/65 hover:text-[#f1efe8] hover:bg-white/5'
              )}
              aria-current={pathname === '/dashboard/admin' ? 'page' : undefined}
            >
              <div className="flex items-center gap-2">
                <span className={cn('text-[10px]', pathname === '/dashboard/admin' ? 'text-[#d8763d]' : 'text-white/30')}>
                  04
                </span>
                <span>Admin</span>
              </div>
              {!adminOpen && (legalNeedsAttention || customizationNeedsAttention) && (
                <span className="h-2 w-2 rounded-full bg-[#d8763d]" aria-label="Items need attention" />
              )}
            </Link>
            <button
              type="button"
              className="rounded-lg p-2 text-[#f1efe8]/60 transition-colors hover:bg-white/5 hover:text-[#f1efe8]"
              aria-label={adminOpen ? 'Collapse admin links' : 'Expand admin links'}
              aria-expanded={adminOpen}
              onClick={() => {
                const nextOpen = !adminOpen
                setAdminMenuExpanded(nextOpen)
                setAdminMenuOverride({ path: pathname, open: nextOpen })
              }}
            >
              <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', adminOpen ? 'rotate-180' : '')} />
            </button>
          </div>

          {adminOpen ? (
            <div className="ml-3 mt-1 space-y-1 border-l border-white/10 pl-3">
              {adminNavItems.map((item) => {
                const active = isActive(pathname, item)

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                      'group relative flex items-center justify-between rounded-lg px-2.5 py-2 uppercase tracking-wider transition-colors',
                      active
                        ? 'bg-white/10 text-[#f1efe8] font-bold border-l-2 border-[#d8763d]'
                        : 'text-[#f1efe8]/60 hover:text-[#f1efe8] hover:bg-white/5'
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn('text-[9px]', active ? 'text-[#d8763d]' : 'text-white/30')}>
                        {item.code}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge === 'attention' && (
                      <span
                        className="h-2 w-2 rounded-full bg-[#d8763d]"
                        aria-label="Needs attention"
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="pt-2">
        <div className="flex items-center gap-1">
          <Link
            href="/dashboard/profile"
            className={cn(
              'flex-1 flex items-center justify-between rounded-lg px-3 py-2.5 uppercase tracking-wider transition-colors',
              pathname === '/dashboard/profile'
                ? 'bg-white/10 text-[#f1efe8] font-bold border-l-2 border-[#d8763d]'
                : 'text-[#f1efe8]/65 hover:text-[#f1efe8] hover:bg-white/5'
            )}
            aria-current={pathname === '/dashboard/profile' ? 'page' : undefined}
          >
            <div className="flex items-center gap-2">
              <span className={cn('text-[10px]', pathname === '/dashboard/profile' ? 'text-[#d8763d]' : 'text-white/30')}>
                05
              </span>
              <span>Profile</span>
            </div>
            {!profileOpen && mustChangePassword && (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d8763d] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#d8763d]" />
              </span>
            )}
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-[#f1efe8]/60 transition-colors hover:bg-white/5 hover:text-[#f1efe8]"
            aria-label={profileOpen ? 'Collapse profile links' : 'Expand profile links'}
            aria-expanded={profileOpen}
            onClick={() => {
              const nextOpen = !profileOpen
              setProfileMenuExpanded(nextOpen)
              setProfileMenuOverride({ path: pathname, open: nextOpen })
            }}
          >
            <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', profileOpen ? 'rotate-180' : '')} />
          </button>
        </div>

        {profileOpen ? (
          <div className="ml-3 mt-1 space-y-1 border-l border-white/10 pl-3">
            <Link
              href="/dashboard/settings"
              className={cn(
                'block rounded-lg px-2.5 py-2 uppercase tracking-wider transition-colors',
                pathname === '/dashboard/settings'
                  ? 'bg-white/10 text-[#f1efe8] font-bold border-l-2 border-[#d8763d]'
                  : 'text-[#f1efe8]/60 hover:text-[#f1efe8] hover:bg-white/5'
              )}
              aria-current={pathname === '/dashboard/settings' ? 'page' : undefined}
            >
              <div className="flex items-center gap-2">
                <span className={cn('text-[9px]', pathname === '/dashboard/settings' ? 'text-[#d8763d]' : 'text-white/30')}>
                  05.1
                </span>
                <span>Profile Settings</span>
              </div>
            </Link>
            <Link
              href="/dashboard/settings/account"
              className={cn(
                'group relative flex items-center justify-between rounded-lg px-2.5 py-2 uppercase tracking-wider transition-colors',
                pathname.startsWith('/dashboard/settings/account')
                  ? 'bg-white/10 text-[#f1efe8] font-bold border-l-2 border-[#d8763d]'
                  : 'text-[#f1efe8]/60 hover:text-[#f1efe8] hover:bg-white/5'
              )}
              aria-current={pathname.startsWith('/dashboard/settings/account') ? 'page' : undefined}
            >
              <div className="flex items-center gap-2">
                <span className={cn('text-[9px]', pathname.startsWith('/dashboard/settings/account') ? 'text-[#d8763d]' : 'text-white/30')}>
                  05.2
                </span>
                <span>Account Settings</span>
              </div>
              {mustChangePassword && (
                <span className="h-2 w-2 rounded-full bg-[#d8763d]" />
              )}
            </Link>
          </div>
        ) : null}
      </div>
    </nav>
  )
}
