import Link from 'next/link'

export default function AboutOpenEventsPage() {
  return (
    <main className="min-h-screen bg-[#11110f] text-[#f1efe8] px-4 py-12 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-[1200px] space-y-10">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[#f1efe8]/50">
          <span>CRUZE® / QAT / 2026 · ARCHITECTURE</span>
          <Link href="/about" className="hover:text-[#d8763d] transition-colors">
            ← ABOUT CRUZE
          </Link>
        </div>

        <div className="space-y-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#d8763d]">
            OPEN PLATFORM SPECIFICATION
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#f1efe8]">
            CORE ARCHITECTURE<span className="text-[#d8763d]">.</span>
          </h1>
          <p className="font-mono text-xs uppercase tracking-wider text-[#f1efe8]/65 max-w-xl">
            Event ticketing infrastructure powered by Next.js, Prisma PostgreSQL, and real-time inventory locking.
          </p>
        </div>

        {/* Technical Overview Card */}
        <section className="border border-white/10 bg-[#161614] p-8 sm:p-10 space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-tight text-[#f1efe8]">
            Engineered for High-Concurrency Qatar Showcases
          </h2>
          <p className="font-mono text-xs uppercase tracking-wide leading-relaxed text-[#f1efe8]/75">
            Cruze is built for high-demand ticket drops where thousands of attendees compete for exact auditorium seating. Inventory locks prevent race conditions, while modular payment gateways ensure verified instant ticketing in Qatari Riyal (QAR).
          </p>
        </section>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-white/10 bg-[#161614] p-8 space-y-3">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#d8763d]">
              01 / LOCKING
            </span>
            <h3 className="text-lg font-bold uppercase text-[#f1efe8]">Transactional Integrity</h3>
            <p className="font-mono text-xs uppercase tracking-wider text-[#f1efe8]/70">
              Database-level transactions guarantee that no seat is sold twice, even during flash ticket sales.
            </p>
          </div>

          <div className="border border-white/10 bg-[#161614] p-8 space-y-3">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#34d399]">
              02 / SECURITY
            </span>
            <h3 className="text-lg font-bold uppercase text-[#f1efe8]">Cryptographic Entry Passes</h3>
            <p className="font-mono text-xs uppercase tracking-wider text-[#f1efe8]/70">
              Each admission pass creates a signed digital QR code validated instantly by gate staff.
            </p>
          </div>

          <div className="border border-white/10 bg-[#161614] p-8 space-y-3">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#fbbf24]">
              03 / PAYMENTS
            </span>
            <h3 className="text-lg font-bold uppercase text-[#f1efe8]">Modular Payment Rails</h3>
            <p className="font-mono text-xs uppercase tracking-wider text-[#f1efe8]/70">
              Seamless checkout processing via Stripe and regional gateways with webhook idempotency.
            </p>
          </div>

          <div className="border border-white/10 bg-[#161614] p-8 space-y-3">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#d8763d]">
              04 / LOCALIZATION
            </span>
            <h3 className="text-lg font-bold uppercase text-[#f1efe8]">Qatar Tailored</h3>
            <p className="font-mono text-xs uppercase tracking-wider text-[#f1efe8]/70">
              Native QAR currency pricing, Asia/Qatar timezone handling, and Doha venue maps.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
