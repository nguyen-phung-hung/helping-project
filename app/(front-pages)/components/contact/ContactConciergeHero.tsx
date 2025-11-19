"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  type Variants,
} from "framer-motion";

const easeSoft: [number, number, number, number] = [0.25, 0.8, 0.4, 1];

const mainScene = {
  tagLeft: "Lobby · After Dark",
  tagRight: "Concierge View",
  title: "Write as if you were already checked in.",
  src: "/gallery/lobby-evening.jpg",
};

const sideScenes = [
  {
    tag: "Pool · Dusk",
    caption: "Late arrival by water.",
    src: "/gallery/pool-dusk.jpg",
  },
  {
    tag: "City · Night",
    caption: "Skyline from the upper suites.",
    src: "/gallery/rooftop-night.jpg",
  },
];

const fieldLabel: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.06 * i, ease: easeSoft },
  }),
};

type Intent = "stay" | "event" | "other";

export default function ContactConciergeSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  // which chip is active
  const [intent, setIntent] = useState<Intent>("stay");

  // card tilt
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springX = useSpring(tiltX, { stiffness: 120, damping: 18, mass: 0.4 });
  const springY = useSpring(tiltY, { stiffness: 120, damping: 18, mass: 0.4 });

  // global glow under the section (spring-smoothed)
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const glowXS = useSpring(glowX, { stiffness: 70, damping: 18, mass: 0.6 });
  const glowYS = useSpring(glowY, { stiffness: 70, damping: 18, mass: 0.6 });

  const handleSectionMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    glowX.set(e.clientX - centerX);
    glowY.set(e.clientY - centerY);
  };

  const handleSectionLeave = () => {
    glowX.set(0);
    glowY.set(0);
  };

  const handleCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    const xNorm = relX / rect.width - 0.5;
    const yNorm = relY / rect.height - 0.5;

    tiltX.set(yNorm * -10);
    tiltY.set(xNorm * 10);
  };

  const handleCardLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  // change textarea copy based on intent
  const messagePlaceholder =
    intent === "stay"
      ? "Tell us about your stay—dates, number of guests, and how you like to arrive."
      : intent === "event"
      ? "Tell us about your event—occasion, date, number of guests, and any special arrangements you’d like."
      : "Share your question or request—anything from filming inquiries to custom stays.";

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleSectionMove}
      onMouseLeave={handleSectionLeave}
      className="
        w-full
        relative overflow-hidden
        bg-gradient-to-b from-[#050505] via-[#060606] to-[#050505]
        py-24 md:py-28
        text-gray-100
      "
    >
      {/* subtle concentric texture in background */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.035)_0,transparent_40%),
              radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0,transparent_55%)]
          opacity-70
        "
      />

      {/* distant CONTACT word, smaller & soft */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0 flex items-center justify-center
          text-[150px] md:text-[220px] lg:text-[260px]
          font-playfair tracking-[0.25em]
          text-white/25 blur-[3px]
        "
      >
        <span className="select-none">CONTACT</span>
      </div>

      {/* always-on mouse-driven glow under all content (springy) */}
      <motion.div
        aria-hidden
        className="
          pointer-events-none absolute left-1/2 top-1/2
          h-80 w-80 -translate-x-1/2 -translate-y-1/2
          rounded-full
          bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.22),transparent_70%)]
          mix-blend-screen
        "
        style={{ x: glowXS, y: glowYS }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 0.35, ease: easeSoft }}
      />

      {/* CONTENT */}
      <div
        className="
          relative mx-auto flex max-w-6xl flex-col
          gap-10 px-6 md:flex-row md:items-center md:px-10
        "
      >
        {/* LEFT: main tilt card + two small stills */}
        <div className="md:w-[46%] flex flex-col gap-4">
          {/* main card */}
          <motion.div
            className="
              group relative w-full
              overflow-hidden rounded-[32px]
              border border-white/10 bg-white/[0.02]
              shadow-[0_26px_90px_rgba(0,0,0,0.95)]
              backdrop-blur-[2px]
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
              boxShadow: "0 34px 110px rgba(0,0,0,1)",
            }}
            transition={{ duration: 0.6, ease: easeSoft }}
          >
            <div className="relative h-[380px] w-full overflow-hidden">
              {/* image */}
              <Image
                src={mainScene.src}
                alt={mainScene.title}
                fill
                className="object-cover object-center"
                priority
              />

              {/* vignette */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)]" />

              {/* smooth glass shimmer */}
              <motion.div
                className="
                  pointer-events-none absolute inset-0
                  bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.4)_45%,transparent_75%)]
                  mix-blend-screen
                "
                initial={{ x: "-130%", opacity: 0 }}
                animate={{
                  x: ["-130%", "0%", "130%"],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

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
                  {mainScene.tagLeft}
                </span>
                <span className="font-inter text-[10px] uppercase tracking-[0.2em] text-gray-300/80">
                  {mainScene.tagRight}
                </span>
              </div>

              {/* bottom title */}
              <div className="absolute inset-x-0 bottom-0 px-6 pb-6 pt-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                <p className="font-inter text-[11px] uppercase tracking-[0.3em] text-gray-400 mb-1">
                  A quiet arrival
                </p>
                <p className="font-playfair text-[17px] md:text-[19px] tracking-[0.06em] text-gray-50">
                  {mainScene.title}
                </p>
              </div>
            </div>
          </motion.div>

          {/* small stills */}
          <div className="grid grid-cols-2 gap-3">
            {sideScenes.map((scene) => (
              <motion.article
                key={scene.tag}
                className="
                  relative overflow-hidden rounded-[22px]
                  border border-white/10 bg-white/[0.015]
                  shadow-[0_18px_60px_rgba(0,0,0,0.9)]
                "
                whileHover={{
                  y: -4,
                  boxShadow: "0 26px 80px rgba(0,0,0,1)",
                }}
                transition={{ duration: 0.5, ease: easeSoft }}
              >
                <div className="relative h-[130px] w-full overflow-hidden">
                  <Image
                    src={scene.src}
                    alt={scene.caption}
                    fill
                    className="object-cover object-center"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.7)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-6 bg-gradient-to-t from-black/80 via-black/10 to-transparent">
                    <p className="font-inter text-[9px] uppercase tracking-[0.26em] text-gray-400">
                      {scene.tag}
                    </p>
                    <p className="font-inter text-[11px] text-gray-100 mt-1">
                      {scene.caption}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* RIGHT: concierge copy + form */}
        <motion.div
          className="md:w-[54%] space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="space-y-4">
            <p className="font-inter text-[11px] uppercase tracking-[0.35em] text-gray-400">
              Concierge Desk
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl leading-tight tracking-[0.06em]">
              A quiet way
              <br className="hidden md:block" /> to get in touch.
            </h2>
            <p className="font-inter text-sm md:text-[15px] text-gray-400 leading-relaxed max-w-xl">
              Tell us about your stay, private gathering, or question. We’ll
              reply as carefully as we would turn down a room.
            </p>
          </div>

          {/* intent toggles (interactive) */}
          <motion.div
            className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.02] p-1"
            variants={fieldLabel}
            custom={0}
          >
            {[
              { key: "stay" as Intent, label: "Stay inquiry" },
              { key: "event" as Intent, label: "Private event" },
              { key: "other" as Intent, label: "Other question" },
            ].map(({ key, label }) => {
              const isActive = intent === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setIntent(key)}
                  className={`
                    rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.25em]
                    transition-colors
                    ${
                      isActive
                        ? "bg-white text-black"
                        : "text-gray-300 hover:bg-white/5"
                    }
                  `}
                >
                  {label}
                </button>
              );
            })}
          </motion.div>

          {/* form card */}
          <motion.div
            className="
              relative overflow-hidden rounded-[32px]
              border border-white/12 bg-white/[0.02]
              shadow-[0_26px_90px_rgba(0,0,0,0.95)]
              backdrop-blur-[4px]
            "
            variants={fieldLabel}
            custom={1}
          >
            {/* very soft internal glow */}
            <div
              aria-hidden
              className="
                pointer-events-none absolute inset-0
                bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.07)_0,transparent_55%)]
                opacity-70
              "
            />

            <div className="relative space-y-6 px-6 py-7 md:px-8 md:py-8">
              {/* Name / Email */}
              <div className="grid gap-4 md:grid-cols-2">
                <motion.div variants={fieldLabel} custom={2}>
                  <label className="block text-[11px] font-medium uppercase tracking-[0.24em] text-gray-400">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    className="
                      mt-2 w-full rounded-[999px] border border-white/12
                      bg-black/50 px-4 py-2.5 text-sm text-gray-100
                      outline-none ring-0 transition
                      placeholder:text-gray-500
                      focus:border-white/60 focus:bg-black/70
                    "
                  />
                </motion.div>

                <motion.div variants={fieldLabel} custom={3}>
                  <label className="block text-[11px] font-medium uppercase tracking-[0.24em] text-gray-400">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@email.com"
                    className="
                      mt-2 w-full rounded-[999px] border border-white/12
                      bg-black/50 px-4 py-2.5 text-sm text-gray-100
                      outline-none ring-0 transition
                      placeholder:text-gray-500
                      focus:border-white/60 focus:bg-black/70
                    "
                  />
                </motion.div>
              </div>

              {/* Phone */}
              <motion.div variants={fieldLabel} custom={4}>
                <label className="block text-[11px] font-medium uppercase tracking-[0.24em] text-gray-400">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  placeholder="+84…"
                  className="
                    mt-2 w-full rounded-[999px] border border-white/12
                    bg-black/50 px-4 py-2.5 text-sm text-gray-100
                    outline-none ring-0 transition
                    placeholder:text-gray-500
                    focus:border-white/60 focus:bg-black/70
                  "
                />
              </motion.div>

              {/* Message */}
              <motion.div variants={fieldLabel} custom={5}>
                <label className="block text-[11px] font-medium uppercase tracking-[0.24em] text-gray-400">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder={messagePlaceholder}
                  className="
                    mt-2 w-full rounded-[24px] border border-white/12
                    bg-black/50 px-4 py-3 text-sm text-gray-100
                    outline-none ring-0 resize-none
                    placeholder:text-gray-500
                    focus:border-white/60 focus:bg-black/70
                  "
                />
              </motion.div>

              {/* footer controls */}
              <div className="flex flex-col gap-4 pt-1 md:flex-row md:items-center md:justify-between">
                <motion.div
                  className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-gray-400"
                  variants={fieldLabel}
                  custom={6}
                >
                  <span>Reply via</span>
                  <div className="inline-flex rounded-full border border-white/15 bg-black/40 p-1">
                    <button
                      type="button"
                      className="rounded-full bg-white px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-black"
                    >
                      Email
                    </button>
                    <button
                      type="button"
                      className="rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-gray-300 hover:bg-white/5"
                    >
                      Call
                    </button>
                  </div>
                </motion.div>

                <motion.button
                  type="submit"
                  className="
                    inline-flex items-center justify-center
                    rounded-full border border-white/40 bg-white text-[11px]
                    px-6 py-2 uppercase tracking-[0.28em] text-black
                    hover:bg-white
                  "
                  variants={fieldLabel}
                  custom={7}
                >
                  Send to concierge
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
