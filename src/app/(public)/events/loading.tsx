export default function EventsLoading() {
  return (
    <main className="min-h-screen bg-[#11110f] text-[#f1efe8] px-4 py-8 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-[1500px] space-y-10">
        {/* Eyebrow & Hero Title */}
        <div className="space-y-4 border-b border-white/10 pb-8">
          <div className="h-3 w-40 animate-pulse bg-white/10 font-mono" />
          <div className="h-14 w-72 animate-pulse bg-white/15" />
          <div className="flex flex-wrap gap-8 pt-2">
            <div className="h-8 w-44 animate-pulse bg-white/5" />
            <div className="h-8 w-44 animate-pulse bg-white/5" />
          </div>
        </div>

        {/* Filter categories bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-6">
          <div className="h-3 w-16 animate-pulse bg-white/10 font-mono mr-4" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 w-20 animate-pulse border border-white/10 bg-white/5" />
          ))}
        </div>

        {/* Event cards grid — 6 cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden border border-white/10 bg-[#161614]"
            >
              {/* Image placeholder */}
              <div className="h-56 bg-white/5 border-b border-white/10" />

              <div className="space-y-4 p-6">
                {/* Number & Category */}
                <div className="flex items-center justify-between">
                  <div className="h-3 w-8 bg-white/15" />
                  <div className="h-3 w-16 bg-white/10" />
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <div className="h-6 w-5/6 bg-white/15" />
                  <div className="h-6 w-3/4 bg-white/10" />
                </div>

                {/* Date & Location */}
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <div className="h-3 w-36 bg-white/10" />
                  <div className="h-3 w-28 bg-white/10" />
                </div>

                {/* Price */}
                <div className="pt-2 flex items-center justify-between border-t border-white/5">
                  <div className="h-3 w-12 bg-white/10" />
                  <div className="h-5 w-20 bg-white/15" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
