"use client";

import React from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from "framer-motion";
import { rooms as defaultRooms, type Room } from "./RoomsHeroSection";

const easeSoft: [number, number, number, number] = [0.25, 0.8, 0.4, 1];

// ---------- Card used in vertical grid ----------

function RoomGridCard({ room, index }: { room: Room; index: number }) {
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
    const maxParallax = 10;

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
  };

  const glowColor =
    room.viewKind === "bay"
      ? "rgba(147,197,253,0.55)" // bay blue
      : "rgba(167,243,208,0.55)"; // hillside green

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.04, ease: easeSoft }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
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
        relative overflow-hidden
        rounded-[26px] border border-white/12
        bg-white/[0.03] backdrop-blur-[4px]
        shadow-[0_24px_80px_rgba(0,0,0,0.95)]
        cursor-pointer
      "
    >
      {/* colored ambient glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          background: `radial-gradient(circle at 15% 0%, ${glowColor}, transparent 60%)`,
          opacity: 0,
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: easeSoft }}
      />

      <div className="relative h-[230px] w-full overflow-hidden">
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
          <h3 className="font-playfair text-[16px] md:text-[17px] tracking-[0.05em] text-gray-50">
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

// ---------- Section B: vertical gallery with left scroll indicator ----------

type RoomGridGalleryProps = {
  rooms?: Room[];
};

export function RoomGridGallery({
  rooms = defaultRooms,
}: RoomGridGalleryProps) {
  const sectionRef = React.useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end end"],
  });

  const indicatorY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={sectionRef}
      className="
        w-full
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
        <div className="flex gap-8 md:gap-10">
          {/* LEFT: vertical scroll indicator + intro copy */}
          <div className="relative hidden md:flex w-16 shrink-0 flex-col items-center">
            {/* label */}
            <p className="mb-4 font-inter text-[10px] uppercase tracking-[0.32em] text-gray-500">
              Scroll
            </p>

            {/* spine */}
            <div className="relative h-full w-px bg-gradient-to-b from-white/50 via-white/15 to-transparent">
              <motion.div
                aria-hidden
                style={{ top: indicatorY }}
                className="
                  pointer-events-none absolute left-1/2
                  -translate-x-1/2 -translate-y-1/2
                  h-10 w-10
                "
              >
                <div className="relative h-full w-full flex items-center justify-center">
                  {/* outer glow */}
                  <div
                    className="
                      absolute h-14 w-14
                      rounded-full
                      bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.65),transparent_70%)]
                      blur-2xl opacity-90
                    "
                  />
                  {/* ring */}
                  <div
                    className="
                      absolute h-7 w-7 rounded-full
                      border border-white/80 opacity-80
                    "
                  />
                  {/* core dot */}
                  <div className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.9)]" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* RIGHT: heading + grid */}
          <div className="flex-1">
            {/* heading + copy */}
            <div className="max-w-3xl space-y-3 mb-8 md:mb-10">
              <p className="font-inter text-[11px] uppercase tracking-[0.35em] text-gray-400">
                All Rooms
              </p>
              <h2 className="font-playfair text-2xl md:text-[26px] tracking-[0.08em]">
                Scroll to explore the floors.
              </h2>
              <p className="font-inter text-sm md:text-[14px] text-gray-400">
                Every floor has its own quiet—bayfront corners for late
                check-ins, hillside rooms for slow mornings, and lofts where the
                city stays behind the glass. Wander down the page to see where
                you&apos;d like the night to end.
              </p>
            </div>

            {/* GRID: 3 cards per row on desktop */}
            <div
              className="
                grid gap-5 md:gap-6
                grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
              "
            >
              {rooms.map((room, index) => (
                <RoomGridCard key={room.id} room={room} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
