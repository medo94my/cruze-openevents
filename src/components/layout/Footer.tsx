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
    <footer className="bg-[#25121e] text-[#eee0e4] print:hidden">
      <div className="mx-auto max-w-[1300px] px-6 pb-8 pt-16 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 gap-10 border-b border-white/15 pb-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8a2749] text-xl font-black text-white">C<span className="text-[#edc39d]">.</span></span>
              <span className="text-[28px] font-black tracking-[-0.06em] text-white">CRUZE<span className="text-[#e9b48b]">.</span></span>
            </Link>
            <p className="mt-5 max-w-xs text-[14px] leading-7 text-[#cbb6c0]">{tagline || "Discover Qatar. Find your people. Make memories."}</p>
            <p className="mt-5 inline-flex items-center gap-2 text-xs font-bold tracking-[0.13em] text-[#ecb998]"><MapPin size={15}/>DOHA · QATAR</p>
          </div>
          <div>
            <h3 className="mb-5 text-[13px] font-bold uppercase tracking-[0.15em] text-white">Discover</h3>
            <div className="flex flex-col gap-3 text-sm text-[#d6c5cc]">
              <Link href="/events" className="transition hover:text-white">All experiences</Link>
              <Link href="/events?when=weekend" className="transition hover:text-white">This weekend</Link>
              <Link href="/#discover" className="transition hover:text-white">Explore by interest</Link>
              <Link href={canManage ? "/dashboard" : "/login"} className="inline-flex items-center gap-2 text-[#efc9a6] transition hover:text-white">{canManage ? "Organizer dashboard" : "Organizer login"}<ArrowUpRight size={14}/></Link>
            </div>
          </div>
          <div>
            <h3 className="mb-5 text-[13px] font-bold uppercase tracking-[0.15em] text-white">Cruze</h3>
            <div className="flex flex-col gap-3 text-sm text-[#d6c5cc]">
              {(overrideLinks || links).map((link) => link.external ? (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">{link.label}</a>
              ) : (
                <Link key={link.href} href={link.href} className="transition hover:text-white">{link.label}</Link>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-7 text-[12px] text-[#a68f9c]">
          <span>© {new Date().getFullYear()} Cruze Events. A city full of stories.</span>
          <span>Design preview · All listed demo events are fictional.</span>
        </div>
      </div>
    </footer>
  )
}
