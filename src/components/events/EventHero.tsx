type EventHeroProps = {
  title: string
  description: string | null
  coverImage: string | null
  startDate: Date
}

export function EventHero({ title, description, coverImage, startDate }: EventHeroProps) {
  const formattedDate = new Intl.DateTimeFormat('en', {
    dateStyle: 'long',
    timeZone: 'Asia/Qatar',
  }).format(new Date(startDate))

  return (
    <section className="relative overflow-hidden border border-white/10 bg-[#161614] p-8 text-[#f1efe8] md:p-12">
      {coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverImage}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
      ) : null}
      <div className="relative max-w-3xl space-y-3">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d8763d]">
          {formattedDate}
        </p>
        <h1 className="text-4xl font-black uppercase tracking-tight md:text-5xl text-[#f1efe8]">
          {title}
        </h1>
        {description ? (
          <p className="font-mono text-sm leading-relaxed text-[#f1efe8]/75">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  )
}
