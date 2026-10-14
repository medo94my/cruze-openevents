"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search, X } from "lucide-react"

export type CruzeEvent = {
  id: string
  slug: string
  title: string
  description: string | null
  coverImage: string | null
  startDate: string
  endDate: string
  city: string
  venue: string
  isDemo: boolean
  ticketPrice: number | null
  currency: string
}

interface CruzeHomeProps {
  events: CruzeEvent[]
  compact?: boolean
  initialDate?: string
  initialSearch?: string
}

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop",
]

const CATEGORY_TAGS = [
  "ALL",
  "MUSIC",
  "COMEDY",
  "THEATRE",
  "SPORTS",
  "CULTURE",
  "LIVE",
]

function formatEventDate(isoDate: string): string {
  try {
    const d = new Date(isoDate)
    const day = d.toLocaleDateString("en-US", { day: "2-digit" })
    const month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase()
    const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase()
    return `${day} ${month} / ${time}`
  } catch {
    return "18 NOV / 08:00 PM"
  }
}

const DEMO_ITEMS: CruzeEvent[] = [
  {
    id: "demo-midnight-room",
    slug: "demo-katara-symphony-orchestra",
    title: "The Midnight Room",
    description: "An evocative nocturnal concert of contemporary neo-classical music under the desert stars.",
    coverImage: FALLBACK_IMAGES[0],
    startDate: "2026-11-18T17:00:00.000Z",
    endDate: "2026-11-18T21:00:00.000Z",
    city: "Doha",
    venue: "Katara Amphitheatre",
    isDemo: true,
    ticketPrice: 250,
    currency: "QAR",
  },
  {
    id: "demo-after-hours",
    slug: "demo-lusail-comedy-night",
    title: "After Hours",
    description: "Intimate stand-up and live comedy showcasing Qatar's finest bilingual performers.",
    coverImage: FALLBACK_IMAGES[1],
    startDate: "2026-11-22T16:30:00.000Z",
    endDate: "2026-11-22T19:30:00.000Z",
    city: "Lusail",
    venue: "Marina Promenade",
    isDemo: true,
    ticketPrice: 150,
    currency: "QAR",
  },
  {
    id: "demo-nocturne-seven",
    slug: "demo-museum-islamic-art-gala",
    title: "Nocturne No. 7",
    description: "Avant-garde physical theatre and dramatic lighting installation at MIA Park.",
    coverImage: FALLBACK_IMAGES[2],
    startDate: "2026-11-28T15:30:00.000Z",
    endDate: "2026-11-28T19:30:00.000Z",
    city: "Doha",
    venue: "MIA Auditorium",
    isDemo: true,
    ticketPrice: 320,
    currency: "QAR",
  },
  {
    id: "demo-frequency",
    slug: "demo-desert-acoustic-festival",
    title: "Frequency Live",
    description: "Electronic acoustics, modular synthesizers and cinematic audiovisual immersion.",
    coverImage: FALLBACK_IMAGES[3],
    startDate: "2026-12-02T16:00:00.000Z",
    endDate: "2026-12-02T21:00:00.000Z",
    city: "Al Wakrah",
    venue: "Heritage Village",
    isDemo: true,
    ticketPrice: 180,
    currency: "QAR",
  },
  {
    id: "demo-stand-alone",
    slug: "demo-doha-film-heritage-night",
    title: "Between Rooms",
    description: "An architectural exploration of Arab cinema, retrospectives and sound design.",
    coverImage: FALLBACK_IMAGES[4],
    startDate: "2026-12-06T15:00:00.000Z",
    endDate: "2026-12-06T19:00:00.000Z",
    city: "Doha",
    venue: "Fire Station Cinema",
    isDemo: true,
    ticketPrice: 120,
    currency: "QAR",
  },
  {
    id: "demo-open-field",
    slug: "demo-qatar-grand-prix-fan-zone",
    title: "Open Field",
    description: "High-octane fan experience, live telemetry simulators, and outdoor concert stage.",
    coverImage: FALLBACK_IMAGES[5],
    startDate: "2026-12-10T14:00:00.000Z",
    endDate: "2026-12-10T20:00:00.000Z",
    city: "Lusail",
    venue: "Lusail International Circuit",
    isDemo: true,
    ticketPrice: 450,
    currency: "QAR",
  },
]

export function CruzeHome({ events, initialSearch = "" }: CruzeHomeProps) {
  const [search, setSearch] = useState(initialSearch)
  const [selectedCategory, setSelectedCategory] = useState("ALL")

  const displayEvents = useMemo(() => {
    if (events.length >= 6) return events
    return [...events, ...DEMO_ITEMS]
  }, [events])

  const filteredEvents = useMemo(() => {
    return displayEvents.filter((ev) => {
      const matchSearch =
        search === "" ||
        ev.title.toLowerCase().includes(search.toLowerCase()) ||
        ev.venue.toLowerCase().includes(search.toLowerCase()) ||
        ev.city.toLowerCase().includes(search.toLowerCase())
      return matchSearch
    })
  }, [displayEvents, search])

  return (
    <div className="seatwise-canvas min-h-screen text-[#f1efe8]">
      {/* Background Micro-grain & Warm Radial Glow */}
      <div className="seatwise-grain" />
      <div className="seatwise-glow" />

      {/* Main Content Container */}
      <main className="relative z-10 mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12">
        {/* =========================================================================
            SECTION 1: HERO ("CLAIM.")
            Exact SeatWise typography: massive clamp uppercase with accent dot
            ========================================================================= */}
        <section id="top" className="border-b border-[#f1efe8]/15 pt-12 pb-20 sm:pt-20 sm:pb-32 lg:pt-28 lg:pb-36">
          {/* Top Eyebrow Telemetry */}
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.24em] text-[#f1efe8]/50">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d8763d]" />
              LIVE EVENTS · EXACT SEATING · REAL TIME
            </span>
            <span>QATAR / ASIA/QATAR / 2026</span>
          </div>

          {/* Monolithic CLAIM. Display */}
          <div className="mt-10 sm:mt-16">
            <h1 className="seatwise-hero-title">
              CLAIM<span className="text-[#d8763d]">.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg font-medium leading-tight tracking-tight text-[#f1efe8]/75 sm:text-2xl sm:leading-snug">
              Find the event. Choose the exact seat. Make it yours.
            </p>

            {/* Action Bar */}
            <div className="mt-12 flex flex-wrap items-center gap-6 sm:mt-14">
              <a href="#event-universe" className="seatwise-btn">
                <span>01 / Explore Find Events</span>
                <span className="seatwise-btn-arrow">↗</span>
              </a>

              <a
                href="#happening"
                className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#f1efe8]/60 transition-colors hover:text-[#f1efe8]"
              >
                Happening Next ({filteredEvents.length}) ↓
              </a>
            </div>
          </div>

          {/* Bottom Telemetry Coordinates Bar */}
          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-[#f1efe8]/10 pt-6 font-mono text-[9.5px] uppercase tracking-[0.2em] text-[#f1efe8]/40 sm:mt-24">
            <span>CRUZE LIVE TICKETING SYSTEM</span>
            <span>25° 17′ N · 51° 32′ E · DOHA</span>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: "EVENT UNIVERSE."
            SeatWise signature 3D perspective gallery with category axis
            ========================================================================= */}
        <section id="event-universe" className="border-b border-[#f1efe8]/15 py-24 sm:py-32">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#f1efe8]/50">
                02 / EXPERIENCES · QATAR
              </span>
              <h2 className="seatwise-section-title mt-4">
                EVENT<br />UNIVERSE<span className="text-[#d8763d]">.</span>
              </h2>
            </div>
            <Link
              href="/events"
              className="seatwise-btn !py-2.5 !px-5 self-start sm:self-auto text-[10.5px]"
            >
              <span>View All Events</span>
              <span className="seatwise-btn-arrow">↗</span>
            </Link>
          </div>

          {/* Category Axis Line */}
          <div className="my-10 flex items-center gap-4 sm:my-14">
            <span className="h-px flex-1 bg-[#f1efe8]/15" />
            <p className="font-mono text-[8.5px] sm:text-[10px] uppercase tracking-[0.22em] text-[#d8763d]">
              MUSIC · COMEDY · THEATRE · SPORTS · CULTURE · LIVE
            </p>
            <span className="h-px flex-1 bg-[#f1efe8]/15" />
          </div>

          {/* 3D Perspective Card World (SeatWise Signature) */}
          <div className="seatwise-universe-world pb-6">
            <div className="flex gap-6 sm:gap-8 min-w-max px-2">
              {displayEvents.slice(0, 8).map((event, index) => {
                const img = event.coverImage || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]
                const indexNum = String(index + 1).padStart(2, "0")
                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.slug}`}
                    className="group seatwise-card-3d w-[220px] sm:w-[280px] lg:w-[320px] bg-[#171714] block"
                  >
                    {/* Background Image with Scale Zoom */}
                    <div
                      className="seatwise-card-img absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out"
                      style={{ backgroundImage: `url('${img}')` }}
                    />

                    {/* Gradient Shade Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 group-hover:from-black/95 transition-opacity duration-500" />

                    {/* Top Index Number */}
                    <span className="absolute top-4 left-5 z-10 font-mono text-[11px] font-bold tracking-[0.16em] text-[#f1efe8]/80 group-hover:text-[#f1efe8]">
                      {indexNum}
                    </span>

                    {/* Bottom Info Drawer (Slides up smoothly on hover) */}
                    <div className="seatwise-card-drawer absolute bottom-0 left-0 right-0 z-20 p-5 border-t border-[#f1efe8]/15 bg-[#11110f]/90 backdrop-blur-md opacity-90 sm:opacity-0 transition-all duration-300">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#f1efe8] truncate">
                          {event.title}
                        </span>
                        <span className="text-[#d8763d] text-sm transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                          ↗
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-[#f1efe8]/50 uppercase tracking-widest">
                        <span>{event.city}</span>
                        <span className="text-[#d8763d]">
                          {event.ticketPrice ? `${event.ticketPrice} ${event.currency}` : "FREE"}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: "HAPPENING NEXT."
            Asymmetric Alternating 12-Column Zig-Zag Rows (Exact SeatWise Pattern)
            ========================================================================= */}
        <section id="happening" className="border-b border-[#f1efe8]/15 py-24 sm:py-32">
          {/* Section Titles */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 pb-12 border-b border-[#f1efe8]/20">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#f1efe8]/50">
                03 / CURATED LINEUP
              </span>
              <h2 className="seatwise-section-title mt-4">
                Happening<br />Next<span className="text-[#d8763d]">.</span>
              </h2>
            </div>
            <p className="max-w-md font-mono text-xs uppercase tracking-[0.14em] text-[#f1efe8]/60 leading-relaxed">
              Music, comedy, theatre and live experiences in Qatar. Pick the event. Then pick exactly where you sit.
            </p>
          </div>

          {/* Interactive Search & Quick Filters */}
          <div className="my-10 flex flex-wrap items-center justify-between gap-6 border-b border-[#f1efe8]/15 pb-8">
            <div className="flex flex-1 min-w-[280px] max-w-[500px] items-center gap-3 border border-[#f1efe8]/20 bg-transparent px-4 py-3">
              <Search size={16} className="text-[#d8763d]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="SEARCH EXPERIENCES, VENUES, ARTISTS..."
                className="w-full bg-transparent font-mono text-xs text-[#f1efe8] uppercase tracking-wider outline-none placeholder:text-[#f1efe8]/30"
              />
              {search && (
                <button type="button" onClick={() => setSearch("")} aria-label="Clear">
                  <X size={14} className="text-[#f1efe8]/50 hover:text-white" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {CATEGORY_TAGS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all ${
                    selectedCategory === cat
                      ? "border border-[#d8763d] bg-[#d8763d] text-[#11110f] font-bold"
                      : "border border-[#f1efe8]/15 text-[#f1efe8]/60 hover:text-[#f1efe8] hover:border-[#f1efe8]/40"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Zig-Zag Alternating Event Rows */}
          <div className="divide-y divide-[#f1efe8]/20">
            {filteredEvents.map((event, idx) => {
              const indexNum = String(idx + 1).padStart(2, "0")
              const img = event.coverImage || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]
              const dateStr = formatEventDate(event.startDate)
              const isEven = idx % 2 === 0

              return (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="group grid grid-cols-1 md:grid-cols-12 md:gap-8 py-10 sm:py-14 transition-colors hover:bg-[#f1efe8]/[0.02]"
                >
                  {/* Left Column: Number Index */}
                  <div className="mb-4 md:col-span-1 md:mb-0">
                    <span className="font-mono text-sm font-semibold tracking-wider text-[#d8763d]">
                      {indexNum}
                    </span>
                  </div>

                  {isEven ? (
                    <>
                      {/* Image (col-span-5) */}
                      <div className="overflow-hidden md:col-span-5 aspect-[16/10] bg-[#171714]">
                        <div
                          className="h-full w-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          style={{ backgroundImage: `url('${img}')` }}
                        />
                      </div>

                      {/* Content (col-span-6) */}
                      <div className="mt-6 flex flex-col justify-between md:col-span-6 md:mt-0">
                        {/* Top: Category & Arrow */}
                        <div className="flex items-start justify-between">
                          <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-[#f1efe8]/50">
                            {event.city} · LIVE
                          </span>
                          <span className="text-xl transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 text-[#f1efe8]">
                            ↗
                          </span>
                        </div>

                        {/* Middle: Giant Title */}
                        <div className="my-6 sm:my-8">
                          <h3 className="seatwise-card-title text-[#f1efe8] group-hover:text-[#d8763d] transition-colors">
                            {event.title}
                          </h3>
                        </div>

                        {/* Bottom: Date & Price Bar */}
                        <div className="flex items-end justify-between border-t border-[#f1efe8]/20 pt-4 font-mono">
                          <div className="text-[10px] uppercase leading-relaxed tracking-[0.14em] text-[#f1efe8]/80">
                            <div>{dateStr}</div>
                            <div className="text-[#f1efe8]/50">{event.venue}</div>
                          </div>
                          <div className="text-right">
                            <span className="text-[8.5px] uppercase tracking-[0.18em] text-[#f1efe8]/45">
                              From
                            </span>
                            <div className="text-lg sm:text-xl font-bold tracking-tight text-[#f1efe8]">
                              {event.ticketPrice ? `${event.ticketPrice} ${event.currency}` : "FREE"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Content (col-span-5) for alternating row */}
                      <div className="order-2 mt-6 flex flex-col justify-between md:order-none md:col-span-5 md:mt-0">
                        {/* Top: Category & Arrow */}
                        <div className="flex items-start justify-between">
                          <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-[#f1efe8]/50">
                            {event.city} · LIVE
                          </span>
                          <span className="text-xl transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 text-[#f1efe8]">
                            ↗
                          </span>
                        </div>

                        {/* Middle: Giant Title */}
                        <div className="my-6 sm:my-8">
                          <h3 className="seatwise-card-title text-[#f1efe8] group-hover:text-[#d8763d] transition-colors">
                            {event.title}
                          </h3>
                        </div>

                        {/* Bottom: Date & Price Bar */}
                        <div className="flex items-end justify-between border-t border-[#f1efe8]/20 pt-4 font-mono">
                          <div className="text-[10px] uppercase leading-relaxed tracking-[0.14em] text-[#f1efe8]/80">
                            <div>{dateStr}</div>
                            <div className="text-[#f1efe8]/50">{event.venue}</div>
                          </div>
                          <div className="text-right">
                            <span className="text-[8.5px] uppercase tracking-[0.18em] text-[#f1efe8]/45">
                              From
                            </span>
                            <div className="text-lg sm:text-xl font-bold tracking-tight text-[#f1efe8]">
                              {event.ticketPrice ? `${event.ticketPrice} ${event.currency}` : "FREE"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Image (col-span-6) for alternating row */}
                      <div className="order-1 overflow-hidden md:order-none md:col-span-6 aspect-[16/10] bg-[#171714]">
                        <div
                          className="h-full w-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          style={{ backgroundImage: `url('${img}')` }}
                        />
                      </div>
                    </>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Section Footer */}
          <div className="mt-8 flex items-center justify-between border-t border-[#f1efe8]/20 pt-6 font-mono text-[10px] uppercase tracking-wider text-[#f1efe8]/50">
            <span>CRUZE / EVENTS / 2026</span>
            <Link href="/events" className="group flex items-center gap-2 text-[#f1efe8] hover:text-[#d8763d] transition-colors">
              <span>View All Experiences</span>
              <span className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
            </Link>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: "INSIDE CRUZE."
            Swiss Industrial 4-Column Architectural Operational Grid
            ========================================================================= */}
        <section className="border-b border-[#f1efe8]/15 py-24 sm:py-32">
          <div className="max-w-2xl">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#d8763d]">
              04 / ARCHITECTURE & STANDARDS
            </span>
            <h2 className="seatwise-section-title mt-4">
              INSIDE<br />CRUZE<span className="text-[#d8763d]">.</span>
            </h2>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-[#f1efe8]/65 leading-relaxed">
              Curated access to Qatar&apos;s defining cultural, musical, and sporting gatherings. Built for complete certainty.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 border-t border-[#f1efe8]/20 pt-12">
            <div className="border-t border-[#d8763d] pt-4">
              <span className="font-mono text-[11px] font-bold text-[#d8763d]">01</span>
              <h4 className="mt-3 text-base font-bold uppercase tracking-tight text-[#f1efe8]">
                Curated Access
              </h4>
              <p className="mt-3 font-mono text-xs uppercase tracking-wider text-[#f1efe8]/60 leading-relaxed">
                Cruze staff directly verifies and manages event partnerships across Qatar. No unauthorized third-party listings.
              </p>
            </div>

            <div className="border-t border-[#d8763d] pt-4">
              <span className="font-mono text-[11px] font-bold text-[#d8763d]">02</span>
              <h4 className="mt-3 text-base font-bold uppercase tracking-tight text-[#f1efe8]">
                Exact Seating
              </h4>
              <p className="mt-3 font-mono text-xs uppercase tracking-wider text-[#f1efe8]/60 leading-relaxed">
                Choose the exact tier, section, and seat with live inventory synchronization.
              </p>
            </div>

            <div className="border-t border-[#d8763d] pt-4">
              <span className="font-mono text-[11px] font-bold text-[#d8763d]">03</span>
              <h4 className="mt-3 text-base font-bold uppercase tracking-tight text-[#f1efe8]">
                Universal Checkout
              </h4>
              <p className="mt-3 font-mono text-xs uppercase tracking-wider text-[#f1efe8]/60 leading-relaxed">
                Powered by a modular payment gateway adapter with instant Apple Pay, credit cards, and regional Qatari rails.
              </p>
            </div>

            <div className="border-t border-[#d8763d] pt-4">
              <span className="font-mono text-[11px] font-bold text-[#d8763d]">04</span>
              <h4 className="mt-3 text-base font-bold uppercase tracking-tight text-[#f1efe8]">
                Asia/Qatar Sync
              </h4>
              <p className="mt-3 font-mono text-xs uppercase tracking-wider text-[#f1efe8]/60 leading-relaxed">
                Native QAR pricing, Friday-Saturday weekend alignment, and real-time QR ticket validation.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: BOTTOM CALL TO ACTION
            ========================================================================= */}
        <section className="py-24 sm:py-32 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#f1efe8]/50">
              05 / READY TO EXPERIENCE
            </span>
            <h2 className="seatwise-section-title mt-4">
              CLAIM YOUR<br />PLACE<span className="text-[#d8763d]">.</span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Link href="/events" className="seatwise-btn">
              <span>Explore All Experiences</span>
              <span className="seatwise-btn-arrow">↗</span>
            </Link>
            <a
              href="#top"
              className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#f1efe8]/50 hover:text-[#f1efe8] transition-colors"
            >
              Back to Top ↑
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}
