import { prisma } from '@/lib/db'
import EventsBrowser, { type BrowserEvent } from '@/components/events/EventsBrowser'

export const dynamic = 'force-dynamic'

function formatEventDate(isoDate: Date): string {
  try {
    const day = isoDate.toLocaleDateString('en-US', { day: '2-digit', timeZone: 'Asia/Qatar' })
    const month = isoDate.toLocaleDateString('en-US', { month: 'short', timeZone: 'Asia/Qatar' }).toUpperCase()
    const time = isoDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Qatar' }).toUpperCase()
    return `${day} ${month} / ${time}`
  } catch {
    return '18 NOV / 08:00 PM'
  }
}

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ when?: string; q?: string }> }) {
  const params = await searchParams
  const initialSearch = typeof params.q === 'string' ? params.q.slice(0, 100) : ''

  const events = await prisma.event.findMany({
    where: {
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      deletedAt: null,
      endDate: { gte: new Date() },
      country: 'Qatar',
    },
    include: {
      ticketTypes: { where: { isVisible: true }, select: { price: true, currency: true } },
    },
    orderBy: { startDate: 'asc' },
    take: 60,
  })

  const cards: BrowserEvent[] = events.map((event, idx) => ({
    id: event.id,
    slug: event.slug,
    number: String(idx + 1).padStart(2, '0'),
    title: event.title,
    category: event.description?.includes('Music') ? 'Music' : event.description?.includes('Comedy') ? 'Comedy' : 'Culture',
    venue: event.venue || event.city || 'Qatar',
    location: event.city || 'Doha',
    date: formatEventDate(event.startDate),
    price: event.ticketTypes.length ? Math.min(...event.ticketTypes.map((ticket) => Number(ticket.price))) : null,
    currency: event.ticketTypes[0]?.currency || 'QAR',
    image: event.coverImage || `/events/img-${(idx % 9) + 1}.png`,
  }))

  return <EventsBrowser events={cards} initialSearch={initialSearch} />
}
