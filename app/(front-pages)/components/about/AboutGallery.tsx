"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  type Variants,
} from "framer-motion";

const easeSoft: [number, number, number, number] = [0.25, 0.8, 0.4, 1];

type Frame = {
  id: string;
  tag: string;
  title: string;
  location: string;
  src: string;
  summary: string;
};

const frames: Frame[] = [
  {
    id: "quiet-arrival",
    tag: "Lobby",
    title: "Quiet Arrival",
    location: "Ground Floor",
    src: "/gallery/lobby-evening.jpg",
    summary: "Soft reflections, candles, and the first quiet step inside.",
  },
  {
    id: "cityview-studio",
    tag: "Suites",
    title: "Cityview Studio",
    location: "East Wing",
    src: "/gallery/room-cityview.jpg",
    summary:
      "Framed skyline views where the city feels almost muted behind glass.",
  },
  {
    id: "rooftop-terrace",
    tag: "Night",
    title: "Rooftop Terrace",
    location: "Sky Deck",
    src: "/gallery/rooftop-night.jpg",
    summary: "Midnight conversations, soft music, and city lights below.",
  },
  {
    id: "aurelia-bar",
    tag: "Details",
    title: "Aurelia Bar",
    location: "Lobby Level",
    src: "/gallery/bar-detail.jpg",
    summary:
      "Low counter light, quiet glassware, and a bar that never feels crowded.",
  },
  {
    id: "pool-at-dusk",
    tag: "Calm",
    title: "Pool at Dusk",
    location: "Upper Level",
    src: "/gallery/pool-dusk.jpg",
    summary:
      "Still water, lantern reflections, and the last of the evening warmth.",
  },
];

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: easeSoft,
    },
  },
};

const cardTransition: Variants = {
  initial: { opacity: 0, y: 18, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: easeSoft,
    },
  },
  exit: {
    opacity: 0,
    y: -18,
    scale: 0.98,
    transition: {
      duration: 0.55,
      ease: easeSoft,
    },
  },
};

export default function AboutSignatureGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = frames[activeIndex];

  // tilt for the hero card
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springX = useSpring(tiltX, { stiffness: 120, damping: 18, mass: 0.4 });
  const springY = useSpring(tiltY, { stiffness: 120, damping: 18, mass: 0.4 });

  // subtle parallax glare
  const glareXRaw = useMotionValue(0);
  const glareYRaw = useMotionValue(0);
  const glareX = useSpring(glareXRaw, {
    stiffness: 120,
    damping: 20,
    mass: 0.4,
  });
  const glareY = useSpring(glareYRaw, {
    stiffness: 120,
    damping: 20,
    mass: 0.4,
  });

  const handleCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // tilt
    tiltX.set(y * -14);
    tiltY.set(x * 14);

    // very small parallax for the glare
    glareXRaw.set(x * 40); // subtle horizontal drift
    glareYRaw.set(y * 20); // tiny vertical drift
  };

  const handleCardLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
    glareXRaw.set(0);
    glareYRaw.set(0);
  };

  return (
    <section
      className="
        relative overflow-hidden
        bg-gradient-to-b from-[#050505] via-[#070707] to-[#050505]
        py-20 md:py-28 text-gray-100
      "
    >
      {/* subtle global glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0,rgba(0,0,0,0.96)_60%,#000_100%)]" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-14 px-6 md:flex-row md:px-10">
        {/* LEFT: copy + film index */}
        <motion.div
          className="md:w-[38%] space-y-8"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="flex items-center gap-4">
            <span className="h-10 w-px bg-gradient-to-b from-white/70 via-white/10 to-transparent" />
            <p className="font-inter text-[11px] uppercase tracking-[0.35em] text-gray-400">
              Signature Experience
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-playfair text-3xl md:text-4xl leading-tight tracking-[0.06em]">
              The quiet moments
              <br className="hidden md:block" /> we keep.
            </h2>
            <p className="font-inter text-sm md:text-[15px] text-gray-400 leading-relaxed">
              A small collection of still frames that hold the feeling of
              Aurelia Haven—soft corridors, elevated city light, and details
              that stay with you long after checkout.
            </p>
          </div>

          {/* scroll hint */}
          {/* <div className="space-y-2 pt-2">
            <p className="font-inter text-[11px] uppercase tracking-[0.32em] text-gray-500">
              Scroll through the frames
            </p>
            <motion.div
              className="h-8 w-px bg-gradient-to-b from-white/60 via-white/20 to-transparent"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: easeSoft }}
            />
          </div> */}

          {/* now viewing */}
          <div className="space-y-1 pt-4 text-sm font-inter text-gray-300">
            <p className="text-[11px] uppercase tracking-[0.3em] text-gray-500">
              Now viewing
            </p>
            <p className="text-[13px] tracking-[0.18em] uppercase text-gray-200">
              {active.tag} · {active.location}
            </p>
            <p className="text-[13px] text-gray-400 max-w-sm">
              {active.summary}
            </p>
          </div>

          {/* vertical film index */}
          <div className="mt-4 border-l border-white/10 pl-4 space-y-2 text-[12px] font-inter">
            {frames.map((frame, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={frame.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`
                    block text-left transition-colors duration-200
                    ${
                      isActive
                        ? "text-gray-100"
                        : "text-gray-500 hover:text-gray-200"
                    }
                  `}
                >
                  <span
                    className={`
                      text-[11px] tracking-[0.24em] uppercase
                      ${isActive ? "font-medium" : "font-normal"}
                    `}
                  >
                    {frame.tag} – {frame.title}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* RIGHT: single cinematic hero card */}
        <div className="md:w-[62%] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.article
              key={active.id}
              variants={cardTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              className="
                group relative w-full max-w-xl
                rounded-[32px]
                border border-white/12 bg-white/[0.02]
                shadow-[0_28px_90px_rgba(0,0,0,0.95)]
                overflow-hidden
              "
              style={{
                rotateX: springX,
                rotateY: springY,
                transformPerspective: 900,
              }}
              onMouseMove={handleCardMove}
              onMouseLeave={handleCardLeave}
              whileHover={{
                y: -6,
                boxShadow: "0 36px 110px rgba(0,0,0,0.98)",
              }}
              transition={{ duration: 0.6, ease: easeSoft }}
            >
              <div className="relative h-[440px] w-full">
                <Image
                  src={active.src}
                  alt={active.title}
                  fill
                  className="
                    object-cover object-center
                    transition-transform duration-[2200ms]
                    ease-[cubic-bezier(0.25,0.8,0.4,1)]
                    group-hover:scale-110
                  "
                  priority
                />

                {/* subtle parallax glare, like the hero */}
                <motion.div
                  aria-hidden
                  style={{ x: glareX, y: glareY }}
                  className="
                    pointer-events-none absolute inset-y-[-20%] left-1/2 w-1/3
                    bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.11)_40%,transparent_85%)]
                    opacity-30 group-hover:opacity-55
                    transition-opacity duration-300
                    mix-blend-screen
                  "
                />

                {/* vignette */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />

                {/* top labels */}
                <div className="absolute inset-x-0 top-0 flex items-start justify-between px-6 pt-5">
                  <span
                    className="
                      inline-flex items-center rounded-full
                      border border-white/35 bg-black/60
                      px-3 py-1 text-[10px]
                      uppercase tracking-[0.24em]
                      text-gray-100
                    "
                  >
                    {active.tag}
                  </span>
                  <span className="font-inter text-[10px] uppercase tracking-[0.2em] text-gray-300/80">
                    {active.location}
                  </span>
                </div>

                {/* bottom title/cta */}
                <div className="absolute inset-x-0 bottom-0 px-6 pb-5 pt-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                  <h3 className="font-playfair text-lg md:text-[20px] tracking-[0.08em] text-gray-50">
                    {active.title}
                  </h3>
                  <button
                    type="button"
                    className="
                      mt-2 inline-flex items-center gap-2
                      text-[10px] uppercase tracking-[0.26em]
                      text-gray-300/90
                    "
                  >
                    View still
                    <span className="h-px w-7 bg-gradient-to-r from-white/60 to-transparent" />
                  </button>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
