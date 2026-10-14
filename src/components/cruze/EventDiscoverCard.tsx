import Link from 'next/link'
import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react'

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
  culture: 'Arts & culture',
  music: 'Live music',
  family: 'Family & kids',
  outdoors: 'Outdoor adventures',
  community: 'Community',
  comedy: 'Comedy & shows',
  business: 'Talks & ideas',
}

const colors: Record<string, string> = {
  culture: 'from-[#58351f] to-[#9b7348]',
  music: 'from-[#38112c] to-[#9c4b80]',
  family: 'from-[#63714b] to-[#b1b78a]',
  outdoors: 'from-[#7b482d] to-[#cea076]',
  community: 'from-[#625132] to-[#c1a875]',
  comedy: 'from-[#38294c] to-[#8062a1]',
  business: 'from-[#233d4e] to-[#5f8892]',
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
  if (/concert|music|jazz|soundscape|live session|gig/.test(title)) return 'music'
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
  // Demo images are sourced from Unsplash; regular event assets retain the original S3/Blob proxy.
  if (event.coverImage.startsWith('https://images.unsplash.com/') || event.coverImage.startsWith('https://images.pexels.com/photos/')) {
    return event.coverImage
  }
  return `/api/events/${encodeURIComponent(event.slug)}/image?slot=cover`
}

export function eventPrice(event: Pick<DiscoverEvent, 'ticketTypes'>): string {
  const prices = event.ticketTypes.map((t) => Number(t.price)).filter((p) => Number.isFinite(p) && p >= 0)
  if (!prices.length) return 'Details soon'
  if (prices.every((p) => p === 0)) return 'Free'
  return `From QAR ${Math.min(...prices).toLocaleString('en-QA', { maximumFractionDigits: 0 })}`
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
    <Link href={`/events/${event.slug}`} className="group relative flex h-full flex-col overflow-hidden rounded-[26px] spatial-glass-card text-[#2d2024] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8a1538]">
      <div className={`relative overflow-hidden bg-gradient-to-br ${colors[cat]} ${compact ? 'h-44' : 'h-52 sm:h-60'}`}>
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt={`Illustrative artwork for ${event.title}`} loading="lazy" className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute left-4 top-4 rounded-2xl spatial-glass-dock px-3 py-1.5 text-center shadow-sm">
          <span className="block text-[9.5px] font-bold tracking-[.14em] text-[#8a1538]">{date.month}</span>
          <span className="block text-[22px] font-extrabold leading-6 text-[#1c181a]">{date.day}</span>
        </div>
        {demo && <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[9.5px] font-bold uppercase tracking-wider text-white backdrop-blur-md">Concept demo</span>}
        <div className="absolute bottom-4 left-4 rounded-full spatial-glass-dock px-3.5 py-1 text-[11px] font-semibold text-[#481e2b] shadow-sm">{categoryLabel(cat)}</div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="line-clamp-2 text-[19px] font-bold leading-snug tracking-[-.02em] text-[#24171d] transition-colors group-hover:text-[#8a1538]">{event.title.replace(/^(?:\[DEMO\]|DEMO)\s*[·:–-]?\s*/i, '')}</h3>
        <div className="mt-4 flex items-center gap-2 text-[12.5px] text-[#786c6d]"><CalendarDays className="h-3.5 w-3.5 shrink-0 text-[#8a1538]"/><span>{date.long} · {date.time}</span></div>
        <div className="mt-2 flex items-center gap-2 text-[12.5px] text-[#786c6d]"><MapPin className="h-3.5 w-3.5 shrink-0 text-[#8a1538]"/><span className="truncate">{event.venue || event.city || 'Doha, Qatar'}</span></div>
        <div className="mt-auto flex items-center justify-between border-t border-black/[0.06] pt-4 text-sm mt-5">
          <span className="font-extrabold text-[#8a1538]">{eventPrice(event)}</span>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#442b33] transition group-hover:text-[#8a1538]">
            Discover <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/>
          </span>
        </div>
      </div>
    </Link>
  )
}
