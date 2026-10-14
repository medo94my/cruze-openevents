export default function EventDetailLoading() {
  return (
    <main className="min-h-screen bg-[#11110f] text-[#f1efe8] px-4 py-8 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-[1400px] space-y-12">
        {/* Top Bar Navigation Skeleton */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="h-3 w-44 animate-pulse bg-white/10 font-mono" />
          <div className="h-3 w-32 animate-pulse bg-white/10 font-mono" />
          <div className="h-3 w-20 animate-pulse bg-white/10 font-mono" />
        </div>

        {/* Monolithic Title & Hero Image */}
        <div className="space-y-6">
          <div className="h-14 sm:h-20 w-3/4 animate-pulse bg-white/15" />

          {/* Hero Cover Image Skeleton */}
          <div className="aspect-[21/9] w-full animate-pulse border border-white/10 bg-[#161614]">
            <div className="h-full w-full bg-white/5" />
          </div>
        </div>

        {/* Meta Grid (Date / Location / Curated By) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-y border-white/10 py-6">
          <div className="space-y-2">
            <div className="h-2.5 w-20 animate-pulse bg-white/10 font-mono" />
            <div className="h-5 w-40 animate-pulse bg-white/15 font-mono" />
          </div>
          <div className="space-y-2">
            <div className="h-2.5 w-20 animate-pulse bg-white/10 font-mono" />
            <div className="h-5 w-48 animate-pulse bg-white/15 font-mono" />
          </div>
          <div className="space-y-2">
            <div className="h-2.5 w-24 animate-pulse bg-white/10 font-mono" />
            <div className="h-5 w-36 animate-pulse bg-white/15 font-mono" />
          </div>
        </div>

        {/* Info Grid (About / Details / Price / Action) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          <div className="lg:col-span-6 space-y-4">
            <div className="h-3 w-16 animate-pulse bg-white/10 font-mono" />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse bg-white/10" />
              <div className="h-4 w-5/6 animate-pulse bg-white/10" />
              <div className="h-4 w-4/6 animate-pulse bg-white/10" />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <div className="h-3 w-16 animate-pulse bg-white/10 font-mono" />
            <div className="space-y-2">
              <div className="h-3 w-36 animate-pulse bg-white/10 font-mono" />
              <div className="h-3 w-28 animate-pulse bg-white/10 font-mono" />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4 border border-white/10 bg-[#161614] p-6">
            <div className="h-3 w-12 animate-pulse bg-white/10 font-mono" />
            <div className="h-8 w-28 animate-pulse bg-white/15 font-mono" />
            <div className="h-12 w-full animate-pulse bg-white/10" />
          </div>
        </div>
      </div>
    </main>
  )
}
