"use client";

import { useMemo } from "react";
import Link from "next/link";
import ParticleText from "@/components/seatwise/ParticleText";
import EventUniverse, { type UniverseEvent } from "@/components/seatwise/EventUniverse";
import SiteMenu from "@/components/seatwise/SiteMenu";

export type CruzeEvent = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  startDate: string;
  endDate: string;
  city: string;
  venue: string;
  isDemo: boolean;
  ticketPrice: number | null;
  currency: string;
};

interface CruzeHomeProps {
  events: CruzeEvent[];
  compact?: boolean;
  initialDate?: string;
  initialSearch?: string;
}

const DEFAULT_EVENT_IMAGES = [
  "/events/img-1.png",
  "/events/img-5.png",
  "/events/img-9.png",
  "/events/img-2.png",
  "/events/img-6.png",
  "/events/img-3.png",
  "/events/img-7.png",
  "/events/img-4.png",
  "/events/img-8.png",
];

const DEMO_ITEMS: CruzeEvent[] = [
  {
    id: "demo-midnight-room",
    slug: "demo-katara-symphony-orchestra",
    title: "The Midnight Room",
    description: "An evocative nocturnal concert of contemporary neo-classical music under the desert stars.",
    coverImage: "/events/img-1.png",
    startDate: "2026-11-18T17:00:00.000Z",
    endDate: "2026-11-18T21:00:00.000Z",
    city: "Doha",
    venue: "Katara Amphitheatre",
    isDemo: true,
    ticketPrice: 250,
    currency: "QAR",
  },
  {
    id: "demo-after-hours",
    slug: "demo-lusail-comedy-night",
    title: "After Hours",
    description: "Intimate stand-up and live comedy showcasing Qatar's finest bilingual performers.",
    coverImage: "/events/img-5.png",
    startDate: "2026-11-22T16:30:00.000Z",
    endDate: "2026-11-22T19:30:00.000Z",
    city: "Lusail",
    venue: "Marina Promenade",
    isDemo: true,
    ticketPrice: 150,
    currency: "QAR",
  },
  {
    id: "demo-nocturne-seven",
    slug: "demo-museum-islamic-art-gala",
    title: "Nocturne No. 7",
    description: "Avant-garde physical theatre and dramatic lighting installation at MIA Park.",
    coverImage: "/events/img-9.png",
    startDate: "2026-11-28T15:30:00.000Z",
    endDate: "2026-11-28T19:30:00.000Z",
    city: "Doha",
    venue: "MIA Auditorium",
    isDemo: true,
    ticketPrice: 320,
    currency: "QAR",
  },
  {
    id: "demo-frequency",
    slug: "demo-desert-acoustic-festival",
    title: "Frequency Live",
    description: "Electronic acoustics, modular synthesizers and cinematic audiovisual immersion.",
    coverImage: "/events/img-2.png",
    startDate: "2026-12-02T16:00:00.000Z",
    endDate: "2026-12-02T21:00:00.000Z",
    city: "Al Wakrah",
    venue: "Heritage Village",
    isDemo: true,
    ticketPrice: 180,
    currency: "QAR",
  },
  {
    id: "demo-stand-alone",
    slug: "demo-doha-film-heritage-night",
    title: "Between Rooms",
    description: "An architectural exploration of Arab cinema, retrospectives and sound design.",
    coverImage: "/events/img-6.png",
    startDate: "2026-12-06T15:00:00.000Z",
    endDate: "2026-12-06T19:00:00.000Z",
    city: "Doha",
    venue: "Fire Station Cinema",
    isDemo: true,
    ticketPrice: 120,
    currency: "QAR",
  },
  {
    id: "demo-open-field",
    slug: "demo-qatar-grand-prix-fan-zone",
    title: "Open Field",
    description: "High-octane fan experience, live telemetry simulators, and outdoor concert stage.",
    coverImage: "/events/img-3.png",
    startDate: "2026-12-10T14:00:00.000Z",
    endDate: "2026-12-10T20:00:00.000Z",
    city: "Lusail",
    venue: "Lusail International Circuit",
    isDemo: true,
    ticketPrice: 450,
    currency: "QAR",
  },
];

function formatEventDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    const day = d.toLocaleDateString("en-US", { day: "2-digit", timeZone: "Asia/Qatar" });
    const month = d.toLocaleDateString("en-US", { month: "short", timeZone: "Asia/Qatar" }).toUpperCase();
    const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Qatar" }).toUpperCase();
    return `${day} ${month} / ${time}`;
  } catch {
    return "18 NOV / 08:00 PM";
  }
}

export function CruzeHome({ events }: CruzeHomeProps) {
  const displayEvents = useMemo(() => {
    if (events && events.length >= 6) return events;
    return [...(events || []), ...DEMO_ITEMS];
  }, [events]);

  const universeEvents: UniverseEvent[] = useMemo(() => {
    return displayEvents.map((e, idx) => ({
      id: e.id,
      slug: e.slug,
      title: e.title,
      coverImage: e.coverImage || DEFAULT_EVENT_IMAGES[idx % DEFAULT_EVENT_IMAGES.length],
    }));
  }, [displayEvents]);

  return (
    <main className="min-h-screen bg-[#11110f] text-[#f1efe8]">
      {/* =====================================================
          SECTION 01 — HERO
      ===================================================== */}
      <section
        id="top"
        className="relative min-h-[calc(100vh-80px)] overflow-hidden px-5 py-3 md:px-8 md:py-4"
      >
        {/* =====================================================
            HERO CONTAINER
        ===================================================== */}
        <div
          className="
            relative
            mx-auto
            mt-2
            h-[80vh]
            max-w-[1500px]
            md:mt-2
            md:h-[80vh]
          "
        >
          {/* ================= LEFT META ================= */}
          <div className="absolute left-0 top-[7%] z-30 hidden md:block">
            <p className="font-mono text-[9px] uppercase leading-[1.5] tracking-[0.18em] text-white/45">
              LIVE EVENTS
              <br />
              EXACT SEATING
              <br />
              REAL TIME
            </p>
          </div>

          {/* ================= RIGHT META ================= */}
          <div className="absolute right-0 top-[7%] z-30 text-right">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">
              Discover / Book / Be there
            </span>
          </div>

          {/* =====================================================
              MASKED HERO VIDEO / IMAGE
          ===================================================== */}
          <div
            className="
              hero-mask
              absolute
              left-1/2
              top-1/2
              z-10
              h-[58%]
              w-[92%]
              -translate-x-1/2
              -translate-y-1/2
              overflow-hidden
              md:h-[68%]
              md:w-[67%]
            "
          >
            <div
              className="
                hero-image
                absolute
                inset-[-3%]
                h-[106%]
                w-[106%]
              "
              style={{
                backgroundImage: "url('/hero-bg.png')",
              }}
            />

            {/* CINEMATIC DARK OVERLAY */}
            <div className="hero-image-vignette" />
            <div className="absolute inset-0 bg-black/25" />
          </div>

          {/* =====================================================
              CLAIM
          ===================================================== */}
          <h1
            className="
              hero-word
              pointer-events-none
              absolute
              left-[2%]
              top-[12%]
              z-20
              text-[17vw]
              font-black
              uppercase
              leading-[0.75]
              tracking-[-0.09em]
              text-[#f1efe8]
              md:left-[8%]
              md:top-[12%]
              md:text-[10vw]
            "
          >
            CLAIM
          </h1>

          {/* =====================================================
              YOUR
          ===================================================== */}
          <div
            className="
              hero-word
              pointer-events-none
              absolute
              right-[3%]
              top-[40%]
              z-30
              text-[15vw]
              font-black
              uppercase
              leading-[0.75]
              tracking-[-0.09em]
              text-[#f1efe8]
              md:right-[5%]
              md:top-[40%]
              md:text-[9vw]
            "
          >
            YOUR
          </div>

          {/* =====================================================
              PARTICLE PLACE.
          ===================================================== */}
          <div
            className="
              hero-word
              absolute
              bottom-[16%]
              left-[16%]
              z-30
              h-[145px]
              w-[76%]
              md:bottom-[-4%]
              md:left-[20%]
              md:h-[220px]
              md:w-[64%]
            "
          >
            <ParticleText
              text="PLACE."
              particleSize={1.8}
              density={4}
              color="#f1efe8"
              highlightColor="#d8763d"
              scatter={115}
              gatherDuration={850}
              stagger={160}
              pointerRepel={60}
              repelRadius={130}
              idleDrift={0.25}
              trigger="hover"
              fontSize="clamp(5rem, 10vw, 10rem)"
              fontWeight={900}
              fontFamily="Arial, Helvetica, sans-serif"
              glow={false}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>

          {/* =====================================================
              BOTTOM LEFT METADATA
          ===================================================== */}
          <div className="absolute bottom-0 left-0 z-40 hidden max-w-[220px] md:block font-mono">
            <p className="text-[11px] leading-[1.45] text-white/55">
              Find the event.
              <br />
              Choose the exact seat.
              <br />
              Make it yours.
            </p>
          </div>

          {/* =====================================================
              CTA (01 / EXPLORE FIND EVENTS)
          ===================================================== */}
          <a
            href="#event-universe"
            className="
              group
              absolute
              bottom-[2%]
              right-0
              z-40
              flex
              h-[72px]
              w-[190px]
              items-center
              justify-between
              bg-[#f1efe8]
              px-5
              text-black
              transition-all
              duration-300
              hover:bg-[#d8763d]
              md:bottom-0
              md:h-[82px]
              md:w-[230px]
              md:px-6
            "
          >
            <div>
              <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-black/45">
                01 / Explore
              </span>
              <span className="mt-1 block text-[14px] font-bold uppercase tracking-[-0.02em]">
                Find Events
              </span>
            </div>

            <span className="text-xl transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
              ↗
            </span>
          </a>

          {/* ================= SCROLL INDICATOR ================= */}
          <div className="absolute bottom-0 left-1/2 z-30 hidden -translate-x-1/2 md:block">
            <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-white/35">
              Scroll to discover ↓
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          SECTION 02 — EVENT UNIVERSE
      ===================================================== */}
      <section id="event-universe">
        <EventUniverse events={universeEvents} />
      </section>

      {/* =====================================================
          SECTION 03 — UPCOMING EVENTS (HAPPENING NEXT.)
          Light substrate (#ebe8df) with 12-column asymmetric layout
      ===================================================== */}
      <section
        id="events"
        className="relative overflow-hidden bg-[#ebe8df] px-5 py-20 text-[#11110f] md:px-8 md:py-28"
      >
        <div className="mx-auto max-w-[1600px]">
          {/* ================= HEADER ================= */}
          <div className="flex items-start justify-between border-t border-black/40 pt-3 font-mono">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em]">
              03 / Upcoming Events
            </div>

            <div className="text-right text-[9px] uppercase leading-[1.5] tracking-[0.18em] text-black/50">
              Qatar
              <br />
              All Venues · Doha & Lusail
            </div>
          </div>

          {/* =====================================================
              BIG HEADING
          ===================================================== */}
          <div className="relative mt-16 md:mt-24">
            <h2 className="text-[19vw] font-black uppercase leading-[0.72] tracking-[-0.09em] md:text-[11vw]">
              Happening
            </h2>

            <div className="mt-4 flex items-end justify-between md:mt-7">
              <p className="hidden max-w-[260px] font-mono text-[11px] leading-[1.5] text-black/55 md:block">
                Concerts, comedy, cultural galas and live sports.
                Pick the event. Then pick exactly where you sit.
              </p>

              <h2 className="ml-auto text-[19vw] font-black uppercase leading-[0.72] tracking-[-0.09em] md:text-[11vw]">
                Next<span className="text-[#d8763d]">.</span>
              </h2>
            </div>
          </div>

          {/* =====================================================
              ALTERNATING 12-COLUMN ASYMMETRIC ZIG-ZAG FEED
          ===================================================== */}
          <div className="mt-20 flex flex-col">
            {displayEvents.slice(0, 6).map((event, index) => {
              const itemNumber = String(index + 1).padStart(2, "0");
              const isEven = index % 2 === 1;
              const formattedDate = formatEventDate(event.startDate);
              const eventImage = event.coverImage || DEFAULT_EVENT_IMAGES[index % DEFAULT_EVENT_IMAGES.length];
              const eventHref = `/events/${event.slug}`;
              const displayPrice = event.ticketPrice ? `${event.ticketPrice} ${event.currency || "QAR"}` : "Free";

              if (!isEven) {
                // Layout A: Number (1 col) | Image (5 col) | Details (6 col)
                return (
                  <Link
                    key={event.id}
                    href={eventHref}
                    className="group grid border-t border-black/40 py-8 md:grid-cols-12 md:gap-8 transition-colors"
                  >
                    <div className="mb-4 md:col-span-1 md:mb-0 font-mono">
                      <span className="text-[11px] font-semibold">{itemNumber}</span>
                    </div>

                    <div className="overflow-hidden md:col-span-5">
                      <div
                        className="
                          aspect-[16/10]
                          bg-cover
                          bg-center
                          transition-transform
                          duration-700
                          ease-out
                          group-hover:scale-[1.025]
                        "
                        style={{
                          backgroundImage: `url('${eventImage}')`,
                        }}
                      />
                    </div>

                    <div className="mt-5 flex flex-col justify-between md:col-span-6 md:mt-0">
                      <div className="flex items-start justify-between font-mono">
                        <span className="text-[9px] uppercase tracking-[0.18em] text-black/50">
                          {event.city} · {event.venue}
                        </span>

                        <span className="text-xl transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                          ↗
                        </span>
                      </div>

                      <div className="mt-14 md:mt-0">
                        <h3 className="max-w-[650px] text-[10vw] font-black uppercase leading-[0.78] tracking-[-0.07em] md:text-[4.5vw]">
                          {event.title}
                        </h3>

                        <div className="mt-6 flex items-end justify-between border-t border-black/20 pt-3 font-mono">
                          <div className="text-[10px] uppercase leading-[1.5] tracking-[0.12em]">
                            {formattedDate}
                            <br />
                            {event.venue}
                          </div>

                          <div className="text-right">
                            <span className="text-[8px] uppercase tracking-[0.15em] text-black/45">
                              From
                            </span>
                            <div className="text-xl font-bold tracking-[-0.04em]">
                              {displayPrice}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              }

              // Layout B: Number (1 col) | Details (5 col) | Image (6 col)
              return (
                <Link
                  key={event.id}
                  href={eventHref}
                  className="group grid border-t border-black/40 py-8 md:grid-cols-12 md:gap-8 transition-colors"
                >
                  <div className="mb-4 md:col-span-1 md:mb-0 font-mono">
                    <span className="text-[11px] font-semibold">{itemNumber}</span>
                  </div>

                  <div className="order-2 mt-5 flex flex-col justify-between md:order-none md:col-span-5 md:mt-0">
                    <div className="font-mono">
                      <span className="text-[9px] uppercase tracking-[0.18em] text-black/50">
                        {event.city} · {event.venue}
                      </span>
                    </div>

                    <div className="mt-14 md:mt-0">
                      <h3 className="text-[10vw] font-black uppercase leading-[0.78] tracking-[-0.07em] md:text-[4.5vw]">
                        {event.title}
                      </h3>

                      <div className="mt-6 flex items-end justify-between border-t border-black/20 pt-3 font-mono">
                        <div className="text-[10px] uppercase leading-[1.5] tracking-[0.12em]">
                          {formattedDate}
                          <br />
                          {event.venue}
                        </div>

                        <div className="text-right">
                          <span className="text-[8px] uppercase tracking-[0.15em] text-black/45">
                            From
                          </span>
                          <div className="text-xl font-bold tracking-[-0.04em]">
                            {displayPrice}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="order-1 overflow-hidden md:order-none md:col-span-6">
                    <div
                      className="
                        aspect-[16/10]
                        bg-cover
                        bg-center
                        transition-transform
                        duration-700
                        ease-out
                        group-hover:scale-[1.025]
                      "
                      style={{
                        backgroundImage: `url('${eventImage}')`,
                      }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* =====================================================
              VIEW ALL FOOTER
          ===================================================== */}
          <div className="flex items-center justify-between border-t border-black/40 pt-6 mt-12 font-mono">
            <span className="text-[9px] uppercase tracking-[0.18em] text-black/45">
              Cruze / Events / Qatar 2026
            </span>

            <Link
              href="/events"
              className="group flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.05em] hover:text-[#d8763d] transition-colors"
            >
              View all events
              <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                ↗
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
export default CruzeHome;
