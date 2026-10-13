import Link from 'next/link'
import { ArrowRight, ArrowUpRight, CalendarDays, Compass, MapPin, Search, Sparkles, Ticket, Waves } from 'lucide-react'
import { prisma } from '@/lib/db'
import { EventDiscoverCard, type DiscoverEvent, dateParts, eventPrice, imageForEvent, isDemoEvent } from '@/components/cruze/EventDiscoverCard'

export const dynamic = 'force-dynamic'

const categories = [
  { label: 'Live music', q: 'music', sub: 'Sounds worth showing up for', photo: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=900&q=80' },
  { label: 'Arts & culture', q: 'culture', sub: 'See Doha differently', photo: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=900&q=80' },
  { label: 'Outdoor escapes', q: 'outdoors', sub: 'Beyond the city lights', photo: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=900&q=80' },
  { label: 'For the family', q: 'family', sub: 'Make a day of it', photo: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=900&q=80' },
  { label: 'Meet your people', q: 'community', sub: 'A city of many stories', photo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900&q=80' },
  { label: 'Ideas & talks', q: 'business', sub: 'Something to think about', photo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&q=80' },
]

export default async function HomePage() {
  const now = new Date()
  const featuredEvents = await prisma.event.findMany({
    where: { status: 'PUBLISHED', visibility: 'PUBLIC', deletedAt: null, endDate: { gte: now } },
    select: {
      id: true, slug: true, title: true, description: true, coverImage: true,
      startDate: true, venue: true, city: true, country: true,
      ticketTypes: { where: { isVisible: true }, select: { price: true, currency: true } },
    },
    orderBy: [{ startDate: 'asc' }],
    take: 12,
  })
  const events: DiscoverEvent[] = featuredEvents
  const lead = events[0]
  const leadPhoto = lead && imageForEvent(lead)
  const demoCount = events.filter((e) => isDemoEvent(e.slug)).length
  const spotlight = events.find((e) => e.slug.includes('outdoors')) || events[2] || events[0]

  return (
    <div className="overflow-hidden bg-[#fbf8f4] text-[#281c21]">
      <div className="border-b border-[#efe4dd] bg-[#fff9f4] px-4 py-2 text-center text-[11px] font-semibold tracking-[.14em] text-[#734552]">
        <span className="text-[#8a1538]">DOHA, QATAR</span>
        <span className="mx-3 text-[#d1b5af]">✦</span>
        A CITY FULL OF POSSIBILITIES
        <span className="mx-3 text-[#d1b5af]">✦</span>
        <span lang="ar">اكتشف الدوحة</span>
      </div>

      <section className="relative isolate min-h-[590px] overflow-hidden bg-[#270c19] text-white sm:min-h-[620px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_30%,#85334c_0%,transparent_44%),linear-gradient(118deg,#290b19_0%,#58192f_65%,#38111e_100%)]" />
        <div aria-hidden="true" className="absolute right-0 top-0 h-full w-[55%] opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(60deg,transparent 0px,transparent 54px,#e2b7a6 55px,#e2b7a6 56px)' }} />
        <div aria-hidden="true" className="absolute -bottom-44 -left-32 h-96 w-96 rounded-full border border-white/10" />
        <div className="relative mx-auto grid max-w-[1380px] gap-10 px-5 py-16 sm:px-8 md:py-20 lg:grid-cols-[1fr_.87fr] lg:items-center lg:gap-12 lg:px-12 lg:py-24">
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dfb2bb]/30 bg-[#ffffff]/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[.2em] text-[#ead6d6] backdrop-blur-lg">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ffc69b]" /> Your city, your scene
            </div>
            <h1 className="max-w-[790px] font-semibold tracking-[-.055em] leading-[1.05] text-[clamp(3.4rem,6.2vw,6.1rem)]">
              Find your<br />next <span className="font-serif italic text-[#ffd3ad]">great story.</span>
            </h1>
            <p className="mt-7 max-w-[500px] text-base leading-8 text-[#ebd5d9] sm:text-lg">
              The best of Doha, all in one place. Concerts, culture, weekend escapes and the moments that bring us together.
            </p>
            <form action="/events" method="GET" role="search" className="mt-9 flex max-w-[625px] flex-col gap-2 rounded-[19px] border border-white/30 bg-white p-2 shadow-[0_20px_80px_rgba(9,3,8,.23)] sm:flex-row sm:items-center">
              <label htmlFor="home-event-search" className="sr-only">Search events in Qatar</label>
              <Search className="ml-4 hidden h-5 w-5 shrink-0 text-[#866575] sm:block" />
              <input id="home-event-search" name="q" placeholder="Try live music, family days, art..." className="min-w-0 flex-1 rounded-xl px-4 py-3 text-sm text-[#2d2125] outline-none placeholder:text-[#a89a9d] focus-visible:ring-2 focus-visible:ring-[#8a1538] sm:px-1" />
              <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#8a1538] px-6 text-sm font-bold text-white transition hover:bg-[#65112d] focus-visible:ring-2 focus-visible:ring-[#8a1538] focus-visible:ring-offset-2">
                Explore events <ArrowRight className="h-4 w-4"/>
              </button>
            </form>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-[13px] text-[#d9bbc1]">
              <span className="font-semibold text-white/90">Start exploring</span>
              <Link className="rounded-full border border-white/30 px-3 py-1.5 transition hover:border-white hover:bg-white/10" href="/events?when=weekend">This weekend</Link>
              <Link className="rounded-full border border-white/30 px-3 py-1.5 transition hover:border-white hover:bg-white/10" href="/events?q=music">Live music</Link>
              <Link className="rounded-full border border-white/30 px-3 py-1.5 transition hover:border-white hover:bg-white/10" href="/events?q=family">Family fun</Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
            <div className="absolute -left-5 -top-5 z-20 flex h-20 w-20 -rotate-12 items-center justify-center rounded-full border-2 border-[#ffe1bb]/50 bg-[#7e1635] text-center text-[10px] font-extrabold uppercase leading-4 tracking-widest text-white shadow-xl sm:h-24 sm:w-24">Made<br/>for<br/>Doha</div>
            <div className="relative h-[310px] overflow-hidden rounded-[28px] border-[6px] border-white/10 bg-[#87514d] shadow-[0_30px_80px_rgba(0,0,0,.4)] sm:h-[430px]">
              {/* Photography is illustrative, not documentation of an actual event. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1300&q=85" alt="Illustrative photograph of an atmospheric live event" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c0b13]/85 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-6 right-5 sm:bottom-8 sm:left-8">
                <div className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.2em] text-[#fbd6b9]"><Sparkles className="h-4 w-4"/> Nights worth remembering</div>
                <p className="max-w-[310px] text-2xl font-semibold leading-tight sm:text-3xl">Go out. Feel something. Come back inspired.</p>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-3 z-10 hidden w-44 rotate-[8deg] overflow-hidden rounded-2xl border-[5px] border-[#fffaf3] shadow-[0_18px_45px_rgba(0,0,0,.3)] sm:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=500&q=80" alt="Illustrative desert landscape" className="h-36 w-full object-cover" />
              <div className="bg-[#fffaf3] px-2 py-1.5 text-center text-[10px] font-bold uppercase tracking-widest text-[#6d263d]">Explore beyond</div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#f0e5dc] bg-white px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-[13px] text-[#6f5c5f]">
          <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-[#8a1538]"/> Made for life in <strong className="text-[#3b252b]">Qatar</strong></span>
          <span className="inline-flex items-center gap-2"><Compass className="h-4 w-4 text-[#8a1538]"/> New in town or a Doha regular? You belong here.</span>
          <span className="inline-flex items-center gap-2"><Ticket className="h-4 w-4 text-[#8a1538]"/> Local experiences, one easy place to discover</span>
        </div>
      </section>

      {demoCount > 0 && (
        <div className="mx-auto mt-8 max-w-7xl px-5 sm:px-8">
          <div role="status" className="flex flex-wrap items-center gap-2 rounded-xl border border-[#ead5c4] bg-[#fff4e8] px-5 py-3 text-sm text-[#83502f]">
            <span className="font-bold">Preview collection</span> The example events below are fictional, for design evaluation only. Tickets cannot be purchased.
          </div>
        </div>
      )}

      <section id="discover" className="mx-auto max-w-7xl px-5 pb-10 pt-16 sm:px-8 lg:pt-20">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[.24em] text-[#a16d75]">Discover what moves you</p>
            <h2 className="font-semibold tracking-[-.045em] text-[clamp(2rem,4vw,3.25rem)] leading-tight">What are you in the mood for?</h2>
            <p className="mt-3 text-base text-[#786c6d]">Every side of Doha, from late nights to slow weekends.</p>
          </div>
          <Link href="/events" className="inline-flex items-center gap-2 border-b border-[#8a1538] pb-1 text-sm font-bold text-[#8a1538]">All experiences <ArrowUpRight className="h-4 w-4"/></Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
          {categories.map((cat) => (
            <Link href={`/events?q=${cat.q}`} key={cat.q} className="group relative isolate flex aspect-[.82] flex-col justify-end overflow-hidden rounded-2xl bg-[#5c243b] p-4 text-white transition hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8a1538] lg:aspect-[.7]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cat.photo} alt="" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#230d16]/90 via-[#230d16]/10 to-transparent" />
              <ArrowUpRight className="absolute right-3 top-3 h-7 w-7 rounded-full bg-white/20 p-1.5 backdrop-blur-md" />
              <span className="text-base font-bold leading-5 tracking-[-.02em]">{cat.label}</span>
              <span className="mt-1 hidden text-[11px] text-white/75 lg:block">{cat.sub}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#f5eee9] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[.24em] text-[#a16d75]">Your upcoming calendar</p>
              <h2 className="font-semibold tracking-[-.045em] text-[clamp(2rem,4vw,3.25rem)] leading-tight">Make plans worth keeping.</h2>
              <p className="mt-3 text-base text-[#786c6d]">Find something for tonight, the weekend or your next day off.</p>
            </div>
            <Link href="/events" className="inline-flex items-center gap-2 rounded-full bg-[#8a1538] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#68122d]">View all events <ArrowRight className="h-4 w-4"/></Link>
          </div>
          {events.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {events.slice(0,6).map((event) => <EventDiscoverCard key={event.id} event={event} />)}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#cfb6b4] bg-white/60 px-6 py-20 text-center">
              <CalendarDays className="mx-auto h-11 w-11 text-[#8a1538]"/>
              <h3 className="mt-5 text-2xl font-semibold">Great things are coming to Doha.</h3>
              <p className="mt-2 text-[#786c6d]">We’re curating our first experiences. Check back soon.</p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#2e111e] py-16 text-white sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 sm:px-8 md:grid-cols-[1.1fr_.9fr] md:gap-16">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[.22em] text-[#ecc4ae]">One city. Countless stories.</p>
            <h2 className="max-w-[600px] font-semibold tracking-[-.045em] leading-[1.13] text-[clamp(2.3rem,4.4vw,4.25rem)]">Different backgrounds.<br/><span className="font-serif italic text-[#e8bda5]">Shared moments.</span></h2>
            <p className="mt-6 max-w-[520px] text-base leading-8 text-[#dfc4cc]">From the people who grew up here to those who just arrived — discover the culture, friendships, and unexpected adventures that make Qatar feel like home.</p>
            <Link href="/events?q=community" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#f8eee4] px-6 py-3 text-sm font-bold text-[#651d37] transition hover:bg-white">Explore community experiences <ArrowUpRight className="h-4 w-4"/></Link>
          </div>
          <div className="relative overflow-hidden rounded-[26px] border border-white/15 bg-[#803e52]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1100&q=80" alt="Illustrative photograph of people enjoying an event" loading="lazy" className="h-[310px] w-full object-cover sm:h-[360px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2e111e]/70 to-transparent"/>
            <p className="absolute bottom-7 left-7 font-serif text-3xl italic text-white sm:text-4xl">See you out there.</p>
          </div>
        </div>
      </section>

      {spotlight && (
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="mb-7">
            <p className="mb-3 text-xs font-bold uppercase tracking-[.24em] text-[#a16d75]">Something different</p>
            <h2 className="font-semibold tracking-[-.045em] text-[clamp(2rem,4vw,3.25rem)]">Take the scenic route.</h2>
          </div>
          <Link href={`/events/${spotlight.slug}`} className="group relative flex min-h-[350px] flex-col justify-end overflow-hidden rounded-[28px] bg-[#794e3f] p-6 text-white sm:min-h-[440px] sm:p-12">
            {imageForEvent(spotlight) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageForEvent(spotlight)!} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#220e17]/90 via-[#220e17]/55 to-[#220e17]/10"/>
            <div className="relative z-10 max-w-[560px]">
              <span className="mb-4 inline-block rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest">A little adventure</span>
              <h3 className="text-3xl font-semibold tracking-[-.04em] sm:text-5xl">{spotlight.title}</h3>
              <p className="mt-3 text-base text-white/85">{dateParts(spotlight).long} · {spotlight.venue || 'Doha, Qatar'} · {eventPrice(spotlight)}</p>
              <span className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#631b34]">Discover this experience <ArrowUpRight className="h-4 w-4"/></span>
            </div>
          </Link>
        </section>
      )}

      <section className="border-t border-[#eee0d7] bg-[#fffcf9] px-5 py-12 text-center sm:px-8">
        <Waves className="mx-auto h-8 w-8 text-[#8a1538]" />
        <h2 className="mt-4 text-2xl font-semibold tracking-[-.03em] text-[#3d2530]">The city is yours to discover.</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#816e73]">Curated for life in Qatar. English-first discovery; a complete Arabic experience is on the roadmap.</p>
        <Link href="/events" className="mt-5 inline-flex items-center gap-2 font-bold text-[#8a1538]">Find your next thing <ArrowRight className="h-4 w-4"/></Link>
        <p className="mt-8 text-xs text-[#9c898c]">Illustrative photography. Demo listings are not real public events.</p>
      </section>
    </div>
  )
}
