import Link from 'next/link'
import { getLegalContent } from '@/lib/legal-content'

export const dynamic = 'force-dynamic'

function DefaultPrivacyContent() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#d8763d]">
          01 / DATA PRIVACY & COMPLIANCE
        </span>
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#f1efe8]">
          PRIVACY POLICY<span className="text-[#d8763d]">.</span>
        </h1>
        <p className="font-mono text-xs uppercase tracking-wider text-[#f1efe8]/60">
          Last updated: 2026 · Doha, Qatar
        </p>
      </div>

      <div className="border border-white/10 bg-[#161614] p-8 sm:p-10 space-y-6">
        <p className="font-mono text-xs uppercase tracking-wide leading-relaxed text-[#f1efe8]/80">
          Cruze is committed to safeguarding the privacy and personal data of our patrons across Qatar. This policy outlines how information is collected, processed, and safeguarded when discovering and reserving tickets.
        </p>

        <div className="space-y-8 pt-4 border-t border-white/10">
          <div className="space-y-2">
            <h2 className="text-lg font-bold uppercase tracking-tight text-[#f1efe8]">
              1. Information We Collect
            </h2>
            <p className="font-mono text-xs uppercase tracking-wide leading-relaxed text-[#f1efe8]/75">
              When booking admissions, we collect your name, email address, contact telephone, and ticketing selections. Payment card numbers are processed directly by certified payment gateways (e.g. Stripe) and are never stored on Cruze servers.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold uppercase tracking-tight text-[#f1efe8]">
              2. Purpose of Processing
            </h2>
            <p className="font-mono text-xs uppercase tracking-wide leading-relaxed text-[#f1efe8]/75">
              Your data is utilized strictly to fulfill seat reservations, deliver dynamic digital QR entry passes, verify gate admissions in Doha venues, and transmit essential event schedule updates.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold uppercase tracking-tight text-[#f1efe8]">
              3. Data Security & Encryption
            </h2>
            <p className="font-mono text-xs uppercase tracking-wide leading-relaxed text-[#f1efe8]/75">
              All communications are encrypted using TLS 1.3. Admission QR tokens are digitally signed to protect against unauthorized duplication and ticket spoofing.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold uppercase tracking-tight text-[#f1efe8]">
              4. Contact & Inquiries
            </h2>
            <p className="font-mono text-xs uppercase tracking-wide leading-relaxed text-[#f1efe8]/75">
              For inquiries regarding personal data records or deletion requests, please contact our data team at privacy@cruze.qa.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function PrivacyPage() {
  const customContent = await getLegalContent('legal_privacy')

  return (
    <main className="min-h-screen bg-[#11110f] text-[#f1efe8] px-4 py-12 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[#f1efe8]/50">
          <span>CRUZE® / QAT / 2026 · PRIVACY</span>
          <Link href="/events" className="hover:text-[#d8763d] transition-colors">
            ← BACK TO EVENTS
          </Link>
        </div>

        {customContent?.plainText?.trim() ? (
          <div className="border border-white/10 bg-[#161614] p-8 sm:p-12 space-y-6">
            <h1 className="text-4xl font-black uppercase tracking-tight text-[#f1efe8]">
              Privacy Policy<span className="text-[#d8763d]">.</span>
            </h1>
            <div
              className="prose prose-invert max-w-none prose-headings:text-[#f1efe8] prose-p:text-[#f1efe8]/80 prose-a:text-[#d8763d]"
              dangerouslySetInnerHTML={{ __html: customContent.html }}
            />
          </div>
        ) : (
          <DefaultPrivacyContent />
        )}
      </div>
    </main>
  )
}
