"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import "./EventUniverse.css";

export type UniverseEvent = {
  id: string;
  slug: string;
  title: string;
  coverImage?: string | null;
};

const DEFAULT_UNIVERSE_EVENTS = [
  {
    id: "01",
    slug: "demo-katara-symphony-orchestra",
    coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
    title: "After Dark",
  },
  {
    id: "02",
    slug: "demo-lusail-comedy-night",
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
    title: "The Last Light",
  },
  {
    id: "03",
    slug: "demo-museum-islamic-art-gala",
    coverImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop",
    title: "Frequency",
  },
  {
    id: "04",
    slug: "demo-desert-acoustic-festival",
    coverImage: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop",
    title: "Stand Alone",
  },
  {
    id: "05",
    slug: "demo-doha-film-heritage-night",
    coverImage: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1200&auto=format&fit=crop",
    title: "Between Rooms",
  },
  {
    id: "06",
    slug: "demo-qatar-grand-prix-fan-zone",
    coverImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop",
    title: "Open Field",
  },
  {
    id: "07",
    slug: "demo-katara-symphony-orchestra",
    coverImage: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format&fit=crop",
    title: "Movement",
  },
  {
    id: "08",
    slug: "demo-lusail-comedy-night",
    coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
    title: "Ninety Minutes",
  },
  {
    id: "09",
    slug: "demo-museum-islamic-art-gala",
    coverImage: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=1200&auto=format&fit=crop",
    title: "The Room",
  },
];

export default function EventUniverse({ events: customEvents }: { events?: UniverseEvent[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  const displayEvents = customEvents && customEvents.length >= 6
    ? customEvents.slice(0, 9).map((e, idx) => ({
        id: String(idx + 1).padStart(2, "0"),
        slug: e.slug,
        coverImage: e.coverImage || DEFAULT_UNIVERSE_EVENTS[idx % DEFAULT_UNIVERSE_EVENTS.length].coverImage,
        title: e.title,
      }))
    : DEFAULT_UNIVERSE_EVENTS;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = cardsRef.current.filter((card): card is HTMLAnchorElement => card !== null);
    if (!cards.length) return;

    let rotation = -0.4;
    let velocity = 0.0016;
    let targetVelocity = 0.0016;
    let verticalTilt = 0;
    let targetVerticalTilt = 0;
    let intro = 0;

    let lastTime = performance.now();
    let lastPointerMove = performance.now();
    let pointerX = 0;
    let pointerY = 0;
    let dragging = false;
    let previousX = 0;
    let previousY = 0;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      intro = 1;
    }

    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
    const lerp = (a: number, b: number, amount: number) => a + (b - a) * amount;
    const easeOutExpo = (x: number) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x));

    const handlePointerMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const normalizedX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const normalizedY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

      pointerX = clamp(normalizedX, -1, 1);
      pointerY = clamp(normalizedY, -1, 1);
      lastPointerMove = performance.now();

      targetVelocity = pointerX * 0.0075;
      targetVerticalTilt = pointerY * 0.32;

      if (dragging) {
        const deltaX = event.clientX - previousX;
        const deltaY = event.clientY - previousY;
        rotation += deltaX * 0.009;
        velocity += deltaX * 0.00012;
        targetVerticalTilt += deltaY * 0.0018;
        previousX = event.clientX;
        previousY = event.clientY;
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if ((event.target as HTMLElement)?.closest(".event-universe__card")) {
        return;
      }
      dragging = true;
      previousX = event.clientX;
      previousY = event.clientY;
      section.setPointerCapture(event.pointerId);
    };

    const stopDragging = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      try {
        section.releasePointerCapture(event.pointerId);
      } catch {}
    };

    const handleLeave = () => {
      pointerX = 0;
      pointerY = 0;
      targetVelocity = 0.0016;
      targetVerticalTilt = 0;
    };

    section.addEventListener("pointermove", handlePointerMove);
    section.addEventListener("pointerdown", handlePointerDown);
    section.addEventListener("pointerup", stopDragging);
    section.addEventListener("pointercancel", stopDragging);
    section.addEventListener("pointerleave", handleLeave);

    const animate = (currentTime: number) => {
      const delta = clamp((currentTime - lastTime) / 1000, 0, 0.05);
      lastTime = currentTime;

      if (currentTime - lastPointerMove > 1400) {
        targetVelocity = 0.0016;
        targetVerticalTilt = 0;
      }

      if (!reducedMotion && intro < 1) {
        intro = clamp(intro + delta * 0.55, 0, 1);
      }

      const introEase = easeOutExpo(intro);

      velocity = lerp(velocity, targetVelocity, clamp(delta * 4, 0, 1));
      rotation += velocity * (delta * 60);

      verticalTilt = lerp(verticalTilt, targetVerticalTilt, clamp(delta * 3.2, 0, 1));

      const rect = section.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height * 0.59;

      const isMobile = window.innerWidth <= 600;
      const radiusX = rect.width * (isMobile ? 0.44 : 0.41);
      const radiusY = rect.height * (isMobile ? 0.07 : 0.065);
      const verticalSpan = rect.height * (isMobile ? 0.05 : 0.045);

      const count = cards.length;
      const step = (Math.PI * 2) / count;

      cards.forEach((card, index) => {
        const angle = rotation + index * step;
        const normalizedAngle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

        const x = centerX + Math.cos(normalizedAngle) * radiusX;
        const z = Math.sin(normalizedAngle);
        const depth01 = (z + 1) / 2;

        const dynamicTilt = verticalTilt * Math.cos(normalizedAngle);
        const y = centerY + z * radiusY + dynamicTilt * verticalSpan;

        const baseScale = isMobile ? 0.55 : 0.62;
        const scaleRange = isMobile ? 0.55 : 0.52;
        const scale = (baseScale + depth01 * scaleRange) * lerp(0.85, 1, introEase);
        const zDepth = lerp(-220, 200, depth01);

        const opacity = lerp(0.14, 1, depth01) * lerp(0.18, 1, introEase);
        const brightness = lerp(0.22, 1, depth01);
        const blur = lerp(2.2, 0, depth01);
        const zIndex = Math.round(depth01 * 120) + 10;

        card.style.transform = `
          translate3d(${x}px, ${y}px, ${zDepth * 100}px)
          translate(-50%, -50%)
          scale(${scale})
        `;
        card.style.opacity = `${opacity}`;
        card.style.zIndex = `${zIndex}`;
        card.style.filter = `brightness(${brightness}) blur(${blur}px)`;

        const shadowStrength = 0.06 + depth01 * 0.34;
        const shadowY = 14 + depth01 * 30;
        const shadowBlur = 35 + depth01 * 65;
        card.style.boxShadow = `0 ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowStrength})`;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      section.removeEventListener("pointermove", handlePointerMove);
      section.removeEventListener("pointerdown", handlePointerDown);
      section.removeEventListener("pointerup", stopDragging);
      section.removeEventListener("pointercancel", stopDragging);
      section.removeEventListener("pointerleave", handleLeave);
    };
  }, [displayEvents]);

  return (
    <section ref={sectionRef} className="event-universe" id="event-universe">
      <div className="event-universe__glow" />
      <div className="event-universe__grain" />

      {/* TOP META */}
      <div className="event-universe__meta event-universe__meta--left">
        <span>02 / DISCOVER</span>
        <span>CRUZE ARCHIVE</span>
      </div>

      <div className="event-universe__meta event-universe__meta--center">
        LIVE EXPERIENCES / QATAR
      </div>

      <div className="event-universe__meta event-universe__meta--right">
        {String(displayEvents.length).padStart(2, "0")} EVENTS
      </div>

      {/* TITLE */}
      <div className="event-universe__heading">
        <span className="event-universe__eyebrow">ENTER THE</span>
        <h2>
          EVENT
          <br />
          UNIVERSE
          <span className="event-universe__title-dot">.</span>
        </h2>
      </div>

      {/* CENTRAL AXIS */}
      <div className="event-universe__axis">
        <span />
        <p>MUSIC · COMEDY · THEATRE · SPORTS · CULTURE · LIVE</p>
        <span />
      </div>

      {/* EVENT WORLD */}
      <div className="event-universe__world">
        {displayEvents.map((event, index) => (
          <Link
            key={event.id}
            ref={(element) => {
              cardsRef.current[index] = element;
            }}
            href={`/events/${event.slug}`}
            className="event-universe__card"
            aria-label={`Open ${event.title}`}
            draggable={false}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={event.coverImage} alt={event.title} draggable={false} />
            <div className="event-universe__card-shade" />
            <span className="event-universe__number">{event.id}</span>
            <div className="event-universe__card-info">
              <span className="event-universe__card-title">{event.title}</span>
              <span className="event-universe__card-arrow" aria-hidden="true">
                <i />
              </span>
            </div>
            <span className="event-universe__card-action">OPEN EVENT ↗</span>
          </Link>
        ))}
      </div>

      {/* BOTTOM LEFT */}
      <div className="event-universe__bottom-left">
        <span>MOVE TO EXPLORE</span>
        <span>{String(displayEvents.length).padStart(2, "0")} EXPERIENCES</span>
      </div>

      {/* MOVEMENT INDICATOR */}
      <div className="event-universe__movement">
        <div className="event-universe__movement-dot" />
        <span>MOVE THROUGH THE UNIVERSE</span>
      </div>

      {/* VIEW ALL */}
      <Link href="/events" className="event-universe__view-all">
        <span>VIEW ALL EVENTS</span>
        <span className="event-universe__view-arrow" aria-hidden="true">
          <i />
        </span>
      </Link>
    </section>
  );
}
