import { prisma } from '@/lib/db'
import { CruzeHome, type CruzeEvent } from '@/components/landing/CruzeHome'

export const dynamic = 'force-dynamic'

export default async function EventsPage() {
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
  const cards: CruzeEvent[] = events.map((event) => ({
    id: event.id,
    slug: event.slug,
    title: event.title,
    description: event.description,
    coverImage: event.coverImage,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate.toISOString(),
    city: event.city || 'Doha',
    venue: event.venue || event.city || 'Qatar',
    isDemo: event.title.startsWith('[DEMO]'),
    ticketPrice: event.ticketTypes.length ? Math.min(...event.ticketTypes.map((ticket) => Number(ticket.price))) : null,
    currency: event.ticketTypes[0]?.currency || 'QAR',
  }))

  return <CruzeHome events={cards} compact />
}
