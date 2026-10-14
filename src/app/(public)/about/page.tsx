import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About — Cruze Events Qatar',
  description:
    'Cruze is live event discovery and ticketing for Qatar built around the exact seat: one buyer per seat, guaranteed by transactional inventory, on an experience designed for Doha.',
}

const capabilities = [
  {
    number: '01',
    title: 'Exact seats',
    body: 'Every seat in the house is accounted for with its own section, row, number, and transparent QAR pricing. You choose the place you want rather than accepting whatever tier an algorithm assigns you.',
  },
  {
    number: '02',
    title: 'One winner per seat',
    body: 'Two patrons reaching for the same seat in the same second is standard in high-demand Doha showcases. Transactional database locks decide who gets it, ensuring seats are never double-sold.',
  },
  {
    number: '03',
    title: 'Real-time discovery',
    body: 'Live availability updates seamlessly. You inspect the authentic status of Katara, Lusail, or MIA auditoriums as seats are selected, not an outdated snapshot.',
  },
  {
    number: '04',
    title: 'Verified entry pass',
    body: 'Each ticket generates a cryptographically signed QR code. Cruze door staff scan and validate passes in real-time at Doha venue gates with instant redemption.',
  },
]

const steps = [
  {
    number: '01',
    label: 'Discover',
    body: 'Explore curated Qatar events across music, comedy, cultural galas, and live sports. Every listing represents genuine inventory backed by Cruze staff.',
  },
  {
    number: '02',
    label: 'Choose',
    body: 'Select your preferred seats or passes. Selected items are held in your session during checkout, giving you ample time to complete your reservation.',
  },
  {
    number: '03',
    label: 'Pay',
    body: 'Seamless checkout with modular payment gateways including Stripe in QAR. Inventory confirms immediately upon successful authorization.',
  },
  {
    number: '04',
    label: 'Arrive',
    body: 'Your tickets live securely under My Tickets with dynamic QR verification. Present your digital ticket at the gate in Doha and walk in.',
  },
]

const figures = [
  { value: '10', unit: 'MIN', label: 'Seat hold window' },
  { value: '08', unit: 'MAX', label: 'Tickets per checkout' },
  { value: '00', unit: 'FEE', label: 'Hidden platform fees' },
  { value: '01', unit: 'ONLY', label: 'Guaranteed seat owner' },
]

const stack = [
  { name: 'Next.js App Router', role: 'Server components & streaming SSR' },
  { name: 'Neon PostgreSQL', role: 'ACID transactional inventory' },
  { name: 'Prisma ORM', role: 'Type-safe schema & checked migrations' },
  { name: 'NextAuth', role: 'Verified credentials & role-based access' },
  { name: 'Stripe Adapter', role: 'Decoupled multi-gateway payments in QAR' },
  { name: 'Vercel Edge', role: 'Low-latency delivery in the Middle East' },
]

export default function AboutPage() {
  return (
    <main className="about-page">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <header className="about-header font-mono">
        <div>
          <span className="about-kicker">CRUZE® / QAT / 2026</span>
          <h1 className="font-sans">
            ABOUT<br />CRUZE<span>.</span>
          </h1>
        </div>

        <div className="about-header__right">
          <span>06 / INSIDE CRUZE</span>
          <Link href="/events" className="text-[#d8763d] hover:text-[#f1efe8] transition-colors">
            EXPLORE EVENTS ↗
          </Link>
          <Link href="/" className="hover:text-[#d8763d] transition-colors">
            ← BACK HOME
          </Link>
        </div>
      </header>

      {/* =====================================================
          STATEMENT
      ===================================================== */}
      <section className="about-statement">
        <span className="about-statement__eyebrow font-mono">WHAT THIS IS</span>

        <p className="about-statement__lead">
          Cruze is a premier event-discovery and ticketing experience for Qatar, built around one foundational idea: the seat is the product. You choose your exact spot — not a generic tier or best-available guess — and from the moment you claim it, it belongs to you.
        </p>

        <p className="about-statement__body">
          From international concerts at Lusail to classical symphonies at Katara and experimental performances across Doha, Cruze brings authentic curation and brutalist Swiss precision to live entertainment in the Arabian Gulf.
        </p>
      </section>

      {/* =====================================================
          FIGURES
      ===================================================== */}
      <section className="about-figures font-mono">
        {figures.map((figure) => (
          <div key={figure.label} className="about-figure">
            <strong>
              {figure.value}
              <em>{figure.unit}</em>
            </strong>
            <span>{figure.label}</span>
          </div>
        ))}
      </section>

      {/* =====================================================
          CAPABILITIES
      ===================================================== */}
      <section className="about-block">
        <div className="about-block__head">
          <span className="font-mono">01 / WHAT IT DOES</span>
          <h2>
            FOUR PRINCIPLES,<br />DONE PROPERLY<span>.</span>
          </h2>
        </div>

        <div className="about-capabilities">
          {capabilities.map((cap) => (
            <div key={cap.number} className="about-capability-row">
              <span className="about-capability-row__number font-mono">{cap.number}</span>
              <h3>{cap.title}</h3>
              <p>{cap.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          STEPS
      ===================================================== */}
      <section className="about-block">
        <div className="about-block__head">
          <span className="font-mono">02 / THE PASSAGE</span>
          <h2>
            FOUR STEPS<br />TO YOUR PLACE<span>.</span>
          </h2>
        </div>

        <div className="about-steps">
          {steps.map((step) => (
            <div key={step.number} className="about-step">
              <span className="about-step__number font-mono">{step.number}</span>
              <strong className="about-step__label">{step.label}</strong>
              <p className="about-step__body">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          STACK
      ===================================================== */}
      <section className="about-block">
        <div className="about-block__head">
          <span className="font-mono">03 / UNDER THE HOOD</span>
          <h2>
            ENGINEERED<br />FOR QATAR<span>.</span>
          </h2>
        </div>

        <div className="about-stack font-mono">
          {stack.map((item) => (
            <div key={item.name} className="about-stack__item">
              <strong>{item.name}</strong>
              <span>{item.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          CLOSING CTA
      ===================================================== */}
      <section className="about-closing">
        <div>
          <span className="about-closing__kicker font-mono">04 / CLAIM YOUR PLACE</span>
          <h2>
            DISCOVER THE BEST<br />OF DOHA<span>.</span>
          </h2>
        </div>

        <Link href="/events" className="about-closing__btn font-mono">
          <span>EXPLORE UPCOMING EVENTS</span>
          <span>↗</span>
        </Link>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="about-footer font-mono">
        <span>CRUZE® / QATAR</span>
        <span>DOHA · LUSAIL · AL WAKRAH</span>
        <span>© 2026 ALL RIGHTS RESERVED</span>
      </footer>
    </main>
  )
}
