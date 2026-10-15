import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Globe, Pencil } from 'lucide-react'
import { getCurrentUser, hasRole } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { EventNoticeToast } from '@/components/events/EventNoticeToast'
import { CHECKOUT_UNAVAILABLE_NOTICE } from '@/lib/orders/checkoutAvailability'
import { isValidTimeZone } from '@/lib/timezone'
import { formatEventPrice, formatEventDateTime } from '@/lib/utils'

import { ensureDemoEventExists, ensureDemoTickets } from '@/lib/tickets/demoTickets'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ notice?: string | string[] }>
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function firstQueryValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0]
  return value
}

export default async function EventDetailsPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const isDemo = slug.startsWith('demo-')
  const query = await searchParams
  const user = await getCurrentUser()

  let event = await prisma.event.findUnique({
    where: { slug },
    include: {
      organizer: {
        select: {
          userId: true,
          orgName: true,
          description: true,
          website: true,
          socialLinks: true,
        },
      },
      ticketTypes: {
        where: { isVisible: true },
        orderBy: { sortOrder: 'asc' },
      },
      speakers: {
        orderBy: { sortOrder: 'asc' },
      },
      media: {
        where: { type: 'IMAGE' },
        orderBy: { sortOrder: 'asc' },
      },
    },
  })

  if (!event && isDemo) {
    await ensureDemoEventExists(slug)
    event = await prisma.event.findUnique({
      where: { slug },
      include: {
        organizer: {
          select: {
            userId: true,
            orgName: true,
            description: true,
            website: true,
            socialLinks: true,
          },
        },
        ticketTypes: {
          where: { isVisible: true },
          orderBy: { sortOrder: 'asc' },
        },
        speakers: {
          orderBy: { sortOrder: 'asc' },
        },
        media: {
          where: { type: 'IMAGE' },
          orderBy: { sortOrder: 'asc' },
        },
      },
    })
  }

  if (!event) {
    notFound()
  }

  if (isDemo && (event.ticketTypes.length === 0 || event.ticketTypes.some((t) => t.salesEndDate && t.salesEndDate <= new Date()))) {
    await ensureDemoTickets(event.id, slug)
    event.ticketTypes = await prisma.ticketType.findMany({
      where: { eventId: event.id, isVisible: true },
      orderBy: { sortOrder: 'asc' },
    })
  }

  const isOwnerOrAdmin = user
    ? hasRole(user.roles, ['ORGANIZER', 'SUPER_ADMIN']) &&
      (hasRole(user.roles, 'SUPER_ADMIN') || user.id === event.organizer.userId)
    : false

  if (event.status !== 'PUBLISHED' && !isOwnerOrAdmin) {
    notFound()
  }

  const locationParts = [event.venue, event.address, event.city, event.country]
    .filter((part) => part && part.trim() && part.trim() !== '-')
  const locationText = locationParts.join(', ') || event.city || 'Doha, Qatar'

  const priceDisplay = formatEventPrice(event.ticketTypes)
  const coverImageSrc = event.coverImage || `/events/img-1.png`

  const displayTimeZone = isValidTimeZone(event.timezone) ? event.timezone : 'Asia/Qatar'
  const startDateTimeLabel = formatEventDateTime(event.startDate, displayTimeZone)

  const notice = firstQueryValue(query.notice)
  const noticeMessage = notice === 'created'
    ? 'Event created'
    : notice === 'updated'
      ? 'Event updated'
      : null
  const checkoutUnavailableMessage =
    notice === CHECKOUT_UNAVAILABLE_NOTICE.EVENT_NOT_PUBLISHED
      ? 'Checkout is unavailable because this event is not open for ticket sales.'
      : notice === CHECKOUT_UNAVAILABLE_NOTICE.EVENT_STARTED
        ? 'Checkout is unavailable because this event has already started.'
      : notice === CHECKOUT_UNAVAILABLE_NOTICE.NO_PURCHASABLE_TICKETS
        ? 'Checkout is unavailable because there are no tickets currently on sale.'
        : null

  const organizerWebsite = event.organizer.website ||
    (isRecord(event.organizer.socialLinks) ? (event.organizer.socialLinks.website as string | null) : null)

  const isPast = new Date(event.endDate) < new Date()
  const displayTitle = isDemo ? event.title.replace(/^\[DEMO\]\s*/, '') : event.title

  return (
    <main className="event-detail">
      <EventNoticeToast message={noticeMessage} />

      {/* Breadcrumb Kicker */}
      <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[#f1efe8]/50">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#d8763d]" />
          <span>01 / LIVE EXPERIENCE · QATAR</span>
        </div>
        <Link href="/events" className="hover:text-[#d8763d] transition-colors">
          ← BACK TO ALL EVENTS
        </Link>
      </div>

      {checkoutUnavailableMessage && (
        <div role="status" className="mb-8 border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-xs font-mono text-amber-200">
          {checkoutUnavailableMessage}
        </div>
      )}

      {/* Hero Section */}
      <section className="event-detail__hero">
        <div className="relative overflow-hidden border border-white/10 bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImageSrc}
            alt={displayTitle}
            className="event-detail__image"
          />
        </div>

        {/* Huge Monolithic Title */}
        <div className="event-detail__content">
          <h1>
            {displayTitle}
            <span>.</span>
          </h1>

          {/* Meta Grid */}
          <div className="event-detail__meta font-mono">
            <div>
              <small>DATE & TIME</small>
              <strong>{startDateTimeLabel}</strong>
            </div>

            <div>
              <small>LOCATION</small>
              <strong>{event.venue || event.city || 'Doha, Qatar'}</strong>
            </div>

            <div>
              <small>CURATED BY</small>
              <div className="flex items-center gap-2">
                <strong>{event.organization || event.organizer.orgName}</strong>
                {organizerWebsite && (
                  <a
                    href={organizerWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#d8763d] hover:text-white"
                  >
                    <Globe className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid (About / Details / Price / Action) */}
        <div className="event-detail__info">
          <div className="event-detail__about">
            <small className="font-mono">ABOUT</small>
            <p>{event.description || 'Live experience curated for Qatar. Choose your place and enjoy the showcase.'}</p>

            {isOwnerOrAdmin && (
              <div className="mt-6">
                <Link
                  href={`/dashboard/events/${event.id}/edit`}
                  className="inline-flex items-center gap-2 border border-white/20 px-3 py-1.5 font-mono text-xs uppercase hover:bg-white/10"
                >
                  <Pencil className="h-3 w-3" />
                  <span>Edit Event</span>
                </Link>
              </div>
            )}
          </div>

          <div className="event-detail__details font-mono">
            <small>DETAILS</small>
            <p>
              {startDateTimeLabel}
              <br />
              {event.venue}
              <br />
              {locationText}
            </p>
          </div>

          <div className="event-detail__price font-mono">
            <small>FROM</small>
            <strong className="text-[#d8763d]">{priceDisplay}</strong>
          </div>

          {/* Action Button */}
          {isPast ? (
            <p className="event-detail__closed font-mono">
              EVENT HAS ENDED — BOOKING CLOSED
            </p>
          ) : (
            <Link
              href={`/events/${event.slug}/checkout`}
              className="event-detail__ticket-button font-mono"
            >
              <span>GET TICKETS</span>
              <span className="event-detail__ticket-arrow">↗</span>
            </Link>
          )}
        </div>
      </section>

      {/* Speakers Section if present */}
      {event.speakers.length > 0 && (
        <section className="mt-20 border-t border-white/10 pt-14">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 block mb-6">
            02 / FEATURED VOICES & PERFORMERS
          </span>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {event.speakers.map((speaker) => (
              <div key={speaker.id} className="border border-white/10 p-5 bg-white/[0.02]">
                <h3 className="text-xl font-bold uppercase tracking-tight text-[#f1efe8]">
                  {speaker.name}
                </h3>
                {speaker.title && (
                  <p className="font-mono text-xs uppercase tracking-wider text-[#d8763d] mt-1">
                    {speaker.title}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
