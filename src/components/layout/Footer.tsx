'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

type FooterLink = {
  label: string
  href: string
  external?: boolean
}

type FooterProps = {
  platformName?: string
  tagline?: string
  links?: FooterLink[]
}

const DEFAULT_LINKS: FooterLink[] = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
]

export function Footer({
  platformName = 'OpenEvents',
  tagline = 'Organizing events starts here',
  links,
}: FooterProps) {
  const { status } = useSession()
  const showLogin = status === 'unauthenticated'
  const footerLinks = links ?? DEFAULT_LINKS

  return (
    <footer className="border-t border-[#53313a] bg-[#2e1320] text-[#e6cbd2] print:hidden">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-extrabold tracking-tight text-white">
              {platformName}
            </Link>
            {tagline && (
              <p className="mt-2 max-w-sm text-sm text-[#d8b8c3]">
                {tagline}
              </p>
            )}
          </div>

          {/* Links */}
          {footerLinks.length > 0 && (
            <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm sm:gap-x-6">
              {footerLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>
          )}
        </div>

        <div className="mt-8 border-t border-[#5b3945] pt-6">
          {showLogin ? (
            <div className="flex justify-center md:justify-end">
              <Link
                href="/login"
                className="text-sm font-medium text-[#ffd5b4] hover:text-white"
              >
                Organizer Login
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
