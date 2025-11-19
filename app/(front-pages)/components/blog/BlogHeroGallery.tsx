"use client";

import React, { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";

const easeSoft: [number, number, number, number] = [0.25, 0.8, 0.4, 1];

type FeaturedPost = {
  slug: string;
  tag: string;
  month: string;
  readTime: string;
  title: string;
  blurb: string;
  image: string;
  layout: "tall" | "wide" | "small";
};

const featuredPosts: FeaturedPost[] = [
  {
    slug: "/blog/quiet-lobby",
    tag: "Lobby · After Dark",
    month: "FEB",
    readTime: "4 min read",
    title: "When the lobby sounds like a quiet bar.",
    blurb:
      "Candles, glass, and late check-ins—the lobby after 10 p.m. becomes the calmest room in the building.",
    image: "/blog/uhm.png",
    layout: "tall",
  },
  {
    slug: "/blog/blue-hour-pool",
    tag: "Pool · Dusk",
    month: "FEB",
    readTime: "3 min read",
    title: "Blue hour over the water.",
    blurb:
      "Why we dim the pool lights as the city brightens—an experiment in leaving the stars in charge.",
    image: "/blog/mut-tet-min.png",
    layout: "wide",
  },
  {
    slug: "/blog/city-night-suites",
    tag: "City · Night",
    month: "JAN",
    readTime: "5 min read",
    title: "Skyline from the upper suites.",
    blurb:
      "Sightlines, curtain gaps, and the kind of silence that still sees the whole bay.",
    image: "/blog/red-envolop.png",
    layout: "small",
  },
  {
    slug: "/blog/hallway-light",
    tag: "Corridor · Quiet",
    month: "JAN",
    readTime: "4 min read",
    title: "Why the hallways never feel like halls.",
    blurb:
      "Soft corners, low sconces, and why some doors barely look like doors at all.",
    image: "/blog/lion-dance.png",
    layout: "small",
  },
  {
    slug: "/blog/room-scent",
    tag: "Suite · Details",
    month: "DEC",
    readTime: "3 min read",
    title: "Tuning the scent of a room.",
    blurb:
      "How a quiet citrus note became the baseline for every floor above the bay.",
    image: "/blog/tet-road.png",
    layout: "wide",
  },
  {
    slug: "/blog/morning-lounge",
    tag: "Lounge · Morning",
    month: "DEC",
    readTime: "2 min read",
    title: "First light in the lounge.",
    blurb:
      "The way the city haze lifts off the windows just before breakfast begins.",
    image: "/blog/tet-holday.png",
    layout: "small",
  },
];

const textFade: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: easeSoft },
  }),
};

/**
 * Single card with tilt + local parallax + shimmer
 */
function MosaicCard({ post, index }: { post: FeaturedPost; index: number }) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Tilt / parallax for this card
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const shiftX = useMotionValue(0);
  const shiftY = useMotionValue(0);

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
  const springShiftX = useSpring(shiftX, {
    stiffness: 120,
    damping: 18,
    mass: 0.4,
  });
  const springShiftY = useSpring(shiftY, {
    stiffness: 120,
    damping: 18,
    mass: 0.4,
  });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    const xNorm = relX / rect.width - 0.5; // -0.5 → 0.5
    const yNorm = relY / rect.height - 0.5;

    // Slight tilt + parallax drift
    tiltX.set(yNorm * -10);
    tiltY.set(xNorm * 10);
    shiftX.set(xNorm * -10);
    shiftY.set(yNorm * -10);
  };

  const handleLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
    shiftX.set(0);
    shiftY.set(0);
  };

  const isTall = post.layout === "tall";
  const isWide = post.layout === "wide";

  const spanClasses = [
    isTall ? "row-span-2" : "",
    isWide ? "lg:col-span-2" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Different default rotation per card so collage feels organic
  const baseRotate = post.layout === "tall" ? 0 : index % 2 === 0 ? -2.5 : 2.5;

  return (
    <motion.article
      key={post.slug}
      ref={cardRef}
      className={`
        group relative overflow-hidden
        rounded-[26px]
        border border-white/12
        bg-white/[0.02]
        shadow-[0_22px_80px_rgba(0,0,0,0.95)]
        backdrop-blur-[3px]
        cursor-pointer
        ${spanClasses}
      `}
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.75,
        delay: 0.25 + index * 0.07,
        ease: easeSoft,
      }}
      style={{
        rotate: baseRotate,
        rotateX: springTiltX,
        rotateY: springTiltY,
        x: springShiftX,
        y: springShiftY,
        transformPerspective: 900,
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileHover={{
        scale: 1.03,
        rotate: 0,
        boxShadow: "0 32px 110px rgba(0,0,0,1)",
        borderColor: "rgba(255,255,255,0.45)",
      }}
      whileTap={{ scale: 0.985 }}
    >
      <div className="relative h-full w-full overflow-hidden">
        {/* image */}
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover object-center transition-transform duration-[2200ms] ease-[cubic-bezier(0.25,0.8,0.4,1)] group-hover:scale-[1.06]"
        />

        {/* vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)]" />

        {/* subtle glass shimmer sweep */}
        <motion.div
          aria-hidden
          className="
            pointer-events-none absolute inset-0
            bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.35)_45%,transparent_80%)]
            mix-blend-screen
          "
          initial={{ x: "-140%", opacity: 0 }}
          animate={{ x: ["-140%", "10%", "140%"], opacity: [0, 1, 0] }}
          transition={{
            duration: 11 + index * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* month label */}
        <div className="pointer-events-none absolute left-5 top-4 z-10">
          <p className="font-inter text-[11px] uppercase tracking-[0.35em] text-gray-300/80">
            {post.month}
          </p>
        </div>

        {/* content overlay */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-5 pt-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
          <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.26em] text-gray-300">
            <span className="font-inter">{post.tag}</span>
            <span className="font-inter rounded-full border border-white/30 bg-black/60 px-3 py-1 text-[9px] tracking-[0.26em] text-gray-200">
              {post.readTime}
            </span>
          </div>

          <h2 className="font-playfair text-[15px] md:text-[17px] tracking-[0.05em] text-gray-50">
            {post.title}
          </h2>

          <p className="mt-2 font-inter text-[11px] md:text-[12px] leading-relaxed text-gray-300">
            {post.blurb}
          </p>

          <div className="mt-3 flex items-center gap-2 text-[10px] font-inter uppercase tracking-[0.26em] text-gray-300/90">
            <span>Read story</span>
            <span className="h-px w-6 bg-white/50" />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function BlogHeroMosaic() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Scroll-linked dimming
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end end"],
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.78]);
  const backgroundBlur = useTransform(scrollYProgress, [0, 1], [0, 3]);
  const blurFilter = useTransform(backgroundBlur, (v) => `blur(${v}px)`);
  // Mouse-driven ambient glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useSpring(mouseX, {
    stiffness: 80,
    damping: 18,
    mass: 0.5,
  });
  const glowY = useSpring(mouseY, {
    stiffness: 80,
    damping: 18,
    mass: 0.5,
  });

  const handleSectionMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    // Centered for nicer feel
    mouseX.set(relX - rect.width / 2);
    mouseY.set(relY - rect.height / 2);
  };

  const handleSectionLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleSectionMove}
      onMouseLeave={handleSectionLeave}
      className="
        w-full
        relative overflow-hidden
        bg-gradient-to-b from-[#050505] via-[#060606] to-[#050505]
        py-20 md:py-24
        text-gray-100
      "
    >
      {/* background vignette & texture */}
      <motion.div
        aria-hidden
        style={{ filter: blurFilter }}
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.035)_0,transparent_45%),
              radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0,transparent_60%)]
          opacity-80
        "
      />

      {/* big JOURNAL word in the back */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0 flex items-center justify-center
          text-[150px] md:text-[220px] lg:text-[260px]
          font-playfair tracking-[0.25em]
          text-white/25 blur-[3px]
        "
      >
        <span className="select-none">JOURNAL</span>
      </div>

      {/* ambient glow that tracks the mouse */}
      <motion.div
        aria-hidden
        style={{ translateX: glowX, translateY: glowY }}
        className="
          pointer-events-none absolute left-1/2 top-1/2
          h-72 w-72 -translate-x-1/2 -translate-y-1/2
          bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.16),transparent_70%)]
          opacity-60 blur-3xl
        "
      />

      <motion.div
        className="relative mx-auto max-w-6xl px-6 md:px-10"
        style={{ opacity: contentOpacity }}
      >
        {/* Heading / intro */}
        <div className="max-w-3xl space-y-4">
          <motion.p
            variants={textFade}
            custom={0}
            initial="hidden"
            animate="visible"
            className="font-inter text-[11px] uppercase tracking-[0.35em] text-gray-400"
          >
            Pullman Journal
          </motion.p>

          <motion.h1
            variants={textFade}
            custom={1}
            initial="hidden"
            animate="visible"
            className="font-playfair text-3xl md:text-4xl leading-tight tracking-[0.06em]"
          >
            Notes from the quieter side
            <br className="hidden md:block" /> of the hillside.
          </motion.h1>

          <motion.p
            variants={textFade}
            custom={2}
            initial="hidden"
            animate="visible"
            className="mt-2 font-inter text-sm md:text-[15px] text-gray-400 leading-relaxed max-w-xl"
          >
            A slow rotation of stories—late-night lobbies, fog over the bay, and
            the small design decisions that keep Aurelia Haven just a touch
            softer than the city below.
          </motion.p>
        </div>

        {/* Mosaic grid */}
        <div className="relative mt-10 md:mt-14">
          {/* soft base halo behind cluster */}
          <div
            aria-hidden
            className="
              pointer-events-none absolute left-1/2 top-1/2
              h-80 w-[70vw] -translate-x-1/2 -translate-y-1/2
              bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.16),transparent_65%)]
              opacity-70 blur-3xl
            "
          />

          <div
            className="
              relative z-10
              grid gap-4 md:gap-5
              grid-cols-2 lg:grid-cols-3
              auto-rows-[190px] md:auto-rows-[220px] lg:auto-rows-[240px]
            "
          >
            {featuredPosts.map((post, index) => (
              <MosaicCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
