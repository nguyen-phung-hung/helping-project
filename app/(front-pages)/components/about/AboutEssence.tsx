"use client";

import React, { useRef, MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";

const easeSoft = "easeOut";

const textContainer: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easeSoft,
      staggerChildren: 0.08,
    },
  },
};

const textItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: easeSoft,
    },
  },
};

type Pillar = {
  label: string;
  title: string;
  body: string;
};

const pillars: Pillar[] = [
  {
    label: "Pillar I",
    title: "Quiet architecture",
    body: "Muted palettes, softened corners, and long sightlines create a sense of composure. Corridors feel intentional, not endless, with framed moments of light anchoring the walk to your room.",
  },
  {
    label: "Pillar II",
    title: "Soft, cinematic light",
    body: "Evening light is tuned to feel like the moments after a film ends—warm, low-contrast, and kind to the eyes. Reflections are subtle, never harsh, and surfaces glow rather than shine.",
  },
  {
    label: "Pillar III",
    title: "Considered rituals",
    body: "From turn-down to late check-in, every touchpoint is designed to be unhurried. Guests are encouraged to arrive slowly, sleep deeply, and leave with the sense that time moved differently here.",
  },
];

function FloatingPillarCard({
  pillar,
  index,
}: {
  pillar: Pillar;
  index: number;
}) {
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  const springX = useSpring(tiltX, { stiffness: 120, damping: 18, mass: 0.4 });
  const springY = useSpring(tiltY, { stiffness: 120, damping: 18, mass: 0.4 });

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 → 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    tiltX.set(y * -10); // rotateX
    tiltY.set(x * 10); // rotateY
  };

  const handleLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <motion.article
      className="
        relative overflow-hidden rounded-[26px]
        border border-white/10 bg-white/[0.02]
        shadow-[0_20px_60px_rgba(0,0,0,0.9)]
        backdrop-blur-sm
      "
      style={{
        rotateX: springX,
        rotateY: springY,
        transformPerspective: 900,
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, ease: easeSoft, delay: index * 0.05 }}
      whileHover={{
        y: -6,
        scale: 1.02,
        boxShadow: "0 28px 90px rgba(0,0,0,0.95)",
      }}
    >
      {/* Ambient breathing motion */}
      <motion.div
        className="relative px-7 py-7 md:px-8 md:py-8 z-10"
        animate={{ y: [0, -3, 0] }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 1.1,
        }}
      >
        <p className="font-inter text-[10px] tracking-[0.28em] uppercase text-gray-400 mb-3">
          {pillar.label}
        </p>
        <h3 className="font-playfair text-xl md:text-2xl text-gray-50 mb-3">
          {pillar.title}
        </h3>
        <p className="font-inter text-sm md:text-[15px] text-gray-300 leading-relaxed">
          {pillar.body}
        </p>
      </motion.div>

      {/* Glass / light texture overlay */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12)_0,transparent_55%)]
          opacity-60 mix-blend-screen
        "
      />
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0
          bg-[linear-gradient(120deg,rgba(255,255,255,0.12)_0,transparent_20%,transparent_80%,rgba(255,255,255,0.08)_100%)]
          opacity-40 mix-blend-soft-light
        "
      />
    </motion.article>
  );
}

export default function AboutEssence() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 70%", "end 80%"],
  });

  // Parallax for pillars column
  const pillarsY = useTransform(scrollYProgress, [0, 1], [100, -150]);

  // Vertical progress line
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="
        relative overflow-hidden
        bg-gradient-to-b from-[#050505] via-[#060606] to-[#050505]
        text-gray-100
        py-20 md:py-28
      "
    >
      {/* Background vignette & texture */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0,rgba(0,0,0,0.98)_60%,#000_100%)]
        "
      />
      {/* Super subtle grain */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0 opacity-[0.03]
          mix-blend-soft-light
          bg-[url('/grain/grain-light.png')]
          bg-repeat
        "
      />

      {/* Vertical progress line on the left */}
      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        <div className="absolute left-0 top-6 hidden h-[260px] md:block">
          <div className="h-full w-px bg-white/5 overflow-hidden">
            <motion.div
              style={{ scaleY: lineScale, transformOrigin: "top" }}
              className="h-full w-full bg-gradient-to-b from-white/70 via-white/30 to-transparent"
            />
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-14 px-6 md:flex-row md:px-10">
        {/* LEFT: Copy block */}
        <motion.div
          className="md:w-[48%] space-y-8"
          variants={textContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.p
            variants={textItem}
            className="font-inter text-[11px] uppercase tracking-[0.32em] text-gray-500"
          >
            Essence of Pullman
          </motion.p>

          <motion.div variants={textItem} className="space-y-4">
            <h2 className="font-playfair text-3xl md:text-[40px] leading-snug tracking-[0.04em] text-gray-50">
              Calm light, quiet
              <br />
              architecture,
              <br />
              and considered detail.
            </h2>
          </motion.div>

          <motion.p
            variants={textItem}
            className="font-inter text-sm md:text-[15px] text-gray-300 leading-relaxed max-w-xl"
          >
            The hotel is designed as a series of still frames: corridors that
            feel like film shots, suites that open gradually, and views where
            the city becomes soft background noise. Every material, fixture, and
            sightline is chosen to slow your breathing just a little.
          </motion.p>

          <motion.p
            variants={textItem}
            className="font-inter text-sm md:text-[15px] text-gray-400 leading-relaxed max-w-xl"
          >
            Guests move through light instead of signage: warmer tones signal
            arrival, cooler tones signal rest. Technology remains discreet and
            quiet, leaving space for conversation, reading, or simply listening
            to the air vents hum.
          </motion.p>
        </motion.div>

        {/* RIGHT: Floating pillar slabs */}
        <motion.div
          className="md:w-[52%] flex flex-col gap-5 md:gap-6"
          style={{ y: pillarsY }}
        >
          {pillars.map((pillar, index) => (
            <FloatingPillarCard
              key={pillar.title}
              pillar={pillar}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
