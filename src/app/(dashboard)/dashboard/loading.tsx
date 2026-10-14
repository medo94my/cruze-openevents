export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6">
        <div className="animate-pulse space-y-2">
          <div className="h-8 w-64 rounded-lg bg-white/10" />
          <div className="h-4 w-48 rounded bg-white/5" />
        </div>
      </div>

      {/* Stats grid — 6 cards, 3 cols on lg */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-white/10 bg-[#161614] p-5">
            <div className="h-3 w-24 rounded bg-white/10" />
            <div className="mt-3 h-8 w-16 rounded bg-white/10" />
          </div>
        ))}
      </div>

      {/* Two-column: upcoming events + recent orders */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming events card */}
        <div className="animate-pulse rounded-2xl border border-white/10 bg-[#161614] p-6">
          <div className="mb-4 h-5 w-36 rounded bg-white/10" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-white/5 bg-[#11110f] p-4">
                <div className="space-y-2">
                  <div className="h-4 w-40 rounded bg-white/10" />
                  <div className="h-3 w-24 rounded bg-white/5" />
                </div>
                <div className="h-5 w-16 rounded-full bg-white/10" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent orders card */}
        <div className="animate-pulse rounded-2xl border border-white/10 bg-[#161614] p-6">
          <div className="mb-4 h-5 w-28 rounded bg-white/10" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-white/5 bg-[#11110f] p-4">
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded bg-white/10" />
                  <div className="h-3 w-20 rounded bg-white/5" />
                </div>
                <div className="space-y-2 text-right">
                  <div className="h-4 w-16 rounded bg-white/10" />
                  <div className="h-5 w-14 rounded-full bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
