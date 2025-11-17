"use client";
import React from "react";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { ParallaxWrapper } from "@/components/ParallawxWrapper";

const easeSoft: [number, number, number, number] = [0.25, 0.8, 0.4, 1];

const textContainer: Variants = {
  hidden: { opacity: 0, y: 18 },
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

export default function AboutHero() {
  /** 1. GLOBAL SCROLL → PARALLAX (no ref, works even with SmoothScrollLayout) */
  const { scrollY } = useScroll();
  // You can tweak the [0, 600] range if you want a stronger / weaker parallax
  const parallaxY = useTransform(scrollY, [0, 1000], [0, -80]);

  /** 2. TILT + GLOW VALUES */
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  const springX = useSpring(tiltX, { stiffness: 120, damping: 18, mass: 0.4 });
  const springY = useSpring(tiltY, { stiffness: 120, damping: 18, mass: 0.4 });

  // background glow follows mouse (you already had this)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const glowX = useSpring(rawX, {
    stiffness: 120,
    damping: 20,
    mass: 0.4,
  });
  const glowY = useSpring(rawY, {
    stiffness: 120,
    damping: 20,
    mass: 0.4,
  });

  /** 3. MICRO-GLARE VALUE (driven by cursor inside the card) */
  const glareX = useMotionValue(0);
  const glareSpringX = useSpring(glareX, {
    stiffness: 160,
    damping: 22,
    mass: 0.28,
  });

  /* ---------- background glow on whole section ---------- */

  const handleSectionMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    rawX.set(x * 0.2);
    rawY.set(y * 0.2);
  };

  const handleSectionMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  /* ---------- tilt + glare on image card ---------- */

  const handleImageMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 → 0.5
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    // tilt
    tiltX.set(relY * -14);
    tiltY.set(relX * 14);

    // glare follows cursor horizontally
    glareX.set(relX * 120); // make it big so you SEE it move
  };

  const handleImageLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
    glareX.set(0);
  };

  return (
    <section
      className="
        relative overflow-hidden
        bg-gradient-to-b from-[#050505] via-[#070707] to-[#050505]
        text-gray-100
        pt-28 md:pt-32 pb-24 md:pb-32
      "
      onMouseMove={handleSectionMouseMove}
      onMouseLeave={handleSectionMouseLeave}
    >
      {/* radial glow behind content */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0,rgba(0,0,0,0.95)_60%,#000_100%)]" />

      {/* Soft moving glow that follows cursor */}
      <motion.div
        aria-hidden
        style={{ x: glowX, y: glowY }}
        className="
          pointer-events-none absolute -inset-x-32 top-1/2 h-[420px]
          -translate-y-1/2
          bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0,rgba(0,0,0,0)_55%)]
          opacity-70
          blur-3xl
        "
      />

      {/* PARALLAX WRAPPER – whole content block moves on scroll */}
      <motion.div
        style={{ y: parallaxY }}
        className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6 md:flex-row md:px-10"
      >
        {/* Floating cinematic image block */}
        <div className="md:w-[40%] flex justify-center md:justify-start">
          <motion.div
            className="
              relative w-full max-w-sm rounded-[32px]
              border border-white/10 bg-white/[0.02]
              shadow-[0_28px_80px_rgba(0,0,0,0.85)]
              overflow-hidden
              before:pointer-events-none before:absolute before:inset-0
              before:bg-[radial-gradient(circle_at_top,#ffffff0d_0,transparent_55%)]
            "
            style={{
              rotateX: springX,
              rotateY: springY,
              transformPerspective: 900,
            }}
            onMouseMove={handleImageMove}
            onMouseLeave={handleImageLeave}
            whileHover={{
              y: -4,
              boxShadow: "0 32px 90px rgba(0,0,0,0.95)",
            }}
            transition={{ duration: 0.6, ease: easeSoft }}
          >
            <div className="relative h-[480px] w-full overflow-hidden">
              <Image
                src="/tet.jpg"
                alt="Softly lit corridor at Aurelia Haven"
                fill
                className="object-cover object-center"
                priority
              />

              {/* MICRO-GLARE OVERLAY – very visible now */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 overflow-hidden"
              >
                <motion.div
                  className="
      absolute top-0 bottom-0
      w-24                      /* narrower streak */
      bg-white/20               /* softer base */
      opacity-80                /* MUCH softer */
      blur-xl                   /* luxury softness */
      rounded-full              /* smooth edges */
      mix-blend-screen          /* real glare highlight */
    "
                  style={{
                    x: glareSpringX,
                    rotate: -18,
                  }}
                />
              </motion.div>
            </div>

            {/* bottom label */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between px-6 py-4 text-[11px] uppercase tracking-[0.22em] text-gray-300/80">
              <span className="font-inter">City Retreat</span>
              <span className="font-inter text-gray-400">Aurelia Haven</span>
            </div>
          </motion.div>
        </div>

        {/* Text side */}
        <motion.div
          className="md:w-[60%] flex flex-col justify-center gap-10"
          variants={textContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={textItem} className="space-y-4">
            <p className="font-inter text-[11px] uppercase tracking-[0.35em] text-gray-400">
              About Aurelia Haven
            </p>

            <h1 className="font-playfair text-3xl md:text-5xl leading-tight tracking-[0.06em] text-gray-100">
              A quiet frame
              <br className="hidden md:block" /> of the city
            </h1>

            <div className="h-px w-16 bg-white/20" />

            <p className="font-inter text-sm md:text-base text-gray-400 leading-relaxed max-w-xl">
              Aurelia Haven is a modern boutique retreat where soft light, calm
              architecture, and considered details shape every stay. Designed
              for unhurried evenings, slow mornings, and travelers who prefer
              quiet luxury over noise.
            </p>
          </motion.div>

          {/* Philosophy card */}

          <ParallaxWrapper
            variants={textItem}
            className="
              relative rounded-3xl border border-white/10 bg-white/[0.02]
              px-6 py-6 md:px-7 md:py-7
              shadow-[0_18px_60px_rgba(0,0,0,0.75)]
              backdrop-blur-sm
            "
          >
            <p className="font-inter text-[11px] uppercase tracking-[0.32em] text-gray-400 mb-3">
              Philosophy
            </p>
            <p className="font-inter text-sm md:text-[15px] text-gray-300 leading-relaxed">
              Every corridor, suite, and quiet corner is framed like a
              photograph—balanced light, restrained color, and room for you to
              breathe. Aurelia Haven is less about spectacle, and more about how
              a place feels once the city noise falls away.
            </p>
          </ParallaxWrapper>

          {/* Scroll hint */}
          <motion.div
            variants={textItem}
            className="mt-2 hidden md:flex flex-col items-start gap-2"
          >
            <p className="font-inter text-[11px] uppercase tracking-[0.32em] text-gray-500">
              Scroll to discover
            </p>
            <motion.div
              className="h-9 w-px bg-gradient-to-b from-white/60 via-white/20 to-transparent"
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: easeSoft,
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
