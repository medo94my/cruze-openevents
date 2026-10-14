import Link from 'next/link'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { getContactContent } from '@/lib/legal-content'

export const dynamic = 'force-dynamic'

function DefaultContactContent() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#d8763d]">
          01 / DIRECT CONCIERGE
        </span>
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#f1efe8]">
          CONTACT US<span className="text-[#d8763d]">.</span>
        </h1>
        <p className="font-mono text-xs uppercase tracking-wider text-[#f1efe8]/65 max-w-lg">
          Direct inquiries, VIP seating arrangements, and live event support across Qatar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <section className="border border-white/10 bg-[#161614] p-8 space-y-4">
          <div className="flex items-center gap-3 text-[#d8763d]">
            <Mail className="h-4 w-4" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#f1efe8]/50">
              EMAIL DESK
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold uppercase tracking-tight text-[#f1efe8]">Support & Booking</h2>
            <a
              href="mailto:concierge@cruze.qa"
              className="mt-2 inline-block font-mono text-sm text-[#d8763d] hover:underline"
            >
              concierge@cruze.qa
            </a>
          </div>
        </section>

        <section className="border border-white/10 bg-[#161614] p-8 space-y-4">
          <div className="flex items-center gap-3 text-[#d8763d]">
            <MapPin className="h-4 w-4" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#f1efe8]/50">
              LOCATION
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold uppercase tracking-tight text-[#f1efe8]">Doha HQ</h2>
            <p className="mt-2 font-mono text-xs uppercase tracking-wider text-[#f1efe8]/65">
              Katara Cultural Village · Doha, Qatar
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

type CustomContactContentProps = {
  contact: {
    email: string
    phone: string
    companyName: string
    address: string
    businessHours: string
  }
}

function CustomContactContent({ contact }: CustomContactContentProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#d8763d]">
          01 / CONCIERGE & SUPPORT
        </span>
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#f1efe8]">
          CONTACT {contact.companyName || 'CRUZE'}<span className="text-[#d8763d]">.</span>
        </h1>
        <p className="font-mono text-xs uppercase tracking-wider text-[#f1efe8]/65 max-w-lg">
          Live assistance, venue access, and admission queries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {contact.email && (
          <section className="border border-white/10 bg-[#161614] p-8 space-y-4">
            <div className="flex items-center gap-3 text-[#d8763d]">
              <Mail className="h-4 w-4" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#f1efe8]/50">
                EMAIL
              </span>
            </div>
            <div>
              <a
                href={`mailto:${contact.email}`}
                className="font-mono text-sm text-[#d8763d] hover:underline"
              >
                {contact.email}
              </a>
            </div>
          </section>
        )}

        {contact.phone && (
          <section className="border border-white/10 bg-[#161614] p-8 space-y-4">
            <div className="flex items-center gap-3 text-[#d8763d]">
              <Phone className="h-4 w-4" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#f1efe8]/50">
                DIRECT LINE
              </span>
            </div>
            <div>
              <a
                href={`tel:${contact.phone.replace(/\s/g, '')}`}
                className="font-mono text-sm text-[#d8763d] hover:underline"
              >
                {contact.phone}
              </a>
            </div>
          </section>
        )}

        {contact.address && (
          <section className="border border-white/10 bg-[#161614] p-8 space-y-4">
            <div className="flex items-center gap-3 text-[#d8763d]">
              <MapPin className="h-4 w-4" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#f1efe8]/50">
                ADDRESS
              </span>
            </div>
            <p className="font-mono text-xs uppercase tracking-wider text-[#f1efe8]/75 leading-relaxed whitespace-pre-line">
              {contact.companyName && (
                <>
                  {contact.companyName}
                  <br />
                </>
              )}
              {contact.address}
            </p>
          </section>
        )}

        {contact.businessHours && (
          <section className="border border-white/10 bg-[#161614] p-8 space-y-4">
            <div className="flex items-center gap-3 text-[#d8763d]">
              <Clock className="h-4 w-4" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#f1efe8]/50">
                OPERATIONAL HOURS
              </span>
            </div>
            <p className="font-mono text-xs uppercase tracking-wider text-[#f1efe8]/75 whitespace-pre-line">
              {contact.businessHours}
            </p>
          </section>
        )}
      </div>
    </div>
  )
}

export default async function ContactPage() {
  const customContent = await getContactContent()

  const hasCustomContent =
    customContent &&
    (customContent.email ||
      customContent.phone ||
      customContent.companyName ||
      customContent.address ||
      customContent.businessHours)

  return (
    <main className="min-h-screen bg-[#11110f] text-[#f1efe8] px-4 py-12 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[#f1efe8]/50">
          <span>CRUZE® / QAT / 2026 · CONCIERGE</span>
          <Link href="/events" className="hover:text-[#d8763d] transition-colors">
            ← BACK TO EVENTS
          </Link>
        </div>

        {hasCustomContent ? (
          <CustomContactContent contact={customContent} />
        ) : (
          <DefaultContactContent />
        )}
      </div>
    </main>
  )
}
