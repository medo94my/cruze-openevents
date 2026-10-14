export default function DashboardEventsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6">
        <div className="animate-pulse space-y-2">
          <div className="h-8 w-32 bg-white/15" />
          <div className="h-4 w-56 bg-white/10 font-mono" />
        </div>
        <div className="h-9 w-32 animate-pulse border border-white/15 bg-white/10" />
      </div>

      {/* Filter form */}
      <div className="animate-pulse grid grid-cols-1 gap-3 border border-white/10 bg-[#161614] p-4 md:grid-cols-4">
        <div className="h-10 bg-white/5 border border-white/10 md:col-span-2" />
        <div className="h-10 bg-white/5 border border-white/10" />
        <div className="h-10 bg-white/10 border border-white/10" />
      </div>

      {/* Events table */}
      <div className="animate-pulse overflow-hidden border border-white/10 bg-[#161614]">
        {/* Table header */}
        <div className="grid grid-cols-5 gap-4 border-b border-white/10 bg-white/[0.02] px-4 py-3">
          {['w-16', 'w-32', 'w-20', 'w-20', 'w-16'].map((w, i) => (
            <div key={i} className={`h-3 bg-white/15 ${w}`} />
          ))}
        </div>
        {/* Table rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-5 items-center gap-4 border-b border-white/5 px-4 py-4 last:border-0"
          >
            <div className="h-4 w-40 bg-white/15" />
            <div className="h-3 w-28 bg-white/10 font-mono" />
            <div className="h-4 w-16 bg-white/10" />
            <div className="h-3 w-10 bg-white/10 font-mono" />
            <div className="flex gap-2">
              <div className="h-7 w-12 border border-white/10 bg-white/5" />
              <div className="h-7 w-12 border border-white/10 bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
