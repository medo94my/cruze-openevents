"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type BrowserEvent = {
  id: string;
  slug: string;
  number: string;
  title: string;
  category: string;
  venue: string;
  location: string;
  date: string;
  price: number | null;
  currency: string;
  image: string;
};

const CATEGORIES = ["All", "Music", "Comedy", "Theatre", "Sports", "Culture"];

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

const DEMO_EVENTS: BrowserEvent[] = [
  {
    id: "demo-1",
    slug: "demo-katara-symphony-orchestra",
    number: "01",
    title: "The Midnight Room",
    category: "Music",
    venue: "Katara Amphitheatre",
    location: "Doha",
    date: "18 NOV / 08:00 PM",
    price: 250,
    currency: "QAR",
    image: "/events/img-1.png",
  },
  {
    id: "demo-2",
    slug: "demo-lusail-comedy-night",
    number: "02",
    title: "After Hours Comedy",
    category: "Comedy",
    venue: "Marina Promenade",
    location: "Lusail",
    date: "22 NOV / 07:30 PM",
    price: 150,
    currency: "QAR",
    image: "/events/img-5.png",
  },
  {
    id: "demo-3",
    slug: "demo-museum-islamic-art-gala",
    number: "03",
    title: "Nocturne No. 7",
    category: "Theatre",
    venue: "MIA Auditorium",
    location: "Doha",
    date: "28 NOV / 06:30 PM",
    price: 320,
    currency: "QAR",
    image: "/events/img-9.png",
  },
  {
    id: "demo-4",
    slug: "demo-desert-acoustic-festival",
    number: "04",
    title: "Frequency Live",
    category: "Music",
    venue: "Heritage Village",
    location: "Al Wakrah",
    date: "02 DEC / 07:00 PM",
    price: 180,
    currency: "QAR",
    image: "/events/img-2.png",
  },
  {
    id: "demo-5",
    slug: "demo-doha-film-heritage-night",
    number: "05",
    title: "Between Rooms",
    category: "Culture",
    venue: "Fire Station Cinema",
    location: "Doha",
    date: "06 DEC / 06:00 PM",
    price: 120,
    currency: "QAR",
    image: "/events/img-6.png",
  },
  {
    id: "demo-6",
    slug: "demo-qatar-grand-prix-fan-zone",
    number: "06",
    title: "Open Field Racing",
    category: "Sports",
    venue: "Lusail Circuit",
    location: "Lusail",
    date: "10 DEC / 05:00 PM",
    price: 450,
    currency: "QAR",
    image: "/events/img-3.png",
  },
];

export default function EventsBrowser({
  events,
  initialSearch = "",
}: {
  events: BrowserEvent[];
  initialSearch?: string;
}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [location, setLocation] = useState("All Qatar");
  const [search, setSearch] = useState(initialSearch);

  const displayEvents = useMemo(() => {
    if (events && events.length >= 6) return events;
    return [...(events || []), ...DEMO_EVENTS];
  }, [events]);

  const locations = useMemo(() => {
    const set = new Set(displayEvents.map((e) => e.location));
    return ["All Qatar", ...Array.from(set)];
  }, [displayEvents]);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return displayEvents.filter((event) => {
      const matchesCategory =
        activeCategory === "All" ||
        event.category.toLowerCase() === activeCategory.toLowerCase();

      const matchesLocation =
        location === "All Qatar" ||
        event.location.toLowerCase() === location.toLowerCase();

      const matchesSearch =
        query === "" ||
        event.title.toLowerCase().includes(query) ||
        event.venue.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query);

      return matchesCategory && matchesLocation && matchesSearch;
    });
  }, [displayEvents, activeCategory, location, search]);

  return (
    <main className="events-page">
      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="events-page__hero">
        <div className="events-page__eyebrow font-mono">03 / WHAT&apos;S HAPPENING</div>

        <h1 className="events-page__title">
          EVENTS<span>.</span>
        </h1>

        <div className="events-page__hero-bottom font-mono">
          <p>
            LIVE EXPERIENCES
            <br />
            ACROSS QATAR
          </p>

          <p>
            MUSIC / COMEDY / THEATRE
            <br />
            SPORTS / CULTURE
          </p>

          <p>{String(filteredEvents.length).padStart(2, "0")} EXPERIENCES</p>
        </div>
      </section>

      {/* =====================================================
          CATEGORIES FILTER
      ===================================================== */}
      <section className="events-page__filter font-mono">
        <span className="events-page__filter-label">FILTER</span>

        <div className="events-page__categories">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              className={`events-page__category ${
                activeCategory === category
                  ? "events-page__category--active"
                  : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* =====================================================
          DISCOVERY CONTROLS
      ===================================================== */}
      <section className="events-page__discovery font-mono">
        <div className="events-page__control">
          <label
            className="events-page__control-label"
            htmlFor="event-location"
          >
            LOCATION
          </label>

          <div className="events-page__select-wrap">
            <select
              id="event-location"
              className="events-page__select"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              {locations.map((item) => (
                <option key={item} value={item}>
                  {item.toUpperCase()}
                </option>
              ))}
            </select>

            <span className="events-page__select-mark" aria-hidden="true">
              ↓
            </span>
          </div>
        </div>

        <div className="events-page__control events-page__control--search">
          <label className="events-page__control-label" htmlFor="event-search">
            SEARCH
          </label>

          <input
            id="event-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="events-page__search"
            placeholder="EVENT / VENUE / CITY"
            autoComplete="off"
          />
        </div>

        <div className="events-page__result">
          <span className="events-page__control-label">SHOWING</span>
          <strong>{String(filteredEvents.length).padStart(2, "0")}</strong>
          <span>EXPERIENCES</span>
        </div>
      </section>

      {/* =====================================================
          STAGGERED EDITORIAL GRID
      ===================================================== */}
      <section className="events-page__grid">
        {filteredEvents.length === 0 && (
          <div className="events-page__empty font-mono">
            <span className="events-page__empty-index">00 / RESULTS</span>

            <h2 className="events-page__empty-title">
              NO EVENTS<span>.</span>
            </h2>

            <div className="events-page__empty-bottom">
              <p>
                NOTHING MATCHES THIS
                <br />
                COMBINATION.
              </p>

              <button
                type="button"
                onClick={() => {
                  setActiveCategory("All");
                  setLocation("All Qatar");
                  setSearch("");
                }}
              >
                RESET FILTERS
                <span>↗</span>
              </button>
            </div>
          </div>
        )}

        {filteredEvents.map((event, idx) => {
          const fallbackImg = DEFAULT_EVENT_IMAGES[idx % DEFAULT_EVENT_IMAGES.length];
          const displayPrice = event.price ? `${event.price} ${event.currency}` : "FREE";

          return (
            <Link
              href={`/events/${event.slug}`}
              className="events-card"
              key={event.id}
            >
              <div className="events-card__image-wrap">
                <img
                  src={event.image || fallbackImg}
                  alt={event.title}
                  className="events-card__image"
                />

                <span className="events-card__number font-mono">{event.number}</span>

                <span className="events-card__category font-mono">{event.category}</span>

                <span className="events-card__square" aria-hidden="true" />
              </div>

              <div className="events-card__information">
                <div>
                  <h2>{event.title}</h2>
                  <p className="font-mono">{event.venue}</p>
                </div>

                <div className="events-card__details font-mono">
                  <span>{event.date}</span>
                  <span>{event.location}</span>
                  <span className="text-[#d8763d] font-bold">{displayPrice}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="events-page__footer font-mono">
        <span>CRUZE®</span>
        <span>DISCOVER / BOOK / BE THERE</span>
        <span>QATAR · © 2026</span>
      </footer>
    </main>
  );
}
