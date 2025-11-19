"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";

const easeSoft: [number, number, number, number] = [0.25, 0.8, 0.4, 1];

type RawEvent = {
  id: string;
  eventStart: string; // timestamptz / ISO string
  eventEnd: string; // timestamptz / ISO string
  category: string;
  title: string;
  blurb: string;
  location: string;
  image: string;
  layout: "tall" | "wide" | "standard";
};

/** ─────────────────────────────
 *  1. YOUR DATA HERE
 *  Just keep adding events to this array.
 *  Everything else is derived dynamically.
 *  ───────────────────────────── */
const rawEvents: RawEvent[] = [
  {
    id: "late-lobby-2026",
    eventStart: "2026-05-18T20:00:00+07:00",
    eventEnd: "2026-05-18T23:00:00+07:00",
    category: "Stays",
    title: "Late check-in, softer lobby.",
    blurb:
      "Arrivals after midnight get the quietest version of the hotel—candles, glassware, and low piano.",
    location: "Lobby · After Dark",
    image: "/gallery/lobby-evening.jpg",
    layout: "tall",
  },
  {
    id: "fog-bay-2026",
    eventStart: "2026-02-22T17:00:00+07:00",
    eventEnd: "2026-02-22T19:00:00+07:00",
    category: "Neighborhood",
    title: "When the bay fog climbs the hill.",
    blurb:
      "A guided walk that starts at the shoreline and ends with tea on the hillside terrace.",
    location: "Bayfront · Hillside Walk",
    image: "/gallery/room-cityview.jpg",
    layout: "wide",
  },
  {
    id: "design-rooms-2025",
    eventStart: "2025-01-12T16:00:00+07:00",
    eventEnd: "2025-01-12T18:00:00+07:00",
    category: "Design",
    title: "Designing rooms that hide the tech.",
    blurb:
      "Screens, switches, and charging considered as shadows instead of focal points.",
    location: "Suite 14 · Design Tour",
    image: "/gallery/detail-texture.jpg",
    layout: "standard",
  },
  {
    id: "pool-never-still-2025",
    eventStart: "2025-10-03T18:00:00+07:00", // ← October example
    eventEnd: "2025-10-03T20:00:00+07:00",
    category: "Design",
    title: "Why the pool is never quite still.",
    blurb:
      "Tiny edge overflows that erase footsteps and keep the surface reading like glass.",
    location: "Pool · Dusk",
    image: "/gallery/pool-dusk.jpg",
    layout: "tall",
  },
  {
    id: "walking-home-2024",
    eventStart: "2024-12-09T20:00:00+07:00",
    eventEnd: "2024-12-09T22:00:00+07:00",
    category: "Neighborhood",
    title: "Walking home along the upper slope.",
    blurb:
      "The quiet route back from the bay after lights-out, mapped with our concierge.",
    location: "Upper Street · Night Walk",
    image: "/gallery/rooftop-night.jpg",
    layout: "standard",
  },
  {
    id: "fresh-linen-2024",
    eventStart: "2024-04-15T15:00:00+07:00",
    eventEnd: "2024-04-15T16:00:00+07:00",
    category: "Stays",
    title: "The sound of fresh linen.",
    blurb:
      "Why we changed the carts before we changed the sheets—quiet wheels first.",
    location: "Laundry Wing · Behind the Scenes",
    image: "/gallery/bar-detail.jpg",
    layout: "wide",
  },
];

const MONTH_SHORT = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];
const MONTH_FULL = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEKDAY = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function formatDayLabel(d: Date): string {
  const month = MONTH_SHORT[d.getMonth()];
  const day = d.getDate();
  const weekday = WEEKDAY[d.getDay()];
  return `${month} ${day} · ${weekday}`;
}

function formatTimeRange(start: Date, end: Date): string {
  const format = (dt: Date) => {
    let h = dt.getHours();
    const m = dt.getMinutes();
    const am = h < 12;
    if (h === 0) h = 12;
    else if (h > 12) h -= 12;
    const minStr = m === 0 ? "" : `:${String(m).padStart(2, "0")}`;
    return `${h}${minStr} ${am ? "AM" : "PM"}`;
  };
  return `${format(start)} – ${format(end)}`;
}

type EnrichedEvent = RawEvent & {
  startDate: Date;
  endDate: Date;
  year: number;
  monthIndex: number;
  monthShort: string;
  monthLabel: string;
  dayLabel: string;
  timeLabel: string;
};

type MonthSection = {
  monthIndex: number;
  monthShort: string;
  monthLabel: string;
  events: EnrichedEvent[];
};

type YearBuckets = Map<number, MonthSection[]>;

/** turn raw data into enriched + grouped by year→month */
function useTimelineData(): {
  years: number[];
  buckets: YearBuckets;
} {
  return useMemo(() => {
    const enriched: EnrichedEvent[] = rawEvents.map((ev) => {
      const startDate = new Date(ev.eventStart);
      const endDate = new Date(ev.eventEnd);
      const year = startDate.getFullYear();
      const monthIndex = startDate.getMonth();

      return {
        ...ev,
        startDate,
        endDate,
        year,
        monthIndex,
        monthShort: MONTH_SHORT[monthIndex],
        monthLabel: MONTH_FULL[monthIndex],
        dayLabel: formatDayLabel(startDate),
        timeLabel: formatTimeRange(startDate, endDate),
      };
    });

    // sort chronologically (earliest first)
    enriched.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    // group: year -> monthIndex -> events[]
    const buckets: YearBuckets = new Map();

    for (const ev of enriched) {
      if (!buckets.has(ev.year)) buckets.set(ev.year, []);
      const months = buckets.get(ev.year)!;

      let month = months.find((m) => m.monthIndex === ev.monthIndex);
      if (!month) {
        month = {
          monthIndex: ev.monthIndex,
          monthShort: ev.monthShort,
          monthLabel: ev.monthLabel,
          events: [],
        };
        months.push(month);
      }
      month.events.push(ev);
    }

    // sort years desc, months asc within each year
    const years = Array.from(buckets.keys()).sort((a, b) => b - a);
    years.forEach((year) => {
      const months = buckets.get(year)!;
      months.sort((a, b) => a.monthIndex - b.monthIndex);
    });

    return { years, buckets };
  }, []);
}

/* ───────── shared variants ───────── */

const sectionText: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.08, ease: easeSoft },
  }),
};

/* ───────── fancy card with tilt / parallax / glow ───────── */

function SeasonalEventCard({
  event,
  index,
}: {
  event: EnrichedEvent;
  index: number;
}) {
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const imgX = useMotionValue(0);
  const imgY = useMotionValue(0);

  const springTiltX = useSpring(tiltX, {
    stiffness: 140,
    damping: 18,
    mass: 0.4,
  });
  const springTiltY = useSpring(tiltY, {
    stiffness: 140,
    damping: 18,
    mass: 0.4,
  });
  const springImgX = useSpring(imgX, {
    stiffness: 120,
    damping: 20,
    mass: 0.5,
  });
  const springImgY = useSpring(imgY, {
    stiffness: 120,
    damping: 20,
    mass: 0.5,
  });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    const xNorm = relX / rect.width - 0.5;
    const yNorm = relY / rect.height - 0.5;

    const maxTilt = 6;
    const maxParallax = 14;

    tiltX.set(yNorm * -maxTilt);
    tiltY.set(xNorm * maxTilt);
    imgX.set(xNorm * -maxParallax);
    imgY.set(yNorm * -maxParallax);
  };

  const handleLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
    imgX.set(0);
    imgY.set(0);
  };

  const isTall = event.layout === "tall";
  const isWide = event.layout === "wide";
  const spanClasses = [
    isTall ? "row-span-2" : "",
    isWide ? "md:col-span-2" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const cardVariants: Variants = {
    enter: (i: number) => ({
      opacity: 0,
      y: 18,
      scale: 0.97,
      filter: "blur(3px)",
      transition: {
        duration: 0.45,
        delay: 0.05 + i * 0.05,
        ease: easeSoft,
      },
    }),
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      boxShadow: "0 22px 80px rgba(0,0,0,0.9)",
      borderColor: "rgba(255,255,255,0.13)",
      transition: {
        duration: 0.55,
        ease: easeSoft,
      },
    },
    exit: {
      opacity: 0,
      y: -14,
      scale: 0.97,
      filter: "blur(4px)",
      transition: {
        duration: 0.35,
        ease: easeSoft,
      },
    },
    hover: {
      y: -10,
      scale: 1.03,
      boxShadow: "0 34px 120px rgba(0,0,0,1)",
      borderColor: "rgba(255,255,255,0.5)",
      transition: { duration: 0.45, ease: easeSoft },
    },
  };

  const glowVariants: Variants = {
    enter: { opacity: 0, scale: 0.85 },
    visible: { opacity: 0, scale: 0.9 },
    hover: { opacity: 0.95, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  return (
    <motion.article
      variants={cardVariants}
      custom={index}
      initial="enter"
      animate="visible"
      exit="exit"
      whileHover="hover"
      className={`
        group relative overflow-hidden
        rounded-[26px] border bg-white/[0.02]
        backdrop-blur-[3px] cursor-pointer
        ${spanClasses}
      `}
      style={{
        rotateX: springTiltX,
        rotateY: springTiltY,
        transformPerspective: 900,
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      layout
    >
      {/* ambient glow */}
      <motion.div
        aria-hidden
        variants={glowVariants}
        className="
          pointer-events-none absolute inset-0
          rounded-[28px]
          bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.16),transparent_70%)]
          mix-blend-screen
        "
      />

      <div className="relative h-full w-full overflow-hidden">
        {/* parallax image */}
        <motion.div
          style={{ x: springImgX, y: springImgY }}
          className="absolute inset-0"
          layout="position"
        >
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover object-center"
          />
        </motion.div>

        {/* vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.9)_100%)]" />

        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-start justify-between px-5 pt-4">
            <div className="flex flex-col gap-1">
              <span className="font-inter text-[11px] uppercase tracking-[0.32em] text-gray-300/80">
                {event.monthShort}
              </span>
              <span className="font-inter text-[11px] text-gray-300/80">
                {event.dayLabel}
              </span>
            </div>
            <span className="font-inter rounded-full border border-white/40 bg-black/60 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-gray-100">
              {event.timeLabel}
            </span>
          </div>

          <div className="mt-auto px-5 pb-5 pt-10 bg-gradient-to-t from-black/85 via-black/30 to-transparent">
            <p className="mb-1 font-inter text-[10px] uppercase tracking-[0.26em] text-gray-300">
              {event.category}
            </p>
            <h3 className="font-playfair text-[18px] md:text-[19px] tracking-[0.06em] text-gray-50">
              {event.title}
            </h3>
            <p className="mt-2 font-inter text-[12px] leading-relaxed text-gray-300/95">
              {event.blurb}
            </p>

            <div className="mt-3 flex items-center justify-between text-[11px] text-gray-300/90">
              <span className="font-inter uppercase tracking-[0.24em]">
                Read story
              </span>
              <span className="font-inter text-[11px] text-gray-400">
                {event.location}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ───────── main section ───────── */

export default function EventsSeasonalTimeline() {
  const { years, buckets } = useTimelineData();
  const [activeYear, setActiveYear] = useState<number>(
    years[0] ?? new Date().getFullYear()
  );

  const { scrollYProgress } = useScroll();
  const contentOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.87]);

  const spineRef = React.useRef<HTMLDivElement | null>(null);

  const { scrollYProgress: spineProgress } = useScroll({
    target: spineRef,
    offset: ["start start", "end end"],
  });

  const spineGlowY = useTransform(spineProgress, (v) => `${v * 100}%`);

  const monthSections = buckets.get(activeYear) ?? [];

  return (
    <section
      className="
        relative overflow-hidden
        bg-gradient-to-b from-[#050505] via-[#060606] to-[#050505]
        py-20 md:py-24 text-gray-100
      "
    >
      {/* background texture */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04)_0,transparent_45%),
              radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0,transparent_60%)]
          opacity-80
        "
      />

      {/* faint grid */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-10
          bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),
              linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)]
          bg-[size:80px_80px]
          opacity-40
        "
      />

      {/* huge blurred year in the back */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0 flex items-center justify-center
          text-[160px] md:text-[220px] lg:text-[260px]
          font-playfair tracking-[0.2em]
          text-white/5 blur-[3px]
        "
      >
        <motion.span
          key={activeYear}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeSoft }}
          className="select-none"
        >
          {activeYear}
        </motion.span>
      </div>

      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        {/* year selector */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-inter text-[11px] uppercase tracking-[0.32em] text-gray-400">
              Year
            </span>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-2 py-1">
              {years.map((year) => {
                const isActive = year === activeYear;
                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => setActiveYear(year)}
                    className={`
                      relative overflow-hidden rounded-full px-3 py-1.5
                      text-[11px] font-medium uppercase tracking-[0.2em]
                      transition-colors
                      ${
                        isActive
                          ? "text-black"
                          : "text-gray-300 hover:text-white"
                      }
                    `}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="year-pill"
                        className="absolute inset-0 rounded-full bg-white"
                        transition={{ duration: 0.35, ease: easeSoft }}
                      />
                    )}
                    <span className="relative z-10">{year}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* heading */}
        <motion.div
          style={{ opacity: contentOpacity }}
          className="max-w-3xl space-y-4"
        >
          <motion.p
            variants={sectionText}
            initial="hidden"
            animate="visible"
            custom={0}
            className="font-inter text-[11px] uppercase tracking-[0.35em] text-gray-400"
          >
            Quiet Calendar
          </motion.p>

          <motion.h1
            variants={sectionText}
            initial="hidden"
            animate="visible"
            custom={1}
            className="font-playfair text-3xl md:text-4xl leading-tight tracking-[0.06em]"
          >
            Evenings and small gatherings, arranged by season.
          </motion.h1>

          <motion.p
            variants={sectionText}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mt-2 max-w-xl font-inter text-sm md:text-[15px] leading-relaxed text-gray-400"
          >
            Add as many events as you like—the calendar automatically sorts them
            by year and month, keeping the hillside’s story in order.
          </motion.p>
        </motion.div>

        {/* main timeline */}
        <motion.div
          style={{ opacity: contentOpacity }}
          className="relative mt-14 flex gap-8 md:gap-10"
        >
          {/* left vertical spine with months */}
          <div
            ref={spineRef}
            className="
              relative hidden md:flex
              w-16 shrink-0 flex-col items-center
              min-h-[400px]
            "
          >
            <div className="relative h-full w-px bg-gradient-to-b from-white/60 via-white/25 to-transparent">
              {/* scroll-linked glow running down the spine */}
              <motion.div
                aria-hidden
                className="
                  pointer-events-none absolute z-30
                  h-12 w-12 -ml-6
                "
                style={{ top: spineGlowY, left: "50%" }}
                animate={{ scale: [0.9, 1.05, 0.9] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="relative flex h-full w-full items-center justify-center">
                  {/* soft outer glow */}
                  <div
                    className="
                      absolute h-16 w-16
                      rounded-full
                      bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.7),transparent_70%)]
                      blur-2xl
                      opacity-95
                    "
                  />
                  {/* subtle ring */}
                  <div
                    className="
                      absolute h-8 w-8
                      rounded-full border border-white/70
                      opacity-80
                    "
                  />
                  {/* core dot */}
                  <div className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
                </div>
              </motion.div>

              {monthSections.map((month, i) => (
                <div
                  key={month.monthIndex}
                  className="absolute left-1/2 -translate-x-1/2"
                  style={{
                    top: `${
                      (i / Math.max(monthSections.length - 1, 1)) * 100
                    }%`,
                  }}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                    <span className="font-inter text-[10px] uppercase tracking-[0.32em] text-gray-400">
                      {month.monthShort}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* right: month grids (animated per year) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeYear}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: easeSoft }}
              className="flex-1 space-y-14"
            >
              {monthSections.map((month) => (
                <section key={month.monthIndex} className="space-y-6">
                  <div className="flex items-baseline justify-between">
                    <div className="flex flex-col gap-1">
                      <p className="font-inter text-[11px] uppercase tracking-[0.32em] text-gray-400">
                        {month.monthShort}
                      </p>
                      <h2 className="font-playfair text-xl tracking-[0.08em] text-gray-50">
                        {month.monthLabel}
                      </h2>
                    </div>
                    <span className="ml-6 h-px flex-1 bg-gradient-to-r from-white/40 via-white/10 to-transparent" />
                  </div>

                  <div
                    className="
                      grid gap-4 md:gap-5
                      grid-cols-1 md:grid-cols-2 lg:grid-cols-3
                      auto-rows-[210px] md:auto-rows-[240px] lg:auto-rows-[260px]
                    "
                  >
                    {month.events.map((ev, idx) => (
                      <SeasonalEventCard key={ev.id} event={ev} index={idx} />
                    ))}
                  </div>
                </section>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
