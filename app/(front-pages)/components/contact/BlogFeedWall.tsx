"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  //   useMotionTemplate,
  type Variants,
} from "framer-motion";

const easeSoft: [number, number, number, number] = [0.25, 0.8, 0.4, 1];

type FeedPost = {
  slug: string;
  category: "Design" | "Stays" | "Neighborhood";
  month: string;
  readTime: string;
  title: string;
  blurb: string;
  image: string;
  layout: "small" | "medium" | "wide";
};

const feedPosts: FeedPost[] = [
  {
    slug: "/blog/night-checkin",
    category: "Stays",
    month: "FEB",
    readTime: "3 min",
    title: "Late check-in, softer lobby.",
    blurb: "Why arrivals after midnight get the quietest version of the hotel.",
    image: "/gallery/lobby-evening.jpg",
    layout: "medium",
  },
  {
    slug: "/blog/bay-fog",
    category: "Neighborhood",
    month: "FEB",
    readTime: "4 min",
    title: "When the bay fog climbs the hill.",
    blurb: "How the view disappears first, and then every other sound.",
    image: "/gallery/room-cityview.jpg",
    layout: "wide",
  },
  {
    slug: "/blog/hide-the-tech",
    category: "Design",
    month: "JAN",
    readTime: "5 min",
    title: "Designing rooms that hide the tech.",
    blurb: "Screens, switches, and charging without the glow.",
    image: "/gallery/detail-texture.jpg",
    layout: "small",
  },
  {
    slug: "/blog/pool-surface",
    category: "Design",
    month: "JAN",
    readTime: "3 min",
    title: "Why the pool is never quite still.",
    blurb: "Tiny edge overflows that erase footsteps from the water.",
    image: "/gallery/pool-dusk.jpg",
    layout: "medium",
  },
  {
    slug: "/blog/upper-slope",
    category: "Neighborhood",
    month: "DEC",
    readTime: "4 min",
    title: "Walking home along the upper slope.",
    blurb: "The quiet route back from the bay after dinner.",
    image: "/gallery/rooftop-night.jpg",
    layout: "medium",
  },
  {
    slug: "/blog/linen-sound",
    category: "Stays",
    month: "DEC",
    readTime: "2 min",
    title: "The sound of fresh linen.",
    blurb: "Why we changed the carts before we changed the sheets.",
    image: "/gallery/bar-detail.jpg",
    layout: "small",
  },
];

const tabLabels = ["All", "Design", "Stays", "Neighborhood"] as const;
type TabLabel = (typeof tabLabels)[number];

const tabFade: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.05 * i, ease: easeSoft },
  }),
};

/* ---------- INDIVIDUAL CARD WITH IMAGE PARALLAX + GLOW ---------- */

function FeedCard({ post, index }: { post: FeedPost; index: number }) {
  const imgX = useMotionValue(0);
  const imgY = useMotionValue(0);

  const springX = useSpring(imgX, { stiffness: 140, damping: 18, mass: 0.35 });
  const springY = useSpring(imgY, { stiffness: 140, damping: 18, mass: 0.35 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    const xNorm = relX / rect.width - 0.5;
    const yNorm = relY / rect.height - 0.5;

    // small offset so it feels subtle
    imgX.set(xNorm * 14);
    imgY.set(yNorm * 14);
  };

  const handleLeave = () => {
    imgX.set(0);
    imgY.set(0);
  };

  const spanClasses =
    post.layout === "wide"
      ? "col-span-2"
      : post.layout === "medium"
      ? "row-span-2"
      : "";

  return (
    <motion.article
      key={post.slug}
      className={`
        w-full
        group relative overflow-hidden
        rounded-[24px] border border-white/10 bg-white/[0.02]
        shadow-[0_18px_70px_rgba(0,0,0,0.9)] cursor-pointer
        ${spanClasses}
      `}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{
        duration: 0.6,
        delay: 0.06 * index,
        ease: easeSoft,
      }}
      whileHover={{
        y: -6,
        rotateX: -3,
        rotateY: 3,
        boxShadow: "0 28px 100px rgba(0,0,0,1)",
        borderColor: "rgba(255,255,255,0.45)",
      }}
      style={{ transformPerspective: 900 }}
      whileTap={{ scale: 0.97 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {/* ambient glow behind card on hover */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -inset-[18%]
          rounded-[32px]
          bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.25),transparent_60%)]
          opacity-0 blur-[32px]
          transition-opacity duration-500
          group-hover:opacity-100
        "
      />

      <div className="relative h-full w-full overflow-hidden">
        {/* parallax image */}
        <motion.div
          className="absolute inset-0"
          style={{ x: springX, y: springY }}
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover object-center"
          />
        </motion.div>

        {/* vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.88)_100%)]" />

        {/* top labels */}
        <div className="absolute left-4 right-4 top-3 flex items-center justify-between text-[10px] uppercase tracking-[0.26em] text-gray-300">
          <span className="font-inter">{post.month}</span>
          <span className="font-inter rounded-full border border-white/30 bg-black/70 px-2.5 py-1 text-[9px]">
            {post.readTime}
          </span>
        </div>

        {/* bottom copy */}
        <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-8 bg-gradient-to-t from-black/80 via-black/25 to-transparent">
          <p className="font-inter text-[10px] uppercase tracking-[0.26em] text-gray-300/90 mb-1">
            {post.category}
          </p>
          <h3 className="font-playfair text-[14px] md:text-[15px] tracking-[0.04em] text-gray-50">
            {post.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 font-inter text-[11px] text-gray-300">
            {post.blurb}
          </p>

          <div className="mt-3 flex items-center gap-2 text-[9px] uppercase tracking-[0.26em] text-gray-200/90">
            <span>Read story</span>
            <span className="h-px w-5 bg-white/60" />
            <motion.span
              className="translate-y-[0.5px]"
              initial={{ x: 0 }}
              whileHover={{ x: 3 }}
              transition={{ duration: 0.3, ease: easeSoft }}
            >
              ↗
            </motion.span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ---------- WHOLE SECTION (SPOTLIGHT + FILTER TABS + GRID) ---------- */

export default function BlogFeedWall() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  const [activeTab, setActiveTab] = useState<TabLabel>("All");

  // scroll dim + slight scale
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 10%"],
  });

  const wallOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const wallScale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);

  // spotlight across full grid
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  //   const spotX = useSpring(mouseX, { stiffness: 140, damping: 18, mass: 0.35 });
  //   const spotY = useSpring(mouseY, { stiffness: 140, damping: 18, mass: 0.35 });

  //   const spotlight = useMotionTemplate`
  //     radial-gradient(
  //       circle at ${spotX}px ${spotY}px,
  //       rgba(255,255,255,0.16),
  //       transparent 60%
  //     )
  //   `;

  useEffect(() => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    mouseX.set(rect.width / 2);
    mouseY.set(rect.height / 2);
  }, [mouseX, mouseY]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    mouseX.set(rect.width / 2);
    mouseY.set(rect.height / 2);
  };

  const filteredPosts =
    activeTab === "All"
      ? feedPosts
      : feedPosts.filter((post) => post.category === activeTab);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#050505] py-18 md:py-24 text-gray-100"
    >
      {/* global subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_right,rgba(255,255,255,0.02)_0,rgba(255,255,255,0.02)_1px,transparent_1px,transparent_30px),repeating-linear-gradient(to_bottom,rgba(255,255,255,0.02)_0,rgba(255,255,255,0.02)_1px,transparent_1px,transparent_30px)] opacity-40"
      />

      {/* spotlight following mouse across the whole grid area */}
      {/* <motion.div
        aria-hidden
        style={{ backgroundImage: spotlight, opacity: wallOpacity }}
        className="pointer-events-none absolute inset-[-20%] mix-blend-screen"
      /> */}

      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        {/* heading + tabs */}
        <div className="mb-8 flex flex-col gap-6 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <motion.h2
              className="font-playfair text-2xl md:text-3xl tracking-[0.06em]"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: easeSoft }}
            >
              Latest notes from the journal.
            </motion.h2>
            <motion.p
              className="max-w-md font-inter text-sm md:text-[15px] text-gray-400 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.65, ease: easeSoft, delay: 0.08 }}
            >
              Browse by mood: design details, stays, and the streets just below
              the hillside.
            </motion.p>
          </div>

          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.02] p-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            {tabLabels.map((label, i) => {
              const isActive = activeTab === label;
              return (
                <motion.button
                  key={label}
                  variants={tabFade}
                  custom={i}
                  type="button"
                  onClick={() => setActiveTab(label)}
                  className={`
                    rounded-full px-3.5 py-1.5 text-[10px] md:text-[11px]
                    uppercase tracking-[0.24em] transition
                    ${
                      isActive
                        ? "bg-white text-black"
                        : "text-gray-300 hover:bg-white/5"
                    }
                  `}
                >
                  {label}
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        {/* full-width grid (no enclosing box) */}
        <motion.div
          ref={gridRef}
          style={{ opacity: wallOpacity, scale: wallScale }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="
            relative z-10
            grid gap-3.5 md:gap-5
            grid-cols-2 md:grid-cols-3 lg:grid-cols-4
            auto-rows-[150px] md:auto-rows-[180px] lg:auto-rows-[200px]
          "
        >
          {filteredPosts.map((post, idx) => (
            <FeedCard key={post.slug + idx} post={post} index={idx} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
