"use client";

import React, { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";

const easeSoft: [number, number, number, number] = [0.25, 0.8, 0.4, 1];

type Frame = {
  tag: string;
  title: string;
  location: string;
  src: string;
  description: string;
  ambient: string; // for ambient glow
};

const FRAMES: Frame[] = [
  {
    tag: "Lobby",
    title: "Quiet Arrival",
    location: "Ground Floor",
    src: "/gallery/lobby-evening.jpg",
    description: "Soft reflections, candles, and the first quiet step inside.",
    ambient: "rgba(255,207,150,0.35)", // warm gold
  },
  {
    tag: "Suites",
    title: "Cityview Studio",
    location: "East Wing",
    src: "/gallery/room-cityview.jpg",
    description: "Skyline views where the city feels almost muted.",
    ambient: "rgba(143,188,255,0.35)", // cool blue
  },
  {
    tag: "Night",
    title: "Rooftop Terrace",
    location: "Sky Deck",
    src: "/gallery/rooftop-night.jpg",
    description: "Midnight conversations, soft music, and city lights below.",
    ambient: "rgba(183,148,255,0.4)", // violet
  },
  {
    tag: "Details",
    title: "Aurelia Bar",
    location: "Lobby Level",
    src: "/gallery/bar-detail.jpg",
    description: "Lantern light, glass, and the hush of late-evening drinks.",
    ambient: "rgba(255,210,190,0.4)", // peach
  },
  {
    tag: "Calm",
    title: "Pool at Dusk",
    location: "Upper Level",
    src: "/gallery/pool-dusk.jpg",
    description:
      "Still water, lantern reflections, and the last of the evening warmth.",
    ambient: "rgba(132,224,207,0.4)", // teal
  },
];

export default function AboutSignatureGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = FRAMES[activeIndex];

  // ---- scroll-based fade for left text ----
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  });

  const leftOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 0.25]);
  const leftY = useTransform(scrollYProgress, [0, 1], [0, 28]);

  // ---- tilt + subtle glare for main frame ----
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const glareX = useMotionValue(0);
  const glareY = useMotionValue(0);

  const springX = useSpring(tiltX, {
    stiffness: 140,
    damping: 18,
    mass: 0.4,
  });
  const springY = useSpring(tiltY, {
    stiffness: 140,
    damping: 18,
    mass: 0.4,
  });

  const glareXSpring = useSpring(glareX, {
    stiffness: 120,
    damping: 20,
    mass: 0.4,
  });
  const glareYSpring = useSpring(glareY, {
    stiffness: 120,
    damping: 20,
    mass: 0.4,
  });

  const handleFrameMouseMove = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    tiltX.set(y * -12); // rotateX
    tiltY.set(x * 12); // rotateY

    glareX.set(x * 40);
    glareY.set(y * 40);
  };

  const handleFrameMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
    glareX.set(0);
    glareY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      className="
        relative overflow-hidden
        bg-gradient-to-b from-[#050505] via-[#070707] to-[#050505]
        py-20 md:py-28
        text-gray-100
      "
    >
      {/* base soft radial background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0,rgba(0,0,0,0.96)_60%,#000_100%)]" />

      {/* ambient glow reacting to active frame */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: easeSoft }}
          style={{
            background: `radial-gradient(circle at center, ${active.ambient} 0, transparent 65%)`,
          }}
          className="
            pointer-events-none absolute -inset-x-40 top-1/2 h-[520px]
            -translate-y-1/2 blur-3xl
          "
        />
      </AnimatePresence>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-14 px-6 md:flex-row md:px-10">
        {/* LEFT: copy & vertical film index */}
        <motion.div
          style={{ opacity: leftOpacity, y: leftY }}
          className="md:w-[38%] space-y-8"
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
          <div className="space-y-1 pt-4">
            <p className="font-inter text-[11px] uppercase tracking-[0.32em] text-gray-500">
              Now viewing
            </p>
            <p className="font-inter text-xs md:text-sm text-gray-200">
              {active.tag} · {active.location}
            </p>
            <p className="font-inter text-xs md:text-sm text-gray-500 max-w-sm leading-relaxed">
              {active.description}
            </p>
          </div>

          {/* vertical film index */}
          <div className="pt-4 border-l border-white/10 pl-4 space-y-1">
            {FRAMES.map((frame, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={frame.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`
                    group flex w-full items-center justify-between gap-3
                    text-left text-[11px] md:text-xs font-inter
                    tracking-[0.22em] uppercase
                    ${
                      isActive
                        ? "text-gray-100"
                        : "text-gray-500 hover:text-gray-200"
                    }
                  `}
                >
                  <span
                    className={`
                      relative flex-1
                      before:absolute before:-left-4 before:top-1/2 before:h-px
                      before:w-2 before:-translate-y-1/2
                      before:rounded-full
                      ${
                        isActive
                          ? "before:bg-gradient-to-r before:from-white/80 before:to-transparent"
                          : "before:bg-white/10 group-hover:before:bg-white/40"
                      }
                    `}
                  >
                    {frame.tag} – {frame.title}
                  </span>

                  {/* small dot indicator */}
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isActive
                        ? "bg-white"
                        : "bg-white/20 group-hover:bg-white/60"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* RIGHT: single cinematic frame viewer */}
        <div className="md:w-[62%] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.title}
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ duration: 0.7, ease: easeSoft }}
              className="
                w-full max-w-3xl
              "
            >
              <motion.article
                className="
                  group relative w-full overflow-hidden
                  rounded-[32px]
                  border border-white/10 bg-white/[0.02]
                  shadow-[0_26px_90px_rgba(0,0,0,0.95)]
                  backdrop-blur-[2px]
                "
                style={{
                  rotateX: springX,
                  rotateY: springY,
                  transformPerspective: 900,
                }}
                onMouseMove={handleFrameMouseMove}
                onMouseLeave={handleFrameMouseLeave}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.5, ease: easeSoft }}
              >
                <div className="relative h-[340px] sm:h-[420px] md:h-[460px] w-full overflow-hidden">
                  {/* main image */}
                  <Image
                    src={active.src}
                    alt={active.title}
                    fill
                    className="
                      object-cover object-center
                      transition-transform duration-[2200ms]
                      ease-[cubic-bezier(0.25,0.8,0.4,1)]
                      group-hover:scale-[1.04]
                    "
                    priority={activeIndex === 0}
                  />

                  {/* subtle parallax glare */}
                  <motion.div
                    aria-hidden
                    style={{ x: glareXSpring, y: glareYSpring }}
                    className="
                      pointer-events-none absolute -inset-x-40 top-0 h-full
                      bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.16)_45%,transparent_80%)]
                      opacity-40
                      mix-blend-screen
                    "
                  />

                  {/* soft vignette */}
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.65)_100%)]" />

                  {/* lens dust texture on hover (super subtle) */}
                  <div
                    className="
                      pointer-events-none absolute inset-0
                      opacity-0 group-hover:opacity-40
                      transition-opacity duration-800
                      mix-blend-screen
                      bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.13)_0,transparent_35%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.08)_0,transparent_40%),radial-gradient(circle_at_30%_80%,rgba(255,255,255,0.07)_0,transparent_40%)]
                    "
                  />

                  {/* top labels */}
                  <div className="absolute inset-x-0 top-0 flex items-start justify-between px-6 pt-4">
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
                    <span className="font-inter text-[10px] uppercase tracking-[0.18em] text-gray-300/80">
                      {active.location}
                    </span>
                  </div>

                  {/* bottom title + CTA */}
                  <div className="absolute inset-x-0 bottom-0 px-6 pb-5 pt-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                    <h3 className="font-playfair text-lg md:text-xl tracking-[0.06em] text-gray-50">
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
                      <span className="h-px w-8 bg-gradient-to-r from-white/70 to-transparent" />
                    </button>
                  </div>
                </div>
              </motion.article>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
