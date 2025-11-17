"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  type Variants,
  AnimatePresence,
} from "framer-motion";

const easeSoft: [number, number, number, number] = [0.25, 0.8, 0.4, 1];

const textContainer: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: easeSoft,
      staggerChildren: 0.08,
    },
  },
};

const textItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeSoft },
  },
};

const principles = [
  {
    label: "Pillar I",
    title: "Quiet lines & long sight",
    body: "Corridors and lounges are drawn with long, uninterrupted lines so your eye can rest. Edges are softened, corners are rounded, and views are composed like still frames.",
  },
  {
    label: "Pillar II",
    title: "Cinematic, forgiving light",
    body: "Light is tuned for faces and reflection, not for brightness alone. Lamps, sconces, and window glow are layered so nothing glares, and every seat feels flattering.",
  },
  {
    label: "Pillar III",
    title: "Spaces in between",
    body: "Thresholds, stair landings, and quiet corners are treated as destinations, not leftovers. These are the places where guests pause, breathe, and feel privately at home.",
  },
];

export default function AboutDesignPhilosophy() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Scroll-based parallax + ambient + section dim
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 10%"],
  });

  const cardY = useTransform(scrollYProgress, [0, 1], [30, -50]);
  const ambientOpacity = useTransform(scrollYProgress, [0, 1], [0.4, 0.8]);

  // 🔸 NEW: whole-section dim as you scroll past
  const sectionDim = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.45]);

  // Mouse-based tilt for the image
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  const springX = useSpring(tiltX, { stiffness: 120, damping: 18, mass: 0.4 });
  const springY = useSpring(tiltY, { stiffness: 120, damping: 18, mass: 0.4 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    tiltX.set(y * -10);
    tiltY.set(x * 10);
  };

  const handleLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <section
      className="
        relative overflow-hidden
        bg-gradient-to-b from-[#050505] via-[#070707] to-[#050505]
        py-20 md:py-28
        text-gray-100
      "
    >
      {/* Ambient background reacting to scroll */}
      <motion.div
        aria-hidden
        style={{ opacity: ambientOpacity }}
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0,rgba(0,0,0,0.97)_65%,#000_100%)]
        "
      />

      {/* 🔸 Apply sectionDim here so all content softly fades as you scroll past */}
      <motion.div
        ref={sectionRef}
        // style={{ opacity: sectionDim }}
        className="relative mx-auto flex max-w-6xl flex-col gap-14 px-6 md:flex-row md:px-10"
      >
        {/* LEFT: interactive image card */}
        <motion.div
          style={{ y: cardY }}
          className="md:w-[45%] flex justify-center md:justify-start mb-4 md:mb-0"
        >
          <motion.div
            className="
              group
              relative w-full max-w-md
              rounded-[32px]
              border border-white/10 bg-white/[0.02]
              shadow-[0_26px_90px_rgba(0,0,0,0.95)]
              overflow-hidden
              before:pointer-events-none before:absolute before:inset-0
              before:bg-[radial-gradient(circle_at_top,#ffffff0d_0,transparent_60%)]
            "
            style={{
              rotateX: springX,
              rotateY: springY,
              transformPerspective: 900,
            }}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            whileHover={{
              y: -6,
              boxShadow: "0 32px 100px rgba(0,0,0,1)",
            }}
            transition={{ duration: 0.6, ease: easeSoft }}
          >
            <div className="relative h-[420px] w-full overflow-hidden">
              <Image
                src="/gallery/bar-detail.jpg"
                alt="Composed interior bar at Aurelia Haven"
                fill
                className="object-cover object-center"
                priority
              />

              {/* lens dust texture on hover */}
              <div
                className="
                  pointer-events-none absolute inset-0
                  bg-[url('/textures/lens-dust.png')]
                  mix-blend-soft-light opacity-0
                  transition-opacity duration-500
                  group-hover:opacity-60
                "
              />

              {/* vignette */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.65)_100%)]" />

              {/* top labels */}
              <div className="absolute inset-x-0 top-0 flex items-start justify-between px-5 pt-4">
                <span
                  className="
                    inline-flex items-center rounded-full
                    border border-white/40 bg-black/60
                    px-3 py-1 text-[10px]
                    uppercase tracking-[0.24em]
                    text-gray-100
                  "
                >
                  Lobby Bar
                </span>
                <span className="font-inter text-[10px] uppercase tracking-[0.2em] text-gray-300/80">
                  Interior Study
                </span>
              </div>

              {/* bottom title */}
              <div className="absolute inset-x-0 bottom-0 px-6 pb-5 pt-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                <p className="font-inter text-[11px] uppercase tracking-[0.3em] text-gray-400 mb-1">
                  Composed Interiors
                </p>
                <p className="font-playfair text-[16px] md:text-[18px] tracking-[0.06em] text-gray-50">
                  Architecture for stillness.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT: philosophy text + interactive principles */}
        <motion.div
          className="md:w-[55%] flex flex-col justify-center md:pl-10"
          variants={textContainer}
          initial="hidden"
          whileInView="visible"
          style={{ opacity: sectionDim }}
          viewport={{ once: true, amount: 0.35 }}
        >
          <motion.div variants={textItem} className="space-y-4">
            <p className="font-inter text-[11px] uppercase tracking-[0.35em] text-gray-400">
              Design Philosophy
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl leading-tight tracking-[0.06em]">
              Light, lines,
              <br className="hidden md:block" /> and quiet frames.
            </h2>
          </motion.div>

          {/* vertical line + scroll hint */}
          <motion.div
            variants={textItem}
            className="mt-6 mb-4 flex items-start gap-4"
          >
            <div className="relative flex flex-col items-center">
              <div className="h-16 w-px bg-gradient-to-b from-white/60 via-white/15 to-transparent" />
              <motion.div
                className="mt-1 h-1 w-1 rounded-full bg-white/70"
                animate={{ y: [0, 6, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: easeSoft,
                }}
              />
            </div>
            <p className="font-inter text-[11px] uppercase tracking-[0.28em] text-gray-500 pt-1">
              Three quiet rules for every space.
            </p>
          </motion.div>

          {/* principle tabs */}
          <motion.div variants={textItem} className="mt-4 flex flex-col gap-3">
            {principles.map((p, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={p.title}
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  className={`
                    group flex w-full items-baseline justify-between gap-4
                    border-l pl-4 pr-2 py-2
                    text-left transition-colors
                    ${
                      isActive
                        ? "border-white/70 bg-white/[0.03]"
                        : "border-white/10 hover:border-white/30 hover:bg-white/[0.015]"
                    }
                  `}
                >
                  <div>
                    <p
                      className={`
                        font-inter text-[10px] uppercase tracking-[0.28em]
                        ${
                          isActive
                            ? "text-gray-300"
                            : "text-gray-500 group-hover:text-gray-400"
                        }
                      `}
                    >
                      {p.label}
                    </p>
                    <p
                      className={`
                        font-inter text-xs md:text-[13px] mt-1
                        ${
                          isActive
                            ? "text-gray-100"
                            : "text-gray-400 group-hover:text-gray-200"
                        }
                      `}
                    >
                      {p.title}
                    </p>
                  </div>

                  {/* small dot indicator */}
                  <div className="flex items-center">
                    <span
                      className={`
                        h-1.5 w-1.5 rounded-full
                        ${
                          isActive
                            ? "bg-white"
                            : "bg-white/25 group-hover:bg-white/60"
                        }
                      `}
                    />
                  </div>
                </button>
              );
            })}
          </motion.div>

          {/* active principle body */}
          <AnimatePresence mode="wait">
            <motion.p
              key={principles[activeIndex].title}
              className="mt-6 font-inter text-sm md:text-[15px] text-gray-400 leading-relaxed max-w-[60ch]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
            >
              {principles[activeIndex].body}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
}
