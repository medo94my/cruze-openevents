"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { ArrowUpRight, MapPin } from "lucide-react"

type FooterLink = { label: string; href: string; external?: boolean }
type FooterProps = {
  platformName?: string
  tagline?: string
  links?: FooterLink[]
}

const links: FooterLink[] = [
  { label: "About us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
]

export function Footer({ tagline, links: overrideLinks }: FooterProps) {
  const { data: session } = useSession()
  const canManage = session?.user?.roles?.includes("SUPER_ADMIN") || session?.user?.roles?.includes("ORGANIZER")

  return (
    <footer className="border-t border-white/[0.08] bg-[#0c0d12] text-[#e3e1e9] print:hidden">
      <div className="mx-auto max-w-[1300px] px-6 pb-12 pt-20 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 gap-12 border-b border-white/[0.08] pb-14 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" className="group inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8A1538] to-[#5C1026] text-xl font-black text-white shadow-[0_4px_14px_rgba(138,21,56,0.35)] transition-transform duration-300 group-hover:scale-105">
                C<span className="text-[#e8bc91]">.</span>
              </span>
              <span className="text-[26px] font-black tracking-[-0.06em] text-white">CRUZE<span className="text-[#8A1538]">.</span></span>
            </Link>
            <p className="mt-5 max-w-sm text-[14px] leading-7 text-[#9da3af]">{tagline || "Discover Qatar. Find your people. Make memories."}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold tracking-wider text-[#d4af37]">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
                <MapPin size={13}/> DOHA · QATAR
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[11px] text-[#9da3af]">
                25.2867° N · 51.5333° E
              </span>
            </div>
          </div>
          <div>
            <h3 className="mb-5 text-[12px] font-bold uppercase tracking-[0.2em] text-[#8A1538]">Discovery Space</h3>
            <div className="flex flex-col gap-3 text-[13.5px] text-[#9da3af]">
              <Link href="/events" className="transition hover:text-white">All experiences</Link>
              <Link href="/events?when=weekend" className="transition hover:text-white">This weekend in Qatar</Link>
              <Link href="/#discover" className="transition hover:text-white">Curated by interest</Link>
              <Link href={canManage ? "/dashboard" : "/login"} className="inline-flex items-center gap-1.5 text-[#e8bc91] transition hover:text-white">
                {canManage ? "Staff dashboard" : "Staff sign in"}
                <ArrowUpRight size={13}/>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="mb-5 text-[12px] font-bold uppercase tracking-[0.2em] text-[#8A1538]">Platform</h3>
            <div className="flex flex-col gap-3 text-[13.5px] text-[#9da3af]">
              {(overrideLinks || links).map((link) => link.external ? (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">{link.label}</a>
              ) : (
                <Link key={link.href} href={link.href} className="transition hover:text-white">{link.label}</Link>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 pt-8 text-[12px] text-[#6d7485]">
          <span>© {new Date().getFullYear()} Cruze Events. Engineered for Qatar.</span>
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px]">
            Design preview · Sample events are fictional
          </span>
        </div>
      </div>
    </footer>
  )
}
