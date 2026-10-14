import type { Metadata } from 'next'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { formatEventDateTime } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'My Tickets — Cruze Events Qatar',
  description: 'Your booked seats and live passes across Qatar.',
}

export default async function MyTicketsPage() {
  const user = await getCurrentUser()

  const orders = user
    ? await prisma.order.findMany({
        where: { userId: user.id },
        include: {
          event: true,
          tickets: true,
          items: {
            include: {
              ticketType: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    : []

  const totalTickets = orders.reduce((acc, order) => acc + order.tickets.length, 0)

  return (
    <main className="my-tickets-page">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <header className="my-tickets-header font-mono">
        <div>
          <span className="my-tickets-kicker">CRUZE® / QAT / 2026</span>
          <h1 className="font-sans">
            MY<br />TICKETS<span>.</span>
          </h1>
        </div>

        <div className="my-tickets-header__right">
          <span>04 / BOOKED PASSES</span>
          <Link href="/events" className="text-[#d8763d] hover:text-[#f1efe8] transition-colors">
            EXPLORE EVENTS ↗
          </Link>
          <Link href="/" className="hover:text-[#d8763d] transition-colors">
            ← BACK HOME
          </Link>
        </div>
      </header>

      {/* =====================================================
          INTRO METADATA
      ===================================================== */}
      <section className="my-tickets-intro font-mono">
        <div>
          <span>YOUR ADMISSION</span>
          <strong>{user ? user.name || user.email : 'GUEST / ANONYMOUS SESSION'}</strong>
        </div>

        <div className="my-tickets-count">
          <strong>{String(totalTickets).padStart(2, '0')}</strong>
          <span className="text-xs uppercase tracking-wider text-white/50">TICKETS</span>
        </div>
      </section>

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}
      {orders.length === 0 ? (
        <section className="my-tickets-empty font-mono">
          <div className="my-tickets-empty__number font-sans">00</div>

          <div>
            <span>00 / ADMISSIONS</span>
            <h2 className="font-sans uppercase">
              NO TICKETS FOUND<span>.</span>
            </h2>

            <Link href="/events" className="my-tickets-empty__button">
              <span>EXPLORE EXPERIENCES</span>
              <span>↗</span>
            </Link>
          </div>
        </section>
      ) : (
        /* =====================================================
            TICKETS GRID
        ===================================================== */
        <section className="my-tickets-grid font-mono">
          {orders.map((order) => {
            const eventDate = formatEventDateTime(order.event.startDate, order.event.timezone || 'Asia/Qatar')
            const orderLink = `/orders/${order.orderNumber}`

            return (
              <div
                key={order.id}
                className="border border-white/15 bg-white/[0.02] p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                    <span className="text-xs text-[#d8763d]">
                      ORDER #{order.orderNumber}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-white/40">
                      STATUS: {order.status}
                    </span>
                  </div>

                  <h3 className="font-sans text-3xl font-bold uppercase tracking-tight text-white mb-2">
                    {order.event.title}
                  </h3>

                  <p className="text-xs text-white/60 mb-6">
                    {order.event.venue} · {order.event.city}
                    <br />
                    {eventDate}
                  </p>

                  <div className="border-t border-white/10 pt-4 mb-6">
                    <span className="text-[9px] uppercase tracking-wider text-white/40 block mb-2">
                      PASSES INCLUDED:
                    </span>
                    <div className="flex flex-col gap-1 text-xs text-white/80">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span>{item.quantity}x {item.ticketType.name}</span>
                          <span className="text-[#d8763d]">{item.unitPrice.toString()} QAR</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  href={orderLink}
                  className="inline-flex items-center justify-between border border-white/30 px-5 py-3 text-xs uppercase hover:bg-white hover:text-black transition-colors"
                >
                  <span>VIEW ADMISSION PASS & QR</span>
                  <span>↗</span>
                </Link>
              </div>
            )
          })}
        </section>
      )}

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="my-tickets-footer font-mono">
        <span>CRUZE® / TICKETS</span>
        <span>PRESENT AT VENUE GATE · DOHA</span>
        <span>© 2026</span>
      </footer>
    </main>
  )
}
