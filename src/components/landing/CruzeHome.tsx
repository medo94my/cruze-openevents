"use client"

import { useMemo, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowRight, ArrowUpRight, CalendarDays, Compass, Heart,
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
      className={"group relative block overflow-hidden rounded-[25px] bg-[#1e1820] text-white shadow-[0_12px_34px_rgba(62,27,34,0.09)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(62,27,34,0.17)] " + (large ? "min-h-[360px] sm:min-h-[440px]" : "min-h-[210px] sm:min-h-[216px]")}
    >
      {event.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={event.coverImage} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#150b17]/95 via-[#210e19]/35 to-transparent" />
      <div className="absolute start-5 top-5 flex flex-wrap gap-2">
        <span className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#491229] backdrop-blur-sm">{category?.[lang]}</span>
        {event.isDemo && <span className="rounded-full border border-white/40 bg-[#310c20]/60 px-3 py-1.5 text-[10px] font-bold tracking-wider text-white backdrop-blur-sm">{copy[lang].concept}</span>}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
        <p className="mb-2 text-xs font-semibold tracking-wide text-[#f8dcb4]">{eventDate(event.startDate, lang)} · {event.city}</p>
        <h3 className={"max-w-xl font-bold tracking-[-0.03em] " + (large ? "text-3xl leading-tight sm:text-[38px]" : "text-[21px] leading-snug")}>{cleanTitle(event.title)}</h3>
        {large && <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#fff4e3]">{copy[lang].view}<ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" /></div>}
      </div>
    </Link>
  )
}

function EventCard({ event, lang }: { event: CruzeEvent; lang: Language }) {
  const category = categories.find((c) => c.key === categoryFor(event))
  return (
    <Link href={"/events/" + encodeURIComponent(event.slug)} className="group block overflow-hidden rounded-[22px] border border-[#e9e0d7] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#d3beb3] hover:shadow-[0_20px_45px_rgba(79,31,46,0.12)]">
      <div className="relative aspect-[1.45] overflow-hidden bg-[#e6dbce]">
        {event.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.coverImage} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        ) : <div className="h-full w-full bg-gradient-to-tr from-[#721635] to-[#d5a876]" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute start-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-[#55132d]">{category?.[lang]}</div>
        {event.isDemo && <div className="absolute bottom-4 start-4 rounded-full border border-white/50 bg-[#51142f]/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">{copy[lang].concept}</div>}
        <span className="absolute bottom-4 end-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#651b3c] shadow-sm transition group-hover:rotate-45"><ArrowUpRight size={18}/></span>
      </div>
      <div className="px-5 pb-6 pt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#9b4158]">{eventWeekday(event.startDate, lang)}, {eventDate(event.startDate, lang)} · {event.city}</p>
        <h3 className="min-h-[60px] text-[21px] font-bold leading-[1.35] tracking-tight text-[#291d23]">{cleanTitle(event.title)}</h3>
        <div className="mt-3 flex items-center gap-1.5 text-[13px] text-[#76656b]"><MapPin size={14} className="shrink-0"/><span className="truncate">{event.venue}</span></div>
        <div className="mt-5 flex items-center justify-between border-t border-[#f0e7de] pt-4">
          <span className="text-xs font-medium text-[#98838a]">{event.ticketPrice === 0 ? copy[lang].freeLabel : copy[lang].from}</span>
          <span className="text-[18px] font-extrabold text-[#641532]">{price(event, lang)}</span>
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
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-[#fbf8f3] text-[#271d20]">
      <div className="bg-[#641633] px-4 py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.15em] text-[#fff0dc] sm:text-xs">
        {t.preview}
      </div>
      <div className="mx-auto flex max-w-[1300px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <div className="flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-[#7d2545]"><MapPin size={15}/>{t.place}</div>
        <div className="flex items-center gap-2 rounded-full border border-[#e8dcd5] bg-white p-1 text-[12px] font-bold">
          <button type="button" onClick={() => setLang("en")} aria-pressed={lang === "en"} className={"rounded-full px-3 py-1.5 transition " + (lang === "en" ? "bg-[#641633] text-white" : "text-[#786a6b] hover:bg-[#f8eee9]")}>EN</button>
          <button type="button" onClick={() => setLang("ar")} aria-pressed={lang === "ar"} className={"rounded-full px-3 py-1.5 transition " + (lang === "ar" ? "bg-[#641633] text-white" : "text-[#786a6b] hover:bg-[#f8eee9]")}>عربي</button>
        </div>
      </div>

      {!compact && (
        <>
      <section className="relative mx-3 min-h-[570px] overflow-hidden rounded-[28px] bg-[#2b0e23] text-white sm:mx-6 sm:min-h-[640px] sm:rounded-[34px] lg:mx-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroImage} alt="Illustrative Qatar-inspired event atmosphere" className="absolute inset-0 h-full w-full object-cover object-center" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#250c20]/95 via-[#42142e]/75 to-[#180e18]/25 rtl:bg-gradient-to-l" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#280e20]/80 via-transparent to-[#280e20]/10" />
        <div className="relative mx-auto flex min-h-[570px] max-w-[1260px] flex-col justify-center px-6 pb-24 pt-12 sm:min-h-[640px] sm:px-12 lg:px-16">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-9 bg-[#e3bf9b]"/>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f3d3af] sm:text-xs">{t.eyebrow}</p>
          </div>
          <h1 className="max-w-4xl text-[53px] font-extrabold leading-[1.05] tracking-[-0.055em] sm:text-[76px] lg:text-[96px]">
            {t.headOne}<br/><span className="font-serif italic font-normal tracking-[-0.045em] text-[#f1d2ab]">{t.headTwo}</span>
          </h1>
          <p className="mt-7 max-w-[520px] text-[16px] leading-relaxed text-white/85 sm:text-[18px]">{t.heroDescription}</p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button type="button" onClick={goToDiscovery} className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#f5d4aa] px-7 py-3 font-bold text-[#50162f] transition hover:bg-white">{t.explore}<ArrowRight size={18} className={lang === "ar" ? "rotate-180" : ""}/></button>
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-white/75"><Sparkles size={15}/>{t.city}</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-3 border-t border-white/20 bg-white/10 px-6 py-4 text-[11px] font-bold uppercase tracking-[0.13em] text-white/80 backdrop-blur-md sm:px-12 lg:px-16">
          <span>{t.local}</span><span>25° 17' N &nbsp; 51° 32' E</span>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-8 max-w-[960px] px-6 sm:-mt-9">
        <form onSubmit={(e) => { e.preventDefault(); goToDiscovery() }} className="flex flex-wrap items-center gap-3 rounded-[24px] border border-[#e9ded2] bg-white p-3 shadow-[0_16px_46px_rgba(51,25,31,0.14)] sm:flex-nowrap sm:p-4">
          <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
            <Search size={20} className="shrink-0 text-[#7c4c5e]"/>
            <input aria-label={t.search} value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.search} className="min-w-0 w-full border-0 bg-transparent py-3 text-[15px] text-[#291f22] outline-none placeholder:text-[#a6999a]"/>
            {search && <button type="button" aria-label="Clear search" onClick={() => setSearch("")}><X size={17} className="text-[#7c4c5e]"/></button>}
          </div>
          <div className="hidden h-10 w-px bg-[#eadfdb] sm:block"/>
          <div className="hidden items-center gap-2 px-3 text-sm font-semibold text-[#65445a] sm:flex"><MapPin size={16}/>Doha, Qatar</div>
          <button type="submit" className="w-full rounded-[15px] bg-[#681638] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#812348] sm:w-auto">{t.find}</button>
        </form>
      </div>

      <section className="mx-auto max-w-[1300px] px-5 pb-6 pt-24 sm:px-8 lg:px-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.17em] text-[#9b4f62]">{t.curated}</p>
            <h2 className="max-w-[650px] text-[34px] font-extrabold leading-[1.12] tracking-[-0.045em] sm:text-[48px]">{t.featured}</h2>
            <p className="mt-4 max-w-[560px] text-[15px] leading-7 text-[#76656a]">{t.featuredText}</p>
          </div>
          <button onClick={goToDiscovery} className="inline-flex items-center gap-2 rounded-full border border-[#bdaab0] px-5 py-3 text-sm font-bold text-[#641633] transition hover:bg-[#f1e3dc]">{t.discoverMore}<ArrowUpRight size={16}/></button>
        </div>
        {events.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <EventTile event={events[0]} lang={lang} large/>
            <div className="grid grid-rows-2 gap-4">
              {events.slice(1,3).map((event) => <EventTile key={event.id} event={event} lang={lang}/>)}
            </div>
          </div>
        ) : <div className="rounded-3xl border border-dashed border-[#dccccc] p-12 text-center text-[#765b63]">{t.noResults}</div>}
      </section>

        </>
      )}
      {compact && <div className="mx-auto max-w-[1300px] px-5 pt-14 sm:px-8 lg:px-12"><p className="mb-3 text-xs font-bold tracking-[0.17em] text-[#a0576b]">{t.place}</p><h1 className="text-[44px] font-extrabold tracking-tight text-[#341d29] sm:text-[62px]">{t.discovery}</h1><p className="mt-3 text-base text-[#7b6470]">{t.featuredText}</p></div>}
      <section ref={discoveryRef} id="discover" className="scroll-mt-24 mx-auto max-w-[1300px] px-5 pb-20 pt-20 sm:px-8 lg:px-12">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.17em] text-[#9b4f62]">{t.trending}</p>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div><h2 className="text-[36px] font-extrabold tracking-[-0.04em] sm:text-[48px]">{t.discovery}</h2><p className="mt-2 text-[15px] text-[#786970]">{t.discoverText}</p></div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#83626c]"><Ticket size={16}/>{filtered.length} {t.results}</div>
        </div>
        <div role="group" aria-label="Event category" className="mb-6 flex flex-wrap gap-2.5">
          {categories.map(({ key, icon: Icon, en, ar }) => (
            <button key={key} type="button" onClick={() => setCategory(key)} aria-pressed={category===key} className={"inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-semibold transition " + (category===key ? "border-[#641633] bg-[#641633] text-white" : "border-[#e4d9d2] bg-white text-[#6b5860] hover:border-[#b77a90] hover:text-[#641633]")}>
              <Icon size={16}/>{lang==="ar"?ar:en}
            </button>
          ))}
        </div>
        <div className="mb-7 flex flex-wrap items-center gap-3 border-y border-[#e9dfd6] py-5">
          {([{key:"any",label:t.all},{key:"weekend",label:t.thisWeekend},{key:"week",label:t.nextWeek}] as const).map((option) => (
            <button key={option.key} type="button" onClick={() => setDate(option.key)} aria-pressed={date===option.key} className={"rounded-full px-4 py-2.5 text-sm font-semibold transition " + (date===option.key ? "bg-[#ead3dc] text-[#641633]" : "text-[#76656a] hover:bg-white")}>{option.label}</button>
          ))}
          <label className="ms-auto flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#6b5560]"><input type="checkbox" checked={freeOnly} onChange={(e)=>setFreeOnly(e.target.checked)} className="h-4 w-4 accent-[#641633]"/>{t.free}</label>
        </div>
        {filtered.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event) => <EventCard key={event.id} event={event} lang={lang}/>)}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#d8c6c3] bg-white px-8 py-16 text-center"><Search size={28} className="mx-auto mb-4 text-[#996a76]"/><h3 className="text-xl font-bold">{t.noResults}</h3><p className="mt-2 text-sm text-[#847177]">{t.tryAgain}</p><button onClick={clear} className="mt-5 rounded-full bg-[#641633] px-5 py-2.5 text-sm font-bold text-white">{t.reset}</button></div>
        )}
      </section>

      <section className="bg-[#f1e8dd] py-20">
        <div className="mx-auto max-w-[1300px] px-5 sm:px-8 lg:px-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.17em] text-[#a05d67]">{t.spotlight}</p>
          <h2 className="max-w-[770px] text-[36px] font-extrabold leading-tight tracking-[-0.04em] sm:text-[53px]">{t.spotlightTitle}</h2>
          <p className="mt-5 max-w-[670px] text-[16px] leading-8 text-[#715b62]">{t.spotlightText}</p>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              {icon:MapPin,title:t.living,body:t.livingText},
              {icon:Compass,title:t.visiting,body:t.visitingText},
              {icon:Heart,title:t.together,body:t.togetherText},
            ].map(({icon:Icon,title,body})=><div key={title} className="rounded-[24px] border border-white/80 bg-[#faf6f0] px-7 py-8"><div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#671637] text-white"><Icon size={22}/></div><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 text-[14px] leading-7 text-[#765e65]">{body}</p></div>)}
          </div>
        </div>
      </section>
      <section className="bg-[#641633] px-5 py-20 text-center text-white">
        <Waves className="mx-auto mb-6 h-10 w-10 text-[#e8bc91]"/>
        <h2 className="mx-auto max-w-[760px] text-[34px] font-bold tracking-[-0.04em] sm:text-[50px]">{t.closing}</h2>
        <p className="mx-auto mt-5 max-w-[580px] text-sm text-[#f5d8db]">{t.safe}</p>
        <button type="button" onClick={goToDiscovery} className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#f3d1ac] px-7 py-3.5 font-bold text-[#641633] transition hover:bg-white">{t.closingButton}<ArrowUpRight size={18}/></button>
      </section>
    </div>
  )
}
