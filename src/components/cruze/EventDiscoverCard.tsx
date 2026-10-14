import Link from 'next/link'

export type DiscoverEvent = {
  id: string
  slug: string
  title: string
  description?: string | null
  coverImage?: string | null
  startDate: Date
  venue?: string | null
  city?: string | null
  country?: string | null
  ticketTypes: Array<{ price: unknown; currency: string }>
}

const labels: Record<string, string> = {
  culture: 'Culture & Arts',
  music: 'Live Music',
  family: 'Family & Heritage',
  outdoors: 'Outdoor Adventures',
  community: 'Community',
  comedy: 'Stand-up & Comedy',
  business: 'Talks & Cinema',
}

export function isDemoEvent(slug: string): boolean {
  return slug.startsWith('demo-')
}

export function eventCategory(event: Pick<DiscoverEvent, 'slug' | 'title'>): string {
  const slug = event.slug.toLowerCase()
  for (const category of Object.keys(labels)) {
    if (slug.startsWith(`demo-${category}-`) || slug.includes(`-${category}-`)) {
      return category
    }
  }
  const title = event.title.toLowerCase()
  if (/concert|music|jazz|soundscape|live session|gig|symphony/.test(title)) return 'music'
  if (/family|kids|maker/.test(title)) return 'family'
  if (/sealine|stargaz|wellness|water|desert|kayak|sunset|outdoor|adventure/.test(title)) return 'outdoors'
  if (/comedy|stand.?up|show/.test(title)) return 'comedy'
  if (/community|food|social|global/.test(title)) return 'community'
  if (/founder|talk|startup|tech|workshop/.test(title)) return 'business'
  return 'culture'
}

export function categoryLabel(category: string): string {
  return labels[category] || 'Experience'
}

export function imageForEvent(event: Pick<DiscoverEvent, 'slug' | 'coverImage'>): string | null {
  if (!event.coverImage) return null
  if (event.coverImage.startsWith('https://images.unsplash.com/') || event.coverImage.startsWith('https://images.pexels.com/photos/')) {
    return event.coverImage
  }
  return `/api/events/${encodeURIComponent(event.slug)}/image?slot=cover`
}

export function eventPrice(event: Pick<DiscoverEvent, 'ticketTypes'>): string {
  const prices = event.ticketTypes.map((t) => Number(t.price)).filter((p) => Number.isFinite(p) && p >= 0)
  if (!prices.length) return 'Details soon'
  if (prices.every((p) => p === 0)) return 'Free'
  return `${Math.min(...prices).toLocaleString('en-QA', { maximumFractionDigits: 0 })} QAR`
}

export function dateParts(event: Pick<DiscoverEvent, 'startDate'>): { month: string; day: string; time: string; long: string } {
  const d = new Date(event.startDate)
  return {
    month: new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'Asia/Qatar' }).format(d).toUpperCase(),
    day: new Intl.DateTimeFormat('en', { day: '2-digit', timeZone: 'Asia/Qatar' }).format(d),
    time: new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Qatar' }).format(d),
    long: new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', weekday: 'short', timeZone: 'Asia/Qatar' }).format(d),
  }
}

export function EventDiscoverCard({ event, compact = false }: { event: DiscoverEvent; compact?: boolean }) {
  const photo = imageForEvent(event)
  const cat = eventCategory(event)
  const date = dateParts(event)
  const demo = isDemoEvent(event.slug)

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex h-full flex-col border border-[#f1efe8]/15 bg-[#171714] text-[#f1efe8] transition-all hover:border-[#f1efe8]/35 hover:bg-[#1c1c18]"
    >
      {/* 16:10 Aspect Ratio Image Container */}
      <div className={`relative overflow-hidden aspect-[16/10] bg-[#11110f] ${compact ? 'h-40' : ''}`}>
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={event.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Category Tag (SeatWise Monospace Style) */}
        <span className="absolute left-3 top-3 border border-[#f1efe8]/20 bg-[#11110f]/80 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-[#f1efe8] backdrop-blur-md">
          {categoryLabel(cat)}
        </span>

        {/* Demo Notice */}
        {demo && (
          <span className="absolute right-3 top-3 border border-[#d8763d]/40 bg-black/60 px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-wider text-[#d8763d] backdrop-blur-md">
            Demo
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6 justify-between">
        <div>
          <div className="flex items-start justify-between gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#f1efe8]/50">
              {date.day} {date.month} · {date.time}
            </span>
            <span className="text-[#f1efe8] text-base transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
              ↗
            </span>
          </div>

          <h3 className="mt-3 text-xl font-bold uppercase tracking-tight text-[#f1efe8] transition-colors group-hover:text-[#d8763d] line-clamp-2">
            {event.title.replace(/^(?:\[DEMO\]|DEMO)\s*[·:–-]?\s*/i, '')}
          </h3>

          <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[#f1efe8]/50 truncate">
            {event.venue || event.city || 'Doha, Qatar'}
          </p>
        </div>

        {/* Bottom Price Divider */}
        <div className="mt-6 flex items-end justify-between border-t border-[#f1efe8]/15 pt-3 font-mono">
          <span className="text-[9px] uppercase tracking-[0.16em] text-[#f1efe8]/40">
            From
          </span>
          <span className="text-base font-bold tracking-tight text-[#f1efe8]">
            {eventPrice(event)}
          </span>
        </div>
      </div>
    </Link>
  )
}
