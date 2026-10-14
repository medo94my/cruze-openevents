import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { CheckoutForm } from '@/components/tickets/CheckoutForm'
import { formatEventDateTime } from '@/lib/utils'
import { isValidTimeZone } from '@/lib/timezone'
import { getCheckoutUnavailableNotice, getCheckoutUnavailableReason } from '@/lib/orders/checkoutAvailability'

export const dynamic = 'force-dynamic'

interface CheckoutPageProps {
  params: Promise<{ slug: string }>
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { slug } = await params

  const event = await prisma.event.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      title: true,
      startDate: true,
      endDate: true,
      timezone: true,
      locationType: true,
      venue: true,
      city: true,
      country: true,
      onlineUrl: true,
      coverImage: true,
      collectAllergies: true,
      status: true,
      ticketTypes: {
        where: { isVisible: true },
        select: {
          salesStartDate: true,
          salesEndDate: true,
          maxCapacity: true,
          soldCount: true,
          reservedCount: true,
          isVisible: true,
        },
      },
      groupDiscounts: {
        where: { isActive: true },
        select: {
          id: true,
          ticketTypeId: true,
          minQuantity: true,
          discountType: true,
          discountValue: true,
        },
        orderBy: { minQuantity: 'asc' },
      },
    },
  })

  if (!event) {
    notFound()
  }

  const checkoutUnavailableReason = getCheckoutUnavailableReason(event)
  if (checkoutUnavailableReason) {
    const notice = getCheckoutUnavailableNotice(checkoutUnavailableReason)
    redirect(`/events/${event.slug}?notice=${encodeURIComponent(notice)}`)
  }

  const displayTimeZone = isValidTimeZone(event.timezone) ? event.timezone : 'Asia/Qatar'

  const location =
    event.locationType === 'ONLINE'
      ? event.onlineUrl || 'Online event'
      : [event.venue, event.city, event.country].filter(Boolean).join(', ')

  return (
    <main className="min-h-screen bg-[#11110f] text-[#f1efe8] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-8 font-mono text-xs uppercase tracking-wider text-white/50">
          <span>CRUZE® / ORDER CHECKOUT</span>
          <Link href={`/events/${event.slug}`} className="hover:text-[#d8763d] transition-colors">
            ← BACK TO EVENT
          </Link>
        </div>

        <h1 className="mb-8 font-sans text-4xl sm:text-5xl font-black uppercase tracking-tight text-white">
          CHECKOUT<span>.</span>
        </h1>

        {/* Event Summary Card */}
        <div className="border border-white/15 bg-white/[0.02] p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#d8763d] block">
              ADMISSION PASSES
            </span>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-white">
              {event.title}
            </h2>
            <p className="font-mono text-xs text-white/60">
              {location} · {formatEventDateTime(event.startDate, displayTimeZone)}
            </p>
          </div>

          {event.coverImage && (
            <div className="w-36 aspect-[16/10] overflow-hidden border border-white/15 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={event.coverImage}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Checkout Form */}
        <div className="border border-white/15 bg-white/[0.02] p-6 sm:p-10">
          <CheckoutForm
            event={{
              id: event.id,
              slug: event.slug,
              title: event.title,
              country: event.country,
              collectAllergies: event.collectAllergies,
            }}
            groupDiscounts={event.groupDiscounts.map((gd) => ({
              id: gd.id,
              ticketTypeId: gd.ticketTypeId,
              minQuantity: gd.minQuantity,
              discountType: gd.discountType,
              discountValue: Number(gd.discountValue),
            }))}
          />
        </div>
      </div>
    </main>
  )
}
