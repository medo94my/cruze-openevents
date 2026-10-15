import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DEMO_EVENT_PRESETS, ensureDemoTickets, ensureDemoEventExists } from '@/lib/tickets/demoTickets'
import { prisma } from '@/lib/db'

vi.mock('@/lib/db', () => ({
  prisma: {
    ticketType: {
      findMany: vi.fn(),
      createMany: vi.fn(),
      update: vi.fn(),
    },
    event: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    organizerProfile: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    user: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}))

describe('demoTickets Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('defines valid presets for all 6 core Qatar demo experiences', () => {
    const slugs = [
      'demo-katara-symphony-orchestra',
      'demo-lusail-comedy-night',
      'demo-museum-islamic-art-gala',
      'demo-desert-acoustic-festival',
      'demo-doha-film-heritage-night',
      'demo-qatar-grand-prix-fan-zone',
    ]

    for (const slug of slugs) {
      const preset = DEMO_EVENT_PRESETS[slug]
      expect(preset).toBeDefined()
      expect(preset.price).toBeGreaterThan(0)
      expect(preset.venue).toBeTruthy()
      expect(preset.city).toBeTruthy()
      expect(preset.image).toMatch(/^\/events\//)
    }
  })

  it('does nothing when event is not a demo event', async () => {
    await ensureDemoTickets('real-event-123', 'live-concert')
    expect(prisma.ticketType.findMany).not.toHaveBeenCalled()
  })

  it('provisions General Admission and VIP tiers when demo event has no tickets', async () => {
    vi.mocked(prisma.ticketType.findMany).mockResolvedValue([])
    vi.mocked(prisma.ticketType.createMany).mockResolvedValue({ count: 2 })
    vi.mocked(prisma.event.findUnique).mockResolvedValue({
      id: 'demo-katara',
      startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
      status: 'PUBLISHED',
    } as unknown as Awaited<ReturnType<typeof prisma.event.findUnique>>)

    await ensureDemoTickets('demo-katara', 'demo-katara-symphony-orchestra')

    expect(prisma.ticketType.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({
          eventId: 'demo-katara',
          name: 'General Admission',
          price: 250,
          currency: 'QAR',
          isVisible: true,
        }),
        expect.objectContaining({
          eventId: 'demo-katara',
          name: 'VIP Lounge Access',
          price: 450,
          currency: 'QAR',
          isVisible: true,
        }),
      ]),
    })
  })

  it('refreshes expired sales windows on existing demo tickets', async () => {
    const expiredDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    vi.mocked(prisma.ticketType.findMany).mockResolvedValue([
      {
        id: 'tt-1',
        eventId: 'demo-lusail',
        name: 'General Admission',
        description: null,
        price: 150 as unknown,
        currency: 'QAR',
        maxCapacity: 100,
        soldCount: 0,
        reservedCount: 0,
        salesStartDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        salesEndDate: expiredDate,
        isVisible: true,
        maxPerOrder: 10,
        minPerOrder: 1,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as unknown as Awaited<ReturnType<typeof prisma.ticketType.findMany>>)
    vi.mocked(prisma.event.findUnique).mockResolvedValue({
      id: 'demo-lusail',
      startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
      status: 'PUBLISHED',
    } as unknown as Awaited<ReturnType<typeof prisma.event.findUnique>>)

    await ensureDemoTickets('demo-lusail', 'demo-lusail-comedy-night')

    expect(prisma.ticketType.update).toHaveBeenCalledWith({
      where: { id: 'tt-1' },
      data: expect.objectContaining({
        isVisible: true,
      }),
    })
  })

  it('ensures demo event exists and creates it if not found', async () => {
    vi.mocked(prisma.event.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.organizerProfile.findFirst).mockResolvedValue({ id: 'org-cruze' } as unknown as Awaited<ReturnType<typeof prisma.organizerProfile.findFirst>>)
    vi.mocked(prisma.event.create).mockResolvedValue({
      id: 'created-demo-event-id',
      slug: 'demo-museum-islamic-art-gala',
    } as unknown as Awaited<ReturnType<typeof prisma.event.create>>)
    vi.mocked(prisma.ticketType.findMany).mockResolvedValue([])

    const result = await ensureDemoEventExists('demo-museum-islamic-art-gala')

    expect(prisma.event.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        slug: 'demo-museum-islamic-art-gala',
        title: 'Nocturne No. 7',
        venue: 'MIA Auditorium',
        city: 'Doha',
        country: 'Qatar',
        status: 'PUBLISHED',
      }),
      include: { ticketTypes: true },
    })
    expect(result).toBeDefined()
  })
})
