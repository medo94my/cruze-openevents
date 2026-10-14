export default function HomeLoading() {
  return (
    <main className="min-h-screen bg-[#11110f] text-[#f1efe8] px-5 py-6 md:px-8">
      <div className="mx-auto max-w-[1500px] space-y-12">
        {/* Top telemetry bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="h-4 w-40 animate-pulse bg-white/10 font-mono" />
          <div className="h-4 w-28 animate-pulse bg-white/10 font-mono" />
        </div>

        {/* Hero skeleton */}
        <div className="aspect-[16/8] w-full animate-pulse border border-white/10 bg-[#161614] p-8 flex flex-col justify-end">
          <div className="space-y-4 max-w-2xl">
            <div className="h-3 w-32 bg-white/10 font-mono" />
            <div className="h-16 w-full bg-white/15" />
            <div className="h-4 w-3/4 bg-white/10" />
          </div>
        </div>

        {/* Events cards row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse border border-white/10 bg-[#161614] p-6 space-y-4">
              <div className="aspect-[16/10] bg-white/5 border border-white/10" />
              <div className="h-5 w-3/4 bg-white/15" />
              <div className="h-3 w-1/2 bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
