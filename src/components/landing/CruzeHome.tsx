"use client"

import { useMemo, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowRight, ArrowUpRight, Compass, Heart,
  MapPin, Music2, Palette, Search, Sparkles, Sun, Ticket,
  UtensilsCrossed, UsersRound, Waves, BriefcaseBusiness, X,
} from "lucide-react"

export type CruzeEvent = {
  id: string
  slug: string
  title: string
  description: string | null
  coverImage: string | null
  startDate: string
  endDate: string
  city: string
  venue: string
  isDemo: boolean
  ticketPrice: number | null
  currency: string
}

type Category = "all" | "music" | "culture" | "workshops" | "family" | "wellness" | "outdoors" | "community"
type Language = "en" | "ar"
type DateFilter = "any" | "weekend" | "week"
const heroImage = "https://images.pexels.com/photos/30522277/pexels-photo-30522277.jpeg?auto=compress&cs=tinysrgb&w=2000"

const categories = [
  { key: "all" as Category, icon: Compass, en: "All experiences", ar: "كل الفعاليات" },
  { key: "music" as Category, icon: Music2, en: "Music & nights", ar: "الموسيقى والسهرات" },
  { key: "culture" as Category, icon: UtensilsCrossed, en: "Food & culture", ar: "الطعام والثقافة" },
  { key: "workshops" as Category, icon: Palette, en: "Arts & workshops", ar: "الفنون والورش" },
  { key: "family" as Category, icon: UsersRound, en: "Family & kids", ar: "العائلة والأطفال" },
  { key: "wellness" as Category, icon: Heart, en: "Wellness", ar: "الصحة والعافية" },
  { key: "outdoors" as Category, icon: Sun, en: "Outdoor escapes", ar: "المغامرات" },
  { key: "community" as Category, icon: BriefcaseBusiness, en: "Meet & connect", ar: "اللقاءات" },
]

const copy = {
  en: {
    preview: "DESIGN PREVIEW · EVENTS ARE FICTIONAL",
    city: "MADE FOR EVERY SIDE OF DOHA",
    eyebrow: "THE CITY IS YOURS TO EXPLORE",
    headOne: "Your city.",
    headTwo: "Your next story.",
    heroDescription: "The nights out, new friendships, hidden gems and unforgettable weekends that make Qatar feel like home.",
    find: "Find your experience",
    search: "Search events, moods, places...",
    explore: "Explore events",
    trending: "What's happening around you",
    curated: "THE CRUZE EDIT",
    featured: "A little something for everyone.",
    featuredText: "From live music in the city to culture, creativity and new connections — find your kind of Doha.",
    discovery: "Find your kind of fun",
    discoverText: "Good plans start with a feeling. What are you in the mood for?",
    all: "All events",
    thisWeekend: "This weekend",
    nextWeek: "Next 7 days",
    free: "Free experiences",
    results: "experiences to explore",
    noResults: "No matching experiences yet.",
    tryAgain: "Try a different category or remove your filters.",
    reset: "Clear filters",
    view: "View experience",
    from: "From",
    freeLabel: "Free",
    concept: "CONCEPT EVENT",
    place: "DOHA, QATAR",
    spotlight: "YOUR WEEKEND, REIMAGINED",
    spotlightTitle: "Good memories don't need a passport.",
    spotlightText: "From lifelong Qatar residents to those who just unpacked their bags: this is where cultures cross paths and strangers become friends.",
    living: "Living in Doha",
    livingText: "Find your community, discover local favourites and make every weekend count.",
    visiting: "Exploring Qatar",
    visitingText: "Beyond the landmarks — experience the city, its people and the things worth remembering.",
    together: "Better together",
    togetherText: "Music, culture and familiar faces, with room at the table for everyone.",
    closing: "The best of Qatar is yet to come.",
    closingButton: "Explore what's on",
    local: "Rooted in Qatar. Open to the world.",
    safe: "Sample listings only. These events are fictional; ticket sales are disabled.",
    discoverMore: "Explore all experiences",
  },
  ar: {
    preview: "معاينة التصميم · الفعاليات تجريبية",
    city: "لكل من يعتبر الدوحة بيته",
    eyebrow: "اكتشف مدينتك بطريقتك",
    headOne: "مدينتك.",
    headTwo: "وحكايتك القادمة.",
    heroDescription: "أمسيات ممتعة، صداقات جديدة، أماكن مميزة وعطلات أسبوع لا تُنسى في قطر.",
    find: "ابحث عن تجربتك",
    search: "ابحث عن فعاليات أو أماكن...",
    explore: "استكشف الفعاليات",
    trending: "تجارب قريبة منك",
    curated: "اختيارات كروز",
    featured: "تجارب تناسب كل الأذواق.",
    featuredText: "من الموسيقى والثقافة إلى الإبداع واللقاءات الجديدة، اكتشف الدوحة كما تحب.",
    discovery: "اختر ما يناسبك",
    discoverText: "أجمل الخطط تبدأ بفكرة. ماذا تحب أن تفعل؟",
    all: "كل الفعاليات",
    thisWeekend: "نهاية الأسبوع",
    nextWeek: "الأيام السبعة القادمة",
    free: "فعاليات مجانية",
    results: "تجارب للاكتشاف",
    noResults: "لا توجد فعاليات مطابقة حالياً.",
    tryAgain: "جرّب فئة أخرى أو غيّر خيارات البحث.",
    reset: "إزالة الفلاتر",
    view: "تفاصيل التجربة",
    from: "من",
    freeLabel: "مجاناً",
    concept: "فعالية تجريبية",
    place: "الدوحة، قطر",
    spotlight: "نهاية أسبوع مختلفة",
    spotlightTitle: "أجمل الذكريات تجمعنا.",
    spotlightText: "سواء كنت من أهل قطر أو انتقلت إليها حديثاً، هنا تلتقي الثقافات وتبدأ الصداقات.",
    living: "حياتك في الدوحة",
    livingText: "اكتشف مجتمعك وأماكنك المفضلة واستمتع بكل عطلة أسبوع.",
    visiting: "استكشاف قطر",
    visitingText: "تعرّف على المدينة وأهلها وتجاربها التي تستحق الذكرى.",
    together: "الأجمل معاً",
    togetherText: "موسيقى وثقافة وأصدقاء ومساحة ترحب بالجميع.",
    closing: "أفضل لحظات قطر لم تأتِ بعد.",
    closingButton: "اكتشف الفعاليات",
    local: "من قطر، ولكل العالم.",
    safe: "فعاليات لأغراض العرض فقط. لا توجد حجوزات أو مبيعات حقيقية.",
    discoverMore: "عرض جميع التجارب",
  },
}

function categoryFor(event: CruzeEvent): Category {
  const text = (event.title + " " + (event.description || "")).toLowerCase()
  if (/jazz|music|soundscape|concert|gig|nightlife|band|live show/.test(text)) return "music"
  if (/souq|flavour|filipino|desi|food|culture|cuisine|heritage|festival/.test(text)) return "culture"
  if (/clay|art|creative|pottery|painting|craft|workshop/.test(text)) return "workshops"
  if (/family|kids|play day|children|picnic/.test(text)) return "family"
  if (/wellness|yoga|fitness|mindful/.test(text)) return "wellness"
  if (/desert|sealine|stargazing|outdoor|adventure|camp/.test(text)) return "outdoors"
  return "community"
}

function cleanTitle(title: string) {
  return title.replace(/^\[DEMO\]\s*/, "")
}

function eventDate(date: string, lang: Language) {
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-QA" : "en-GB", {
    day: "numeric", month: "short", timeZone: "Asia/Qatar",
  }).format(new Date(date))
}

function eventWeekday(date: string, lang: Language) {
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-QA" : "en-GB", {
    weekday: "short", timeZone: "Asia/Qatar",
  }).format(new Date(date))
}

function price(event: CruzeEvent, lang: Language) {
  if (event.ticketPrice === null) return "—"
  if (event.ticketPrice === 0) return copy[lang].freeLabel
  return (lang === "ar" ? "ر.ق " : "QAR ") + event.ticketPrice.toLocaleString("en-GB")
}

function dateMatches(event: CruzeEvent, filter: DateFilter) {
  if (filter === "any") return true
  const now = new Date()
  const eventDateValue = new Date(event.startDate)
  const daysUntil = (eventDateValue.getTime() - now.getTime()) / 86400000
  if (filter === "week") return daysUntil >= 0 && daysUntil <= 7
  // Weekend in Qatar is Friday/Saturday, selecting the upcoming Friday and Saturday.
  // Qatar's weekend is Friday/Saturday, measured in Asia/Qatar rather than UTC.
  const local = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Qatar", year: "numeric", month: "numeric", day: "numeric" })
      .formatToParts(now).filter((part) => part.type !== "literal").map((part) => [part.type, Number(part.value)])
  )
  const localDay = new Date(Date.UTC(local.year, local.month - 1, local.day))
  const daysToFriday = (5 - localDay.getUTCDay() + 7) % 7
  const friday = new Date(localDay.getTime() + daysToFriday * 86400000 - 3 * 3600000)
  const sunday = new Date(friday.getTime() + 2 * 86400000)
  return eventDateValue >= friday && eventDateValue < sunday
}

function EventTile({ event, lang, large = false }: { event: CruzeEvent; lang: Language; large?: boolean }) {
  const category = categories.find((c) => c.key === categoryFor(event))
  return (
    <Link
      href={"/events/" + encodeURIComponent(event.slug)}
      className={"group relative block overflow-hidden rounded-[28px] bg-[#12131a] text-white spatial-glass-card " + (large ? "min-h-[380px] sm:min-h-[460px]" : "min-h-[220px] sm:min-h-[224px]")}
    >
      {event.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={event.coverImage} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f]/95 via-[#170c16]/40 to-black/20" />
      <div className="absolute start-5 top-5 flex flex-wrap gap-2">
        <span className="rounded-full spatial-glass-dock px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#f5d8db] shadow-sm">{category?.[lang]}</span>
        {event.isDemo && <span className="rounded-full border border-white/20 bg-black/60 px-3.5 py-1.5 text-[10px] font-bold tracking-wider text-white backdrop-blur-md">{copy[lang].concept}</span>}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
        <p className="mb-2 text-xs font-semibold tracking-wide text-[#f8dcb4]">{eventDate(event.startDate, lang)} · {event.city}</p>
        <h3 className={"max-w-xl font-bold tracking-[-0.03em] transition-colors group-hover:text-[#f8dcb4] " + (large ? "text-3xl leading-tight sm:text-[40px]" : "text-[21px] leading-snug")}>{cleanTitle(event.title)}</h3>
        {large && <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#fff4e3] transition group-hover:translate-x-1">{copy[lang].view}<ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" /></div>}
      </div>
    </Link>
  )
}

function EventCard({ event, lang }: { event: CruzeEvent; lang: Language }) {
  const category = categories.find((c) => c.key === categoryFor(event))
  return (
    <Link href={"/events/" + encodeURIComponent(event.slug)} className="group block overflow-hidden rounded-[26px] spatial-glass-card text-[#271d20]">
      <div className="relative aspect-[1.45] overflow-hidden bg-[#181920]">
        {event.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.coverImage} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105" />
        ) : <div className="h-full w-full bg-gradient-to-tr from-[#721635] to-[#d5a876]" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
        <div className="absolute start-4 top-4 rounded-full spatial-glass-dock px-3 py-1.5 text-[11px] font-semibold text-[#481e2b] shadow-sm">{category?.[lang]}</div>
        {event.isDemo && <div className="absolute bottom-4 start-4 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">{copy[lang].concept}</div>}
        <span className="absolute bottom-4 end-4 flex h-10 w-10 items-center justify-center rounded-full spatial-glass-dock text-[#8a1538] shadow-md transition duration-300 group-hover:rotate-45 group-hover:scale-110"><ArrowUpRight size={17}/></span>
      </div>
      <div className="px-6 pb-6 pt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#8a1538]">{eventWeekday(event.startDate, lang)}, {eventDate(event.startDate, lang)} · {event.city}</p>
        <h3 className="min-h-[58px] text-[20px] font-bold leading-[1.32] tracking-tight text-[#22181d] transition-colors group-hover:text-[#8a1538]">{cleanTitle(event.title)}</h3>
        <div className="mt-3 flex items-center gap-1.5 text-[12.5px] text-[#76656b]"><MapPin size={14} className="shrink-0 text-[#8a1538]"/><span className="truncate">{event.venue}</span></div>
        <div className="mt-5 flex items-center justify-between border-t border-black/[0.06] pt-4">
          <span className="text-xs font-medium text-[#8c7b82]">{event.ticketPrice === 0 ? copy[lang].freeLabel : copy[lang].from}</span>
          <span className="text-[19px] font-extrabold text-[#8a1538]">{price(event, lang)}</span>
        </div>
      </div>
    </Link>
  )
}

export function CruzeHome({ events, compact = false, initialDate = "any", initialSearch = "" }: { events: CruzeEvent[]; compact?: boolean; initialDate?: DateFilter; initialSearch?: string }) {
  const [lang, setLang] = useState<Language>("en")
  const [category, setCategory] = useState<Category>("all")
  const [date, setDate] = useState<DateFilter>(initialDate)
  const [freeOnly, setFreeOnly] = useState(false)
  const [search, setSearch] = useState(initialSearch)
  const discoveryRef = useRef<HTMLDivElement>(null)
  const t = copy[lang]
  const filtered = useMemo(() => events.filter((event) => {
    const matchesCategory = category === "all" || categoryFor(event) === category
    const term = search.toLowerCase().trim()
    const matchesText = !term || [event.title, event.city, event.venue, event.description || ""].some((v) => v.toLowerCase().includes(term))
    return matchesCategory && matchesText && dateMatches(event, date) && (!freeOnly || event.ticketPrice === 0)
  }), [events, category, date, freeOnly, search])
  const goToDiscovery = () => discoveryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  const clear = () => { setCategory("all"); setDate("any"); setSearch(""); setFreeOnly(false) }

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="relative min-h-screen bg-[#090a0f] text-[#f2eff4] antialiased selection:bg-[#8A1538] selection:text-white overflow-hidden">
      {/* Background ambient aurora lights */}
      <div className="pointer-events-none absolute -top-40 right-1/4 h-[550px] w-[550px] rounded-full bg-[#8A1538]/15 blur-[140px] animate-aurora" />
      <div className="pointer-events-none absolute top-[600px] -left-40 h-[500px] w-[500px] rounded-full bg-[#d4af37]/10 blur-[130px] animate-aurora" />
      <div className="pointer-events-none absolute bottom-40 right-10 h-[600px] w-[600px] rounded-full bg-[#8A1538]/10 blur-[150px]" />

      {/* Top Notice Banner */}
      <div className="border-b border-white/[0.08] bg-[#12131a]/80 px-4 py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-[#e8bc91] backdrop-blur-md sm:text-xs">
        {t.preview}
      </div>

      {/* Subheader Utility Bar */}
      <div className="mx-auto flex max-w-[1300px] items-center justify-between px-5 py-3 sm:px-8 lg:px-12">
        <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-[#d4af37]">
          <span className="h-2 w-2 rounded-full bg-[#10b981] animate-pulse-radar" />
          <MapPin size={13} className="text-[#8a1538]"/>
          {t.place}
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] p-1 text-[11px] font-bold backdrop-blur-md">
          <button type="button" onClick={() => setLang("en")} aria-pressed={lang === "en"} className={"rounded-full px-3 py-1 transition duration-200 " + (lang === "en" ? "bg-[#8A1538] text-white shadow-sm" : "text-[#9da3af] hover:text-white")}>EN</button>
          <button type="button" onClick={() => setLang("ar")} aria-pressed={lang === "ar"} className={"rounded-full px-3 py-1 transition duration-200 " + (lang === "ar" ? "bg-[#8A1538] text-white shadow-sm" : "text-[#9da3af] hover:text-white")}>عربي</button>
        </div>
      </div>

      {!compact && (
        <>
          {/* Spatial Keynote Hero */}
          <section className="relative mx-3 min-h-[580px] overflow-hidden rounded-[32px] border border-white/10 bg-[#12131a] sm:mx-6 sm:min-h-[660px] sm:rounded-[40px] lg:mx-10 shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImage} alt="Illustrative Qatar-inspired event atmosphere" className="absolute inset-0 h-full w-full object-cover object-center opacity-40 transition-transform duration-1000 ease-out hover:scale-105" fetchPriority="high" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#090a0f]/95 via-[#180a14]/85 to-[#090a0f]/40 rtl:bg-gradient-to-l" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-transparent to-[#090a0f]/30" />
            
            <div className="relative mx-auto flex min-h-[580px] max-w-[1260px] flex-col justify-center px-6 pb-24 pt-14 sm:min-h-[660px] sm:px-12 lg:px-16">
              <div className="mb-7 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#d4af37] animate-pulse-radar"/>
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#d4af37] sm:text-xs">{t.eyebrow}</p>
              </div>
              <h1 className="max-w-4xl text-[50px] font-extrabold leading-[1.04] tracking-[-0.04em] sm:text-[76px] lg:text-[94px] text-white">
                {t.headOne}<br/>
                <span className="bg-gradient-to-r from-[#f1d2ab] via-[#ffd9a3] to-[#e8bc91] bg-clip-text text-transparent font-normal tracking-[-0.03em] italic">
                  {t.headTwo}
                </span>
              </h1>
              <p className="mt-6 max-w-[540px] text-[16px] leading-relaxed text-[#c7cbd4] sm:text-[18px]">{t.heroDescription}</p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <button type="button" onClick={goToDiscovery} className="sheen-effect inline-flex min-h-12 items-center gap-3 rounded-full bg-gradient-to-r from-[#8A1538] to-[#5C1026] px-8 py-3.5 text-sm font-bold text-white shadow-[0_8px_30px_rgba(138,21,56,0.4)] transition duration-300 hover:scale-105 active:scale-95">
                  {t.explore}
                  <ArrowRight size={17} className={lang === "ar" ? "rotate-180" : ""}/>
                </button>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold tracking-wide text-[#d4af37] backdrop-blur-md">
                  <Sparkles size={14}/>
                  {t.city}
                </span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-3 border-t border-white/10 bg-black/40 px-6 py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#9da3af] backdrop-blur-xl sm:px-12 lg:px-16">
              <span>{t.local}</span>
              <span className="font-mono text-[10.5px] text-[#d4af37]">25° 17′ N · 51° 32′ E · ASIA/QATAR</span>
            </div>
          </section>

          {/* Floating Spatial Search Capsule */}
          <div className="relative z-10 mx-auto -mt-8 max-w-[960px] px-6 sm:-mt-9">
            <form onSubmit={(e) => { e.preventDefault(); goToDiscovery() }} className="flex flex-wrap items-center gap-3 rounded-full border border-white/15 bg-[#171922]/90 p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:flex-nowrap sm:p-3">
              <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                <Search size={18} className="shrink-0 text-[#8a1538]"/>
                <input aria-label={t.search} value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.search} className="min-w-0 w-full border-0 bg-transparent py-2.5 text-[14.5px] text-white outline-none placeholder:text-[#6e7587]"/>
                {search && <button type="button" aria-label="Clear search" onClick={() => setSearch("")}><X size={16} className="text-[#9da3af]"/></button>}
              </div>
              <div className="hidden h-8 w-px bg-white/10 sm:block"/>
              <div className="hidden items-center gap-2 px-3 text-xs font-semibold text-[#c7cbd4] sm:flex"><MapPin size={14} className="text-[#d4af37]"/>Doha, Qatar</div>
              <button type="submit" className="sheen-effect w-full rounded-full bg-[#8A1538] px-7 py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#6c0f2a] active:scale-95 sm:w-auto">
                {t.find}
              </button>
            </form>
          </div>

          {/* Curated Grid Section */}
          <section className="mx-auto max-w-[1300px] px-5 pb-8 pt-24 sm:px-8 lg:px-12">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37]">{t.curated}</p>
                <h2 className="max-w-[650px] text-[34px] font-extrabold leading-[1.1] tracking-[-0.035em] text-white sm:text-[46px]">{t.featured}</h2>
                <p className="mt-3 max-w-[560px] text-[15px] leading-relaxed text-[#9da3af]">{t.featuredText}</p>
              </div>
              <button onClick={goToDiscovery} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/10 hover:border-white/30">
                {t.discoverMore}
                <ArrowUpRight size={15}/>
              </button>
            </div>
            {events.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.25fr_0.75fr]">
                <EventTile event={events[0]} lang={lang} large/>
                <div className="grid grid-rows-2 gap-5">
                  {events.slice(1,3).map((event) => <EventTile key={event.id} event={event} lang={lang}/>)}
                </div>
              </div>
            ) : <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center text-[#9da3af]">{t.noResults}</div>}
          </section>
        </>
      )}

      {compact && (
        <div className="mx-auto max-w-[1300px] px-5 pt-14 sm:px-8 lg:px-12">
          <p className="mb-2 text-xs font-bold tracking-[0.2em] text-[#d4af37]">{t.place}</p>
          <h1 className="text-[42px] font-extrabold tracking-tight text-white sm:text-[60px]">{t.discovery}</h1>
          <p className="mt-3 text-base text-[#9da3af]">{t.featuredText}</p>
        </div>
      )}

      {/* Discovery Section with Apple Pill Dock */}
      <section ref={discoveryRef} id="discover" className="scroll-mt-24 mx-auto max-w-[1300px] px-5 pb-24 pt-20 sm:px-8 lg:px-12">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37]">{t.trending}</p>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[34px] font-extrabold tracking-[-0.035em] text-white sm:text-[46px]">{t.discovery}</h2>
            <p className="mt-2 text-[14.5px] text-[#9da3af]">{t.discoverText}</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 font-mono text-xs font-semibold text-[#e8bc91]">
            <Ticket size={14} className="text-[#8a1538]"/>
            {filtered.length} {t.results}
          </div>
        </div>

        {/* Categories Floating Pill Dock */}
        <div role="group" aria-label="Event category" className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-[#12141c]/60 p-2 backdrop-blur-xl">
          {categories.map(({ key, icon: Icon, en, ar }) => (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key)}
              aria-pressed={category === key}
              className={"sheen-effect inline-flex min-h-10 items-center gap-2 rounded-xl px-4 py-2 text-[12.5px] font-semibold transition duration-200 " + (category === key ? "bg-[#8A1538] text-white shadow-[0_4px_16px_rgba(138,21,56,0.35)]" : "text-[#9da3af] hover:bg-white/[0.05] hover:text-white")}
            >
              <Icon size={15}/>
              {lang === "ar" ? ar : en}
            </button>
          ))}
        </div>

        {/* Date Filter Bar */}
        <div className="mb-8 flex flex-wrap items-center gap-3 border-y border-white/[0.08] py-4">
          {([{key:"any",label:t.all},{key:"weekend",label:t.thisWeekend},{key:"week",label:t.nextWeek}] as const).map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setDate(option.key)}
              aria-pressed={date === option.key}
              className={"rounded-full px-4 py-2 text-xs font-semibold transition duration-200 " + (date === option.key ? "bg-white/15 text-white shadow-sm border border-white/20" : "text-[#9da3af] hover:text-white hover:bg-white/[0.04]")}
            >
              {option.label}
            </button>
          ))}
          <label className="ms-auto flex cursor-pointer items-center gap-2 text-xs font-semibold text-[#c7cbd4]">
            <input type="checkbox" checked={freeOnly} onChange={(e) => setFreeOnly(e.target.checked)} className="h-4 w-4 accent-[#8a1538] rounded"/>
            {t.free}
          </label>
        </div>

        {filtered.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event) => <EventCard key={event.id} event={event} lang={lang}/>)}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 bg-[#12131a] px-8 py-16 text-center">
            <Search size={28} className="mx-auto mb-4 text-[#8a1538]"/>
            <h3 className="text-xl font-bold text-white">{t.noResults}</h3>
            <p className="mt-2 text-sm text-[#9da3af]">{t.tryAgain}</p>
            <button onClick={clear} className="mt-5 rounded-full bg-[#8A1538] px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#6c0f2a]">{t.reset}</button>
          </div>
        )}
      </section>

      {/* Spotlight Features in Glass Bento */}
      <section className="border-t border-white/[0.08] bg-[#0c0d12] py-24">
        <div className="mx-auto max-w-[1300px] px-5 sm:px-8 lg:px-12">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37]">{t.spotlight}</p>
          <h2 className="max-w-[770px] text-[34px] font-extrabold leading-tight tracking-[-0.035em] text-white sm:text-[50px]">{t.spotlightTitle}</h2>
          <p className="mt-4 max-w-[670px] text-[15px] leading-relaxed text-[#9da3af]">{t.spotlightText}</p>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              {icon:MapPin,title:t.living,body:t.livingText},
              {icon:Compass,title:t.visiting,body:t.visitingText},
              {icon:Heart,title:t.together,body:t.togetherText},
            ].map(({icon:Icon,title,body}) => (
              <div key={title} className="spatial-glass-card rounded-[28px] p-8 text-[#f2eff4]">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8A1538] to-[#5C1026] text-white shadow-[0_4px_16px_rgba(138,21,56,0.35)]">
                  <Icon size={20}/>
                </div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-[#9da3af]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Futuristic Closing Callout */}
      <section className="relative overflow-hidden border-t border-white/[0.08] bg-gradient-to-b from-[#12131a] to-[#090a0f] px-5 py-24 text-center text-white">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[500px] rounded-full bg-[#8A1538]/20 blur-[120px]" />
        <Waves className="mx-auto mb-6 h-9 w-9 text-[#d4af37]"/>
        <h2 className="relative mx-auto max-w-[760px] text-[34px] font-extrabold tracking-[-0.035em] sm:text-[48px]">{t.closing}</h2>
        <p className="relative mx-auto mt-4 max-w-[580px] text-xs text-[#9da3af]">{t.safe}</p>
        <button type="button" onClick={goToDiscovery} className="sheen-effect relative mt-9 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8A1538] to-[#5C1026] px-8 py-3.5 text-xs font-bold text-white shadow-[0_8px_30px_rgba(138,21,56,0.35)] transition duration-300 hover:scale-105 active:scale-95">
          {t.closingButton}
          <ArrowUpRight size={16}/>
        </button>
      </section>
    </div>
  )
}
