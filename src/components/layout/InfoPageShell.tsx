import Link from 'next/link'

type InfoPageShellProps = {
  title: string
  description: string
}

export function InfoPageShell({ title, description }: InfoPageShellProps) {
  return (
    <main className="min-h-[70vh] bg-[#11110f] text-[#f1efe8] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[#f1efe8]/50">
          <span>CRUZE® / SUPPORT & INFO</span>
          <Link href="/events" className="hover:text-[#d8763d] transition-colors">
            ← BACK TO EVENTS
          </Link>
        </div>

        <section className="border border-white/10 bg-[#161614] p-8 sm:p-12 space-y-6">
          <div className="space-y-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#d8763d]">
              HELP & RESOURCES
            </span>
            <h1 className="text-3xl font-black uppercase tracking-tight sm:text-4xl text-[#f1efe8]">
              {title}
              <span className="text-[#d8763d]">.</span>
            </h1>
          </div>

          <p className="font-mono text-sm leading-relaxed text-[#f1efe8]/75">
            {description}
          </p>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[#f1efe8]/45">
            <span>Doha · Qatar</span>
            <span>concierge@cruze.qa</span>
          </div>
        </section>
      </div>
    </main>
  )
}
