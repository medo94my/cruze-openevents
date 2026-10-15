import { prisma } from '@/lib/db'

export const DEMO_EVENT_PRESETS: Record<
  string,
  {
    title: string
    price: number
    venue: string
    city: string
    category: string
    image: string
  }
> = {
  'demo-katara-symphony-orchestra': {
    title: 'The Midnight Room',
    price: 250,
    venue: 'Katara Amphitheatre',
    city: 'Doha',
    category: 'Music',
    image: '/events/img-1.png',
  },
  'demo-lusail-comedy-night': {
    title: 'After Hours Comedy',
    price: 150,
    venue: 'Marina Promenade',
    city: 'Lusail',
    category: 'Comedy',
    image: '/events/img-5.png',
  },
  'demo-museum-islamic-art-gala': {
    title: 'Nocturne No. 7',
    price: 320,
    venue: 'MIA Auditorium',
    city: 'Doha',
    category: 'Theatre',
    image: '/events/img-9.png',
  },
  'demo-desert-acoustic-festival': {
    title: 'Frequency Live',
    price: 180,
    venue: 'Heritage Village',
    city: 'Al Wakrah',
    category: 'Music',
    image: '/events/img-2.png',
  },
  'demo-doha-film-heritage-night': {
    title: 'Between Rooms',
    price: 120,
    venue: 'Fire Station Cinema',
    city: 'Doha',
    category: 'Culture',
    image: '/events/img-6.png',
  },
  'demo-qatar-grand-prix-fan-zone': {
    title: 'Open Field Racing',
    price: 450,
    venue: 'Lusail Circuit',
    city: 'Lusail',
    category: 'Sports',
    image: '/events/img-3.png',
  },
}

/**
 * Ensures a demo event exists in the database with published status and future dates.
 */
export async function ensureDemoEventExists(slug: string) {
  if (!slug.startsWith('demo-')) return null

  try {
    let event = await prisma.event.findUnique({
      where: { slug },
      include: {
        ticketTypes: true,
      },
    })

    if (!event) {
      // Find or create an organizer profile
      let organizer = await prisma.organizerProfile.findFirst()
      if (!organizer) {
        let user = await prisma.user.findFirst({
          where: { email: 'admin@openevents.local' },
        })
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: 'admin@openevents.local',
              passwordHash: '$2a$12$placeholderHashForCruzeAdminDemo1234567890',
              firstName: 'Cruze',
              lastName: 'Curator',
              emailVerified: new Date(),
            },
          })
        }
        organizer = await prisma.organizerProfile.create({
          data: {
            userId: user.id,
            orgName: 'Cruze Cultural Curations',
            description: 'Curating world-class entertainment, arts, and sporting experiences across Qatar.',
            website: 'https://cruze.qa',
          },
        })
      }

      const preset = DEMO_EVENT_PRESETS[slug] || {
        title: 'Cruze Showcase Experience',
        price: 200,
        venue: 'Katara Amphitheatre',
        city: 'Doha',
        category: 'Culture',
        image: '/events/img-1.png',
      }

      const now = new Date()
      const startDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000)

      event = await prisma.event.create({
        data: {
          slug,
          title: preset.title,
          description: 'Official Cruze curated showcase in Qatar. Built with authentic seating and Stripe payment processing.',
          venue: preset.venue,
          city: preset.city,
          country: 'Qatar',
          timezone: 'Asia/Qatar',
          startDate,
          endDate,
          status: 'PUBLISHED',
          visibility: 'PUBLIC',
          organizerId: organizer.id,
          coverImage: preset.image,
        },
        include: {
          ticketTypes: true,
        },
      })
    }

    await ensureDemoTickets(event.id, slug)

    return event
  } catch (error) {
    console.error('[DemoTickets] Failed to ensure demo event exists:', slug, error)
    return null
  }
}

/**
 * Ensures purchasable, active ticket tiers exist in PostgreSQL for a demo event.
 */
export async function ensureDemoTickets(eventId: string, slug?: string) {
  const isDemo = (slug && slug.startsWith('demo-')) || (eventId && eventId.startsWith('demo-'))
  if (!isDemo) return

  try {
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const oneYearFromNow = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)

    const existing = await prisma.ticketType.findMany({
      where: { eventId },
    })

    if (existing.length === 0) {
      const preset = slug ? DEMO_EVENT_PRESETS[slug] : null
      const basePrice = preset?.price || 150
      const vipPrice = Math.round(basePrice * 1.8)

      await prisma.ticketType.createMany({
        data: [
          {
            eventId,
            name: 'General Admission',
            description: 'Standard access with full venue experience and guaranteed seating.',
            price: basePrice,
            currency: 'QAR',
            maxCapacity: 200,
            soldCount: 0,
            reservedCount: 0,
            salesStartDate: oneDayAgo,
            salesEndDate: oneYearFromNow,
            isVisible: true,
            minPerOrder: 1,
            maxPerOrder: 10,
            sortOrder: 0,
          },
          {
            eventId,
            name: 'VIP Lounge Access',
            description: 'Priority check-in, premium elevated viewing, and complimentary lounge refreshments.',
            price: vipPrice,
            currency: 'QAR',
            maxCapacity: 50,
            soldCount: 0,
            reservedCount: 0,
            salesStartDate: oneDayAgo,
            salesEndDate: oneYearFromNow,
            isVisible: true,
            minPerOrder: 1,
            maxPerOrder: 6,
            sortOrder: 1,
          },
        ],
      })
    } else {
      // If tickets exist, check if sales window or capacity need refreshing
      const needsRefresh = existing.some(
        (t) =>
          (t.salesEndDate && t.salesEndDate <= now) ||
          (t.salesStartDate && t.salesStartDate > now) ||
          (t.maxCapacity !== null && t.maxCapacity <= t.soldCount + t.reservedCount) ||
          !t.isVisible
      )

      if (needsRefresh) {
        for (const t of existing) {
          const isCapacityDepleted = t.maxCapacity !== null && t.maxCapacity <= t.soldCount + t.reservedCount
          await prisma.ticketType.update({
            where: { id: t.id },
            data: {
              salesStartDate: oneDayAgo,
              salesEndDate: oneYearFromNow,
              isVisible: true,
              maxCapacity: isCapacityDepleted ? t.soldCount + t.reservedCount + 100 : t.maxCapacity,
            },
          })
        }
      }
    }

    // Also ensure the demo event's startDate is in the future and status is PUBLISHED
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { startDate: true, endDate: true, status: true },
    })

    if (event && (event.startDate <= now || event.status !== 'PUBLISHED')) {
      const newStartDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      const newEndDate = new Date(newStartDate.getTime() + 4 * 60 * 60 * 1000)
      await prisma.event.update({
        where: { id: eventId },
        data: {
          status: 'PUBLISHED',
          startDate: newStartDate,
          endDate: newEndDate,
        },
      })
    }
  } catch (error) {
    console.error('[DemoTickets] Failed to ensure demo tickets for event:', eventId, error)
  }
}
