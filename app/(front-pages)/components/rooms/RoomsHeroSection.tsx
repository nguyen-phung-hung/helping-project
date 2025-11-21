"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  type Variants,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";

const easeSoft: [number, number, number, number] = [0.25, 0.8, 0.4, 1];

export type StayKind = "all" | "solo" | "two" | "family";
export type ViewKind = "all" | "bay" | "hillside";

export type Room = {
  id: string;
  name: string;
  subtitle: string; // e.g. "Bayfront · Corner Suite"
  highlightLabel?: string;
  stayKind: Exclude<StayKind, "all">;
  viewKind: Exclude<ViewKind, "all">;
  guestsLabel: string;
  bedLabel: string;
  sizeLabel: string;
  viewLabel: string;
  rateLabel: string; // "From $420 / night"
  image: string;
};

export const rooms: Room[] = [
  // ORIGINAL 5 ----------------------------------------------------
  {
    id: "bayfront-evening-suite",
    name: "Bayfront Evening Suite",
    subtitle: "Bayfront · Corner Suite",
    highlightLabel: "Highlighted stay",
    stayKind: "two",
    viewKind: "bay",
    guestsLabel: "2 guests",
    bedLabel: "1 king bed",
    sizeLabel: "58 m²",
    viewLabel: "Full bay view",
    rateLabel: "From $420 / night",
    image: "/gallery/room-cityview.jpg",
  },
  {
    id: "solo-hillside-king",
    name: "Quiet Hillside King",
    subtitle: "Hillside · Ninth Floor",
    stayKind: "solo",
    viewKind: "hillside",
    guestsLabel: "1 guest",
    bedLabel: "1 king bed",
    sizeLabel: "34 m²",
    viewLabel: "Hillside lights",
    rateLabel: "From $260 / night",
    image: "/gallery/detail-texture.jpg",
  },
  {
    id: "family-bay-loft",
    name: "Bay Loft for Four",
    subtitle: "Bayfront · Loft Suite",
    stayKind: "family",
    viewKind: "bay",
    guestsLabel: "4 guests",
    bedLabel: "1 king & 2 twins",
    sizeLabel: "72 m²",
    viewLabel: "Wraparound bay view",
    rateLabel: "From $640 / night",
    image: "/gallery/pool-dusk.jpg",
  },
  {
    id: "family-hillside-connecting",
    name: "Connecting Hillside Rooms",
    subtitle: "Hillside · Adjoining",
    stayKind: "family",
    viewKind: "hillside",
    guestsLabel: "4 guests",
    bedLabel: "2 king beds",
    sizeLabel: "64 m²",
    viewLabel: "City & hillside",
    rateLabel: "From $510 / night",
    image: "/gallery/lobby-evening.jpg",
  },
  {
    id: "solo-bay-studio",
    name: "Bay Studio",
    subtitle: "Bayfront · Studio",
    stayKind: "solo",
    viewKind: "bay",
    guestsLabel: "1 guest",
    bedLabel: "1 queen bed",
    sizeLabel: "30 m²",
    viewLabel: "Harbor line",
    rateLabel: "From $290 / night",
    image: "/gallery/bar-detail.jpg",
  },

  // NEW ROOMS ------------------------------------------------------
  {
    id: "bayfront-sunrise-suite",
    name: "Sunrise Bayfront Suite",
    subtitle: "Bayfront · Upper Floor",
    stayKind: "two",
    viewKind: "bay",
    guestsLabel: "2 guests",
    bedLabel: "1 king bed",
    sizeLabel: "52 m²",
    viewLabel: "Eastern sunrise view",
    rateLabel: "From $470 / night",
    image: "/gallery/room-cityview.jpg",
  },
  {
    id: "hillside-quiet-nook",
    name: "Hillside Quiet Nook",
    subtitle: "Hillside · Sixth Floor",
    stayKind: "solo",
    viewKind: "hillside",
    guestsLabel: "1 guest",
    bedLabel: "1 queen bed",
    sizeLabel: "28 m²",
    viewLabel: "Forest edge",
    rateLabel: "From $230 / night",
    image: "/gallery/detail-texture.jpg",
  },
  {
    id: "bayfront-panorama-suite",
    name: "Panorama Bay Suite",
    subtitle: "Bayfront · Wraparound",
    stayKind: "family",
    viewKind: "bay",
    guestsLabel: "3 guests",
    bedLabel: "1 king bed & sofa",
    sizeLabel: "66 m²",
    viewLabel: "270° bay view",
    rateLabel: "From $580 / night",
    image: "/gallery/pool-dusk.jpg",
  },
  {
    id: "hillside-library-room",
    name: "Hillside Library Room",
    subtitle: "Hillside · Quiet Wing",
    stayKind: "two",
    viewKind: "hillside",
    guestsLabel: "2 guests",
    bedLabel: "1 queen bed",
    sizeLabel: "42 m²",
    viewLabel: "Courtyard",
    rateLabel: "From $310 / night",
    image: "/gallery/lobby-evening.jpg",
  },
  {
    id: "bay-studio-deluxe",
    name: "Deluxe Bay Studio",
    subtitle: "Bayfront · Deluxe",
    stayKind: "solo",
    viewKind: "bay",
    guestsLabel: "1 guest",
    bedLabel: "1 king bed",
    sizeLabel: "36 m²",
    viewLabel: "Marina lights",
    rateLabel: "From $320 / night",
    image: "/gallery/bar-detail.jpg",
  },
  {
    id: "hillside-family-suite",
    name: "Hillside Family Suite",
    subtitle: "Hillside · Corner Suite",
    stayKind: "family",
    viewKind: "hillside",
    guestsLabel: "5 guests",
    bedLabel: "2 queen beds",
    sizeLabel: "79 m²",
    viewLabel: "Mountain ridge",
    rateLabel: "From $690 / night",
    image: "/gallery/lobby-evening.jpg",
  },
  {
    id: "bayfront-evening-loft",
    name: "Bayfront Evening Loft",
    subtitle: "Bayfront · Loft Floor",
    stayKind: "two",
    viewKind: "bay",
    guestsLabel: "2 guests",
    bedLabel: "1 king bed",
    sizeLabel: "54 m²",
    viewLabel: "Night harbour",
    rateLabel: "From $460 / night",
    image: "/gallery/pool-dusk.jpg",
  },
  {
    id: "hillside-minimalist-room",
    name: "Minimalist Hillside Room",
    subtitle: "Hillside · North Wing",
    stayKind: "solo",
    viewKind: "hillside",
    guestsLabel: "1 guest",
    bedLabel: "1 single bed",
    sizeLabel: "24 m²",
    viewLabel: "Tree canopy",
    rateLabel: "From $190 / night",
    image: "/gallery/detail-texture.jpg",
  },
  {
    id: "bayfront-lantern-suite",
    name: "Lantern Bayfront Suite",
    subtitle: "Bayfront · Signature",
    stayKind: "family",
    viewKind: "bay",
    guestsLabel: "4 guests",
    bedLabel: "1 king + sofa",
    sizeLabel: "84 m²",
    viewLabel: "Golden bay nightlights",
    rateLabel: "From $720 / night",
    image: "/gallery/room-cityview.jpg",
  },
  {
    id: "hillside-garden-balcony",
    name: "Hillside Garden Balcony",
    subtitle: "Hillside · Garden Wing",
    stayKind: "two",
    viewKind: "hillside",
    guestsLabel: "2 guests",
    bedLabel: "1 queen bed",
    sizeLabel: "40 m²",
    viewLabel: "Private terrace",
    rateLabel: "From $330 / night",
    image: "/gallery/lobby-evening.jpg",
  },
];

const heroCardVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeSoft },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.45, ease: easeSoft },
  },
};

const stayLabels: Record<StayKind, string> = {
  all: "All stay types",
  solo: "Solo stays",
  two: "Stays for two",
  family: "Family stays",
};

const viewLabels: Record<ViewKind, string> = {
  all: "Bay & hillside views",
  bay: "Bay view only",
  hillside: "Hillside only",
};

export default function RoomsHeroSection() {
  const [stayFilter, setStayFilter] = useState<StayKind>("all");
  const [viewFilter, setViewFilter] = useState<ViewKind>("all");

  /* ----------  TILT + GLARE VALUES (from AboutHero style) ---------- */

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  const springX = useSpring(tiltX, { stiffness: 120, damping: 18, mass: 0.4 });
  const springY = useSpring(tiltY, { stiffness: 120, damping: 18, mass: 0.4 });

  const glareX = useMotionValue(0);
  const glareSpringX = useSpring(glareX, {
    stiffness: 160,
    damping: 22,
    mass: 0.28,
  });

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 → 0.5
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    // tilt
    tiltX.set(relY * -14);
    tiltY.set(relX * 14);

    // glare slide
    glareX.set(relX * 120);
  };

  const handleCardMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
    glareX.set(0);
  };

  /* -------------------- FILTERING -------------------- */

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const stayOK = stayFilter === "all" ? true : room.stayKind === stayFilter;
      const viewOK = viewFilter === "all" ? true : room.viewKind === viewFilter;
      return stayOK && viewOK;
    });
  }, [stayFilter, viewFilter]);

  const heroRoom: Room = filteredRooms[0] ?? rooms[0];

  const filteredCount = filteredRooms.length;
  const summaryText = `${filteredCount} ${
    filteredCount === 1 ? "stay" : "stays"
  } • ${stayLabels[stayFilter]} • ${viewLabels[viewFilter]}`;

  return (
    <section
      className="
     w-full min-h-screen
      relative overflow-hidden
      bg-gradient-to-b from-[#050505] via-[#060606] to-[#050505]
      py-20 md:py-24 text-gray-100
    "
    >
      {/* soft background texture */}
      <div
        aria-hidden
        className="
        pointer-events-none absolute inset-0
        bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04)_0,transparent_45%),
            radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0,transparent_60%)]
        opacity-80
      "
      />

      {/* huge blurred ROOMS word */}
      <div
        aria-hidden
        className="
        pointer-events-none absolute inset-0 flex items-center justify-center
        text-[150px] md:text-[220px] lg:text-[260px]
        font-playfair tracking-[0.25em]
        text-white/25 blur-[3px]
      "
      >
        <span className="select-none">ROOMS</span>
      </div>

      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
          {/* LEFT: copy + filters */}
          <div className="lg:w-[48%] space-y-7">
            <p className="font-inter text-[11px] uppercase tracking-[0.35em] text-gray-400">
              Rooms & Suites
            </p>

            <div className="space-y-4">
              <h1 className="font-playfair text-3xl md:text-4xl leading-tight tracking-[0.06em]">
                Rooms that feel like
                <br className="hidden md:block" /> the lobby after midnight.
              </h1>

              <p className="max-w-xl font-inter text-sm md:text-[15px] leading-relaxed text-gray-400">
                Every floor has its own quiet—bayfront corners for late
                check-ins, hillside rooms for slow mornings, and suites where
                the city stays behind the glass.
              </p>
            </div>

            {/* Filter group: stay kind */}
            <div className="space-y-3">
              <p className="font-inter text-[11px] uppercase tracking-[0.32em] text-gray-400">
                Stay type
              </p>
              <div className="inline-flex flex-wrap gap-2 rounded-full border border-white/12 bg-white/[0.02] p-1">
                {(
                  [
                    ["all", "All stays"],
                    ["solo", "Solo"],
                    ["two", "Two of us"],
                    ["family", "Family"],
                  ] as [StayKind, string][]
                ).map(([value, label]) => {
                  const active = stayFilter === value;
                  return (
                    <motion.button
                      key={value}
                      type="button"
                      onClick={() => setStayFilter(value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className={`
                        relative overflow-hidden rounded-full px-4 py-1.5
                        text-[11px] uppercase tracking-[0.24em]
                        transition-colors
                        ${
                          active
                            ? "text-black"
                            : "text-gray-300 hover:text-white"
                        }
                      `}
                    >
                      {active && (
                        <motion.span
                          layoutId="rooms-stay-pill"
                          className="absolute inset-0 rounded-full bg-white shadow-[0_0_40px_rgba(255,255,255,0.35)]"
                          transition={{ duration: 0.35, ease: easeSoft }}
                        />
                      )}
                      <span className="relative z-10">{label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Filter group: view */}
            <div className="space-y-3">
              <p className="font-inter text-[11px] uppercase tracking-[0.32em] text-gray-400">
                View
              </p>
              <div className="inline-flex flex-wrap gap-2 rounded-full border border-white/12 bg-white/[0.02] p-1">
                {(
                  [
                    ["all", "Bay & Hillside"],
                    ["bay", "Bay view"],
                    ["hillside", "Hillside"],
                  ] as [ViewKind, string][]
                ).map(([value, label]) => {
                  const active = viewFilter === value;
                  return (
                    <motion.button
                      key={value}
                      type="button"
                      onClick={() => setViewFilter(value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className={`
                        relative overflow-hidden rounded-full px-4 py-1.5
                        text-[11px] uppercase tracking-[0.24em]
                        transition-colors
                        ${
                          active
                            ? "text-black"
                            : "text-gray-300 hover:text-white"
                        }
                      `}
                    >
                      {active && (
                        <motion.span
                          layoutId="rooms-view-pill"
                          className="absolute inset-0 rounded-full bg-white shadow-[0_0_40px_rgba(255,255,255,0.35)]"
                          transition={{ duration: 0.35, ease: easeSoft }}
                        />
                      )}
                      <span className="relative z-10">{label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Scroll hint + dynamic summary */}
            <div className="pt-4 flex items-center gap-3">
              <motion.div
                aria-hidden
                animate={{ y: [0, 4, 0] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="h-9 w-9 rounded-full border border-white/20 flex items-center justify-center text-[10px] tracking-[0.2em] text-gray-300"
              >
                ↓
              </motion.div>
              <div className="space-y-1">
                <p className="font-inter text-[11px] uppercase tracking-[0.32em] text-gray-500">
                  — Scroll to explore all rooms
                </p>
                <p className="font-inter text-[11px] text-gray-500">
                  {summaryText}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: hero room card with AboutHero-style tilt + glare */}
          <div className="lg:w-[52%]">
            <AnimatePresence mode="wait">
              <motion.div
                key={heroRoom.id}
                variants={heroCardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                style={{
                  rotateX: springX,
                  rotateY: springY,
                  transformPerspective: 900,
                }}
                whileHover={{
                  y: -4,
                  boxShadow: "0 32px 90px rgba(0,0,0,0.95)",
                }}
                transition={{ duration: 0.6, ease: easeSoft }}
                className="
                  relative overflow-hidden
                  rounded-[32px] border border-white/12
                  bg-white/[0.03] shadow-[0_26px_90px_rgba(0,0,0,0.95)]
                  backdrop-blur-[4px] will-change-transform
                  origin-center
                "
              >
                {/* subtle ambient glow */}
                <div
                  aria-hidden
                  className="
                    pointer-events-none absolute inset-0
                    bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12)_0,transparent_55%)]
                    opacity-70
                  "
                />

                {/* animated light line at bottom edge */}
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-[-40%] bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent"
                  animate={{ x: ["-10%", "10%", "-10%"] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <motion.div
                  className="relative h-[360px] w-full overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.8, ease: easeSoft }}
                >
                  <Image
                    src={heroRoom.image}
                    alt={heroRoom.name}
                    fill
                    className="object-cover object-center"
                  />

                  {/* MICRO-GLARE OVERLAY */}
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 overflow-hidden"
                  >
                    <motion.div
                      className="
                        absolute top-0 bottom-0
                        w-24
                        bg-white/14
                        opacity-80
                        blur-xl
                        rounded-full
                        mix-blend-screen
                      "
                      style={{
                        x: glareSpringX,
                        rotate: -18,
                      }}
                    />
                  </motion.div>

                  {/* vignette */}
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.8)_100%)]" />

                  {/* top labels */}
                  <div className="absolute inset-x-0 top-0 flex items-start justify-between px-6 pt-5">
                    <span
                      className="
                        inline-flex items-center rounded-full
                        border border-white/40 bg-black/60
                        px-3 py-1 text-[10px]
                        uppercase tracking-[0.24em] text-gray-100
                      "
                    >
                      {heroRoom.subtitle}
                    </span>
                    {heroRoom.highlightLabel && (
                      <span
                        className="
                          inline-flex items-center rounded-full
                          border border-white/40 bg-white/10
                          px-3 py-1 text-[10px]
                          uppercase tracking-[0.24em] text-gray-100
                        "
                      >
                        {heroRoom.highlightLabel}
                      </span>
                    )}
                  </div>

                  {/* bottom content */}
                  <div className="absolute inset-x-0 bottom-0 px-6 pb-6 pt-10 bg-gradient-to-t from-black/85 via-black/40 to-transparent">
                    <h2 className="font-playfair text-[20px] md:text-[22px] tracking-[0.06em] text-gray-50">
                      {heroRoom.name}
                    </h2>
                    <p className="mt-1 font-inter text-[13px] text-gray-300">
                      For{" "}
                      {heroRoom.stayKind === "solo"
                        ? "quiet solo stays close to the elevators."
                        : heroRoom.stayKind === "two"
                        ? "late check-ins that feel like a private bar."
                        : "families who like the city lights without the noise."}
                    </p>

                    {/* meta chips */}
                    <div className="mt-4 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.22em] text-gray-100">
                      <span className="rounded-full bg-black/60 px-3 py-1">
                        {heroRoom.guestsLabel}
                      </span>
                      <span className="rounded-full bg-black/60 px-3 py-1">
                        {heroRoom.bedLabel}
                      </span>
                      <span className="rounded-full bg-black/60 px-3 py-1">
                        {heroRoom.sizeLabel}
                      </span>
                      <span className="rounded-full bg-black/60 px-3 py-1">
                        {heroRoom.viewLabel}
                      </span>
                    </div>

                    {/* rate + CTA */}
                    <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="space-y-1">
                        <p className="font-inter text-[11px] uppercase tracking-[0.24em] text-gray-400">
                          Guide rate
                        </p>
                        <p className="font-inter text-sm text-gray-100">
                          {heroRoom.rateLabel}
                        </p>
                      </div>

                      <button
                        type="button"
                        className="
                          inline-flex items-center justify-center
                          rounded-full border border-white/70 bg-white text-[11px]
                          px-6 py-2 uppercase tracking-[0.26em] text-black
                          hover:bg-white
                        "
                      >
                        Check availability
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- SECTION B: SCROLLABLE ROOMS RAIL ----------

function RoomRailCard({
  room,
  index,
  onHover,
}: {
  room: Room;
  index: number;
  onHover?: (room: Room | null) => void;
}) {
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const imgX = useMotionValue(0);
  const imgY = useMotionValue(0);

  const springTiltX = useSpring(tiltX, {
    stiffness: 140,
    damping: 20,
    mass: 0.4,
  });
  const springTiltY = useSpring(tiltY, {
    stiffness: 140,
    damping: 20,
    mass: 0.4,
  });
  const springImgX = useSpring(imgX, {
    stiffness: 120,
    damping: 22,
    mass: 0.5,
  });
  const springImgY = useSpring(imgY, {
    stiffness: 120,
    damping: 22,
    mass: 0.5,
  });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    const maxTilt = 4;
    const maxParallax = 12;

    tiltX.set(relY * -maxTilt);
    tiltY.set(relX * maxTilt);
    imgX.set(relX * -maxParallax);
    imgY.set(relY * -maxParallax);
  };

  const handleLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
    imgX.set(0);
    imgY.set(0);
    onHover?.(null);
  };

  const glowColor =
    room.viewKind === "bay"
      ? "rgba(147,197,253,0.45)" // soft bay blue
      : "rgba(167,243,208,0.45)"; // hillside green

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: easeSoft }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseEnter={() => onHover?.(room)}
      whileHover={{
        y: -8,
        boxShadow: "0 30px 100px rgba(0,0,0,0.9)",
      }}
      style={{
        rotateX: springTiltX,
        rotateY: springTiltY,
        transformPerspective: 900,
      }}
      className="
      w-full
        relative overflow-hidden
        rounded-[26px] border border-white/12
        bg-white/[0.03] backdrop-blur-[4px]
        shadow-[0_24px_80px_rgba(0,0,0,0.95)]
        min-w-[260px] sm:min-w-[320px] md:min-w-[360px] lg:min-w-[420px]
        scroll-mx-4 scroll-snap-align-start
        cursor-pointer
      "
    >
      {/* colored ambient glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          background: `radial-gradient(circle at 20% 0%, ${glowColor}, transparent 60%)`,
          opacity: 0.0,
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: easeSoft }}
      />

      <div className="relative h-[260px] w-full overflow-hidden">
        {/* parallax image */}
        <motion.div
          className="absolute inset-0"
          style={{ x: springImgX, y: springImgY }}
        >
          <Image
            src={room.image}
            alt={room.name}
            fill
            className="object-cover object-center"
          />
        </motion.div>

        {/* vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)]" />

        {/* top labels */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between px-4 pt-4">
          <span className="inline-flex items-center rounded-full border border-white/45 bg-black/60 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-gray-100">
            {room.subtitle}
          </span>
          {room.highlightLabel && (
            <span className="inline-flex items-center rounded-full border border-white/40 bg-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-gray-100">
              {room.highlightLabel}
            </span>
          )}
        </div>

        {/* bottom content */}
        <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-10 bg-gradient-to-t from-black/85 via-black/45 to-transparent">
          <h3 className="font-playfair text-[17px] md:text-[18px] tracking-[0.05em] text-gray-50">
            {room.name}
          </h3>
          <p className="mt-1 font-inter text-[11px] text-gray-300">
            {room.stayKind === "solo"
              ? "Quiet single rooms close to the elevators."
              : room.stayKind === "two"
              ? "Corner suites made for late check-ins."
              : "Two-room setups that keep bedtime and baytime apart."}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] uppercase tracking-[0.22em] text-gray-100">
            <span className="rounded-full bg-black/70 px-2.5 py-1">
              {room.guestsLabel}
            </span>
            <span className="rounded-full bg-black/70 px-2.5 py-1">
              {room.bedLabel}
            </span>
            <span className="rounded-full bg-black/70 px-2.5 py-1">
              {room.sizeLabel}
            </span>
            <span className="rounded-full bg-black/70 px-2.5 py-1">
              {room.viewLabel}
            </span>
          </div>
        </div>
      </div>

      {/* rate & CTA strip */}
      <div className="flex items-center justify-between px-4 py-3 text-[11px] font-inter">
        <div className="space-y-0.5">
          <p className="uppercase tracking-[0.24em] text-gray-400">
            Guide rate
          </p>
          <p className="text-gray-100">{room.rateLabel}</p>
        </div>
        <button
          type="button"
          className="
            rounded-full border border-white/60 bg-white/5
            px-4 py-1.5 uppercase tracking-[0.22em]
            text-[10px] text-gray-50
            hover:bg-white hover:text-black
            transition-colors
          "
        >
          View details
        </button>
      </div>
    </motion.article>
  );
}

export function RoomsScrollGallery() {
  const [hoveredRoom, setHoveredRoom] = useState<Room | null>(null);

  const railRef = React.useRef<HTMLDivElement | null>(null);
  const { scrollXProgress } = useScroll({
    container: railRef,
  });
  const progressWidth = useTransform(scrollXProgress, [0, 1], ["0%", "100%"]);

  const activeCopy = hoveredRoom ?? rooms[0];

  return (
    <section
      className="
        relative overflow-hidden
        bg-gradient-to-b from-[#050505] via-[#050505] to-[#040404]
        py-16 md:py-20 text-gray-100
      "
    >
      {/* soft background */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04)_0,transparent_45%),
              radial-gradient(circle_at_bottom,rgba(255,255,255,0.02)_0,transparent_60%)]
          opacity-80
        "
      />

      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* LEFT: copy that reacts to hovered card */}
          <div className="lg:w-[30%] space-y-5">
            <p className="font-inter text-[11px] uppercase tracking-[0.35em] text-gray-400">
              All Rooms
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCopy.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: easeSoft }}
                className="space-y-2"
              >
                <h2 className="font-playfair text-2xl md:text-[26px] tracking-[0.08em]">
                  {activeCopy.name}
                </h2>
                <p className="font-inter text-sm text-gray-400 max-w-sm">
                  {activeCopy.stayKind === "solo"
                    ? "For late arrivals who prefer a single key and a quiet floor."
                    : activeCopy.stayKind === "two"
                    ? "Suites that feel like a private corner of the lobby bar."
                    : "Family rooms that keep the city lights outside and the bedtime soft."}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="pt-4 space-y-2 text-[11px] font-inter text-gray-500">
              <p className="uppercase tracking-[0.3em]">
                Scroll sideways to browse
              </p>
              <p>
                Cards tilt softly on hover, and bay / hillside views tint the
                light differently, so you can feel each floor before you click.
              </p>
            </div>
          </div>

          {/* RIGHT: horizontal rail */}
          <div className="lg:w-[70%]">
            <div className="relative">
              {/* scroll progress bar */}
              <div className="mb-3 h-[2px] w-full rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-white via-white to-white/40"
                  style={{ width: progressWidth }}
                />
              </div>

              <motion.div
                ref={railRef}
                className="
                  flex gap-5 md:gap-6
                  overflow-x-auto no-scrollbar
                  pb-2 pt-1
                  scroll-snap-type-x mandatory
                "
              >
                {rooms.map((room, index) => (
                  <RoomRailCard
                    key={room.id}
                    room={room}
                    index={index}
                    onHover={setHoveredRoom}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
