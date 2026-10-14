"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"

type FooterLink = { label: string; href: string; external?: boolean }
type FooterProps = {
  platformName?: string
  tagline?: string
  links?: FooterLink[]
}

const DEFAULT_LINKS: FooterLink[] = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
]

export function Footer({ tagline, links: overrideLinks }: FooterProps) {
  const { data: session } = useSession()
  const canManage = session?.user?.roles?.includes("SUPER_ADMIN") || session?.user?.roles?.includes("ORGANIZER")
  const activeLinks = overrideLinks || DEFAULT_LINKS

  return (
    <footer className="border-t border-[#f1efe8]/15 bg-[#11110f] text-[#f1efe8] print:hidden">
      <div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 gap-12 border-b border-[#f1efe8]/15 pb-16 md:grid-cols-12 md:gap-8">
          {/* Brand & Mission (Col 1-5) */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-block">
              <span className="text-[24px] font-black uppercase tracking-[-0.06em] text-[#f1efe8]">
                CRUZE<span className="text-[#d8763d]">®</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm font-mono text-xs uppercase tracking-wider text-[#f1efe8]/60 leading-relaxed">
              {tagline || "Live event ticketing and exact seat discovery. Engineered for Qatar."}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[#d8763d]">
              <span>DOHA · 25° 17′ N · 51° 32′ E</span>
            </div>
          </div>

          {/* Directory Column 1 (Col 6-8) */}
          <div className="md:col-span-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#f1efe8]/40 block mb-4">
              01 / DIRECTORY
            </span>
            <div className="flex flex-col space-y-2.5 font-mono text-[11px] uppercase tracking-wider text-[#f1efe8]/70">
              <Link href="/events" className="hover:text-[#d8763d] transition-colors">
                All Experiences ↗
              </Link>
              <Link href="/#event-universe" className="hover:text-[#d8763d] transition-colors">
                Event Universe
              </Link>
              <Link href="/#happening" className="hover:text-[#d8763d] transition-colors">
                Happening Next
              </Link>
              <Link
                href={canManage ? "/dashboard" : "/login"}
                className="hover:text-[#d8763d] transition-colors"
              >
                {canManage ? "Staff Dashboard" : "Staff Access"}
              </Link>
            </div>
          </div>

          {/* Directory Column 2 (Col 9-12) */}
          <div className="md:col-span-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#f1efe8]/40 block mb-4">
              02 / LEGAL & NETWORK
            </span>
            <div className="flex flex-col space-y-2.5 font-mono text-[11px] uppercase tracking-wider text-[#f1efe8]/70">
              {activeLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#d8763d] transition-colors"
                  >
                    {link.label} ↗
                  </a>
                ) : (
                  <Link key={link.href} href={link.href} className="hover:text-[#d8763d] transition-colors">
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>

        {/* Bottom Telemetry Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#f1efe8]/40">
          <span>© {new Date().getFullYear()} CRUZE EVENTS. ALL RIGHTS RESERVED.</span>
          <span>CURATED IN DOHA, QATAR · REAL TIME SEATING</span>
        </div>
      </div>
    </footer>
  )
}
