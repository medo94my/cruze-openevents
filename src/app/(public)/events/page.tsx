import Link from 'next/link'
import { ArrowLeft, ArrowRight, CalendarDays, Search, SlidersHorizontal, MapPin } from 'lucide-react'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { EventDiscoverCard, type DiscoverEvent, isDemoEvent } from '@/components/cruze/EventDiscoverCard'

export const dynamic = 'force-dynamic'

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> }

const filters = [
  { label: 'All events', value: '' },
  { label: 'This weekend', value: 'weekend' },
  { label: 'This month', value: 'month' },
  { label: 'Free experiences', value: 'free' },
]

function firstParam(value: string | string[] | undefined) {
  const v = Array.isArray(value) ? value[0] : value
  return (v || '').trim().slice(0,100)
}

function qatarWeekendRange(now: Date) {
  const year = Number(new Intl.DateTimeFormat('en-US', { year: 'numeric', timeZone: 'Asia/Qatar' }).format(now))
  const month = Number(new Intl.DateTimeFormat('en-US', { month: 'numeric', timeZone: 'Asia/Qatar' }).format(now))
  const day = Number(new Intl.DateTimeFormat('en-US', { day: 'numeric', timeZone: 'Asia/Qatar' }).format(now))
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay()
  const fridayOffset = (5 - weekday + 7) % 7
  const start = new Date(Date.UTC(year, month - 1, day + fridayOffset, -3))
  // Qatar weekend: Friday & Saturday. Already-passed hours are excluded by the query.
  const end = new Date(start.getTime() + 2 * 24 * 60 * 60 * 1000)
  return { start, end }
}

function href(q: string, when: string, page: number) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (when) params.set('when', when)
  if (page > 1) params.set('page', String(page))
  return `/events?${params.toString()}`
}

export default async function EventsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const q = firstParam(params.q)
  const when = firstParam(params.when)
  const page = Math.max(1, Math.min(1000, Number.parseInt(firstParam(params.page) || '1',10) || 1))
  const pageSize = 12
  const now = new Date()

  const where: Prisma.EventWhereInput = {
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    deletedAt: null,
    endDate: { gte: now },
  }
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { slug: { contains: q, mode: 'insensitive' } },
      { city: { contains: q, mode: 'insensitive' } },
      { venue: { contains: q, mode: 'insensitive' } },
    ]
  }
  if (when === 'weekend') {
    const weekend = qatarWeekendRange(now)
    where.startDate = { gte: weekend.start > now ? weekend.start : now, lt: weekend.end }
  } else if (when === 'month') {
    const local = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Qatar',year:'numeric',month:'2-digit'}).format(now).split('-')
    const end = new Date(Date.UTC(Number(local[0]), Number(local[1]), 1, -3))
    where.startDate = { gte: now, lt: end }
  } else if (when === 'free') {
    where.ticketTypes = { some: { price: 0, isVisible: true } }
  }

  const [rows,total] = await prisma.$transaction([
    prisma.event.findMany({
      where,
      select: {
        id: true, slug: true, title: true, description: true, coverImage: true,
        startDate: true, venue: true, city: true, country: true,
        ticketTypes: { where: { isVisible: true }, select: { price: true, currency: true } },
      },
      orderBy: [{ startDate: 'asc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.event.count({ where }),
  ])
  const events: DiscoverEvent[] = rows
  const totalPages = Math.max(1,Math.ceil(total/pageSize))
  const anyDemo = events.some(e=>isDemoEvent(e.slug))

  return (
    <div className="min-h-screen bg-[#fbf8f4] text-[#302329]">
      <section className="relative overflow-hidden bg-[#321221] px-5 py-14 text-white sm:px-8 sm:py-20">
        <div className="absolute -right-24 -top-40 h-96 w-96 rounded-full border border-white/10" />
        <div className="absolute -bottom-48 right-1/3 h-96 w-96 rounded-full border border-white/10" />
        <div className="relative mx-auto max-w-7xl">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#dfb8c4] hover:text-white"><ArrowLeft className="h-4 w-4"/> Back to Cruze</Link>
          <div className="mt-6 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[.24em] text-[#e8b4b2]">What's happening around you</p>
              <h1 className="text-[clamp(2.8rem,5vw,4.5rem)] font-semibold leading-tight tracking-[-.05em]">Explore Doha<span className="font-serif italic text-[#ffd0aa]">.</span></h1>
              <p className="mt-3 max-w-xl text-base leading-7 text-[#e8d7db]">Find your next night out, your weekend escape, or a new reason to get together.</p>
            </div>
            <p className="inline-flex shrink-0 items-center gap-2 text-sm text-[#e5c8cd]"><MapPin className="h-4 w-4"/> Doha & beyond · Qatar</p>
          </div>
          <form action="/events" method="GET" className="mt-9 flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-xl sm:max-w-3xl sm:flex-row sm:items-center">
            <label className="sr-only" htmlFor="event-search">Search events</label>
            <Search className="ml-3 hidden h-5 w-5 text-[#86596a] sm:block"/>
            <input id="event-search" name="q" defaultValue={q} placeholder="Search music, culture, food, adventure..." className="w-full min-w-0 flex-1 rounded-xl px-3 py-3 text-sm text-[#302329] outline-none placeholder:text-[#a7969b] focus-visible:ring-2 focus-visible:ring-[#8a1538]"/>
            {when && <input type="hidden" name="when" value={when} />}
            <button type="submit" className="rounded-xl bg-[#8a1538] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#6a142e]">Find events</button>
          </form>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-[#9c6776]"><SlidersHorizontal className="h-4 w-4"/> Find your scene</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-.04em]">{q ? `Results for “${q}”` : 'Explore experiences'}</h2>
            <p className="mt-1 text-sm text-[#82747a]">{total} {total===1?'experience':'experiences'} to discover</p>
          </div>
          <div className="flex max-w-full flex-wrap gap-2">
            {filters.map(filter => (
              <Link key={filter.label} href={href(q,filter.value,1)} className={`rounded-full border px-4 py-2 text-xs font-bold transition ${filter.value===when?'border-[#8a1538] bg-[#8a1538] text-white':'border-[#ddcfc9] bg-white text-[#68555c] hover:border-[#8a1538] hover:text-[#8a1538]'}`}>{filter.label}</Link>
            ))}
          </div>
        </div>
        {anyDemo && <div role="status" className="mb-7 rounded-xl border border-[#e4cfbe] bg-[#fff2e5] px-5 py-3 text-sm text-[#855535]"><strong>Concept preview:</strong> Demo events are fictional examples. Ticket sales are disabled.</div>}
        {events.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map(event=><EventDiscoverCard key={event.id} event={event}/>)}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-[26px] border border-dashed border-[#dac2c0] bg-white px-6 py-20 text-center">
            <CalendarDays className="h-12 w-12 text-[#8a1538]"/>
            <h3 className="mt-5 text-2xl font-semibold">Nothing on this calendar yet.</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-[#87777b]">Try a different search or explore everything happening around Doha.</p>
            <Link href="/events" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#8a1538] px-5 py-3 text-sm font-bold text-white">Browse all events <ArrowRight className="h-4 w-4"/></Link>
          </div>
        )}
        {totalPages > 1 && (
          <nav aria-label="Event results pages" className="mt-10 flex items-center justify-center gap-4 text-sm">
            {page>1?<Link href={href(q,when,page-1)} className="rounded-full border border-[#ddcfc9] bg-white px-5 py-2 font-semibold">Previous</Link>:null}
            <span className="text-[#786871]">{page} / {totalPages}</span>
            {page<totalPages?<Link href={href(q,when,page+1)} className="rounded-full bg-[#8a1538] px-5 py-2 font-semibold text-white">Next page <ArrowRight className="ml-1 inline h-4 w-4"/></Link>:null}
          </nav>
        )}
      </main>
    </div>
  )
}
