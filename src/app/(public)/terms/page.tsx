import Link from 'next/link'
import { getLegalContent } from '@/lib/legal-content'

export const dynamic = 'force-dynamic'

function DefaultTermsContent() {
  return (
    <div className="space-y-12">
      {/* TERMS OF SERVICE */}
      <section className="space-y-8">
        <div className="space-y-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#d8763d]">
            01 / LEGAL FRAMEWORK · QATAR
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#f1efe8]">
            TERMS OF SERVICE<span className="text-[#d8763d]">.</span>
          </h1>
          <p className="font-mono text-xs uppercase tracking-wider text-[#f1efe8]/60">
            Last updated: 2026 · Doha, Qatar
          </p>
        </div>

        <div className="border border-white/10 bg-[#161614] p-8 sm:p-10 space-y-6">
          <p className="font-mono text-xs uppercase tracking-wide leading-relaxed text-[#f1efe8]/80">
            These Terms of Service govern your discovery, reservation, and purchase of admission tickets for curated live events in Qatar on the Cruze platform. By reserving a seat or completing an order, you agree to these Terms.
          </p>

          <div className="space-y-8 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <h2 className="text-lg font-bold uppercase tracking-tight text-[#f1efe8]">
                1. Platform Scope
              </h2>
              <p className="font-mono text-xs uppercase tracking-wide leading-relaxed text-[#f1efe8]/75">
                Cruze is an event discovery and ticketing platform dedicated to experiences in Qatar. Cruze staff curate and manage event listings. Ticket holders enter into admission agreements backed by the respective Qatar venue policies.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold uppercase tracking-tight text-[#f1efe8]">
                2. Seat Reservations & Inventory Locks
              </h2>
              <p className="font-mono text-xs uppercase tracking-wide leading-relaxed text-[#f1efe8]/75">
                All seat and admission passes represent guaranteed unique places. Selected seats are temporarily held during active checkout (up to 10 minutes). If reservation timers expire prior to authorization, inventory is released back to the floor. All stated prices are in Qatari Riyal (QAR).
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold uppercase tracking-tight text-[#f1efe8]">
                3. Admission Pass Verification
              </h2>
              <p className="font-mono text-xs uppercase tracking-wide leading-relaxed text-[#f1efe8]/75">
                Each purchased pass includes a cryptographically unique QR entry code. Entry passes are scanned at the venue gate in Doha. Duplicate, replayed, or altered tickets will be denied admission.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold uppercase tracking-tight text-[#f1efe8]">
                4. Governing Law
              </h2>
              <p className="font-mono text-xs uppercase tracking-wide leading-relaxed text-[#f1efe8]/75">
                These terms are governed by the laws and regulations of the State of Qatar. Any disputes shall be subject to the jurisdiction of the competent courts in Doha.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* REFUND POLICY */}
      <section className="space-y-8 pt-6">
        <div className="space-y-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#d8763d]">
            02 / CANCELLATION & REFUNDS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#f1efe8]">
            REFUND POLICY<span className="text-[#d8763d]">.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-white/10 bg-[#161614] p-6 space-y-3">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#34d399]">
              &gt; 30 DAYS PRIOR
            </span>
            <h3 className="text-lg font-bold uppercase text-[#f1efe8]">100% Refund</h3>
            <p className="font-mono text-xs uppercase tracking-wider text-[#f1efe8]/70">
              Full refund of face ticket value back to the original payment method.
            </p>
          </div>

          <div className="border border-white/10 bg-[#161614] p-6 space-y-3">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#fbbf24]">
              14–30 DAYS PRIOR
            </span>
            <h3 className="text-lg font-bold uppercase text-[#f1efe8]">50% Refund</h3>
            <p className="font-mono text-xs uppercase tracking-wider text-[#f1efe8]/70">
              Fifty percent refund processed to the original payment method.
            </p>
          </div>

          <div className="border border-white/10 bg-[#161614] p-6 space-y-3">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#f87171]">
              &lt; 14 DAYS PRIOR
            </span>
            <h3 className="text-lg font-bold uppercase text-[#f1efe8]">Non-Refundable</h3>
            <p className="font-mono text-xs uppercase tracking-wider text-[#f1efe8]/70">
              Passes within 14 days of the scheduled curtain are final. Transfers permitted.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default async function TermsPage() {
  const customContent = await getLegalContent('legal_tos')

  return (
    <main className="min-h-screen bg-[#11110f] text-[#f1efe8] px-4 py-12 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[#f1efe8]/50">
          <span>CRUZE® / QAT / 2026 · LEGAL</span>
          <Link href="/events" className="hover:text-[#d8763d] transition-colors">
            ← BACK TO EVENTS
          </Link>
        </div>

        {customContent?.plainText?.trim() ? (
          <div className="border border-white/10 bg-[#161614] p-8 sm:p-12 space-y-6">
            <h1 className="text-4xl font-black uppercase tracking-tight text-[#f1efe8]">
              Terms of Service<span className="text-[#d8763d]">.</span>
            </h1>
            <div
              className="prose prose-invert max-w-none prose-headings:text-[#f1efe8] prose-p:text-[#f1efe8]/80 prose-a:text-[#d8763d]"
              dangerouslySetInnerHTML={{ __html: customContent.html }}
            />
          </div>
        ) : (
          <DefaultTermsContent />
        )}
      </div>
    </main>
  )
}
