"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";

const easeSoft: [number, number, number, number] = [0.25, 0.8, 0.4, 1];

type StoryEvent = {
  year: string;
  label: string;
  title: string;
  body: string;
  image: string;
};

type Point = { x: number; y: number };

const storyEvents: StoryEvent[] = [
  {
    year: "2014",
    label: "Sketches & hillside",
    title: "A quiet slope above the avenue.",
    body: "Before Pullman had a name, there was only a hillside above the main avenue where the city hum fell away. A place where the view wasn’t yet famous, but the air felt like the first deep breath after a long day.",
    image: "/gallery/pool-dusk.jpg",
  },
  {
    year: "2016",
    label: "Site chosen",
    title: "Light mapped, trees kept.",
    body: "Rather than clearing the hillside, the design traced where evening light landed and which trees cast the gentlest shadows. Corridors, suites, and terraces were placed around these lines, not over them.",
    image: "/gallery/detail-texture.jpg",
  },
  {
    year: "2019",
    label: "Build in quiet phases",
    title: "Construction kept off-stage.",
    body: "Most of the structure rose at night, when the neighborhood rested. Heavy work was staged inwards, keeping the street oddly calm. Neighbors remember hearing more wind in the trees than machines.",
    image: "/gallery/rooftop-night.jpg",
  },
  {
    year: "2023",
    label: "Doors open",
    title: "A hotel that edits out the noise.",
    body: "Pullman Danang opened with fewer rooms than planned and more corners left empty on purpose. The building is still tuned softly over time—light levels, textures, and even scents adjusted to stay one step quieter than the city below.",
    image: "/gallery/lobby-evening.jpg",
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.08,
      ease: easeSoft,
    },
  }),
};

export default function AboutStoryOfAurelia() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  });

  // Cards gently dim toward the end
  const contentOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.82]);

  // Ambient halo that follows the orb vertically
  const haloY = useTransform(scrollYProgress, [0, 1], ["10%", "80%"]);

  // Subtle “camera tilt” on the cards column
  const cameraTilt = useTransform(scrollYProgress, [0, 0.5, 1], [-1.2, 0, 1.2]);

  const [orbPos, setOrbPos] = useState<Point>({ x: 0, y: 0 });
  const [dotPoints, setDotPoints] = useState<Point[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const totalLength = path.getTotalLength();
    setPathLength(totalLength);

    const segments = storyEvents.length - 1 || 1;

    // Precompute dot positions
    const dots: Point[] = storyEvents.map((_, idx) => {
      const t = segments === 0 ? 0 : idx / segments;
      const p = path.getPointAtLength(totalLength * t);
      return { x: p.x, y: p.y };
    });
    setDotPoints(dots);

    const unsubscribe = scrollYProgress.on("change", (v) => {
      const point = path.getPointAtLength(totalLength * v);
      setOrbPos({ x: point.x, y: point.y });

      const idx = Math.round(v * segments);
      setActiveIndex(Math.min(Math.max(idx, 0), segments));
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  const orbX = orbPos.x || 60;
  const orbY = orbPos.y || 20;

  // Ribbon glow: a dash moving along the spine
  const ribbonOffset = useTransform(scrollYProgress, (v) =>
    pathLength ? pathLength * (1 - v) : 0
  );

  // Global parallax for cards (left vs right)
  const parallaxBase = useTransform(scrollYProgress, (v) => (v - 0.5) * 14);
  const parallaxOpposite = useTransform(parallaxBase, (v) => -v);

  return (
    <section
      className="
        relative overflow-hidden
        bg-gradient-to-b from-[#050505] via-[#070707] to-[#050505]
        py-24 md:py-28
        text-gray-100
      "
    >
      {/* base soft glow at top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05)_0,rgba(0,0,0,0.96)_55%,#000_100%)]"
      />

      {/* halo that tracks the orb vertically */}
      <motion.div
        aria-hidden
        style={{ y: haloY }}
        className="
          pointer-events-none absolute left-1/2 top-0
          h-64 w-[80vw] -translate-x-1/2
          bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_70%)]
          opacity-30 blur-3xl
        "
      />

      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        {/* Heading */}
        <div className="max-w-3xl space-y-4">
          <p className="font-inter text-[11px] uppercase tracking-[0.35em] text-gray-400">
            Story of Pullman
          </p>
          <h2 className="font-playfair text-3xl md:text-4xl leading-tight tracking-[0.06em]">
            How a quiet hillside
            <br className="hidden md:block" /> became Pullman Danang.
          </h2>
          <p className="mt-4 font-inter text-sm md:text-[15px] text-gray-400 leading-relaxed max-w-xl">
            A slow vertical walk through the years—from the first sketches on
            tracing paper to the way the building edits out the city noise
            today.
          </p>
        </div>

        {/* Timeline */}
        <div
          ref={sectionRef}
          className="relative mt-14 flex flex-col md:flex-row md:gap-10"
        >
          {/* Spine + orb */}
          <div className="pointer-events-none absolute inset-0 flex justify-center">
            <svg
              className="h-full"
              viewBox="0 0 120 800"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="spineGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.55)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.18)" />
                </linearGradient>

                {/* orb core gradient for glassy feel */}
                <radialGradient id="orbCoreGradient">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="55%" stopColor="#f7f7f7" />
                  <stop offset="100%" stopColor="#dcdcdc" />
                </radialGradient>
              </defs>

              {/* snake path */}
              <path
                ref={pathRef}
                d="
                  M60 20
                  C 60 120, 25 170, 40 260
                  C 60 340, 95 390, 80 480
                  C 60 560, 25 610, 38 700
                  C 55 760, 75 790, 75 790
                "
                fill="none"
                stroke="url(#spineGradient)"
                strokeWidth={1.4}
                strokeLinecap="round"
              />

              {/* ribbon glow along the spine */}
              {pathLength > 0 && (
                <motion.path
                  d="
                    M60 20
                    C 60 120, 25 170, 40 260
                    C 60 340, 95 390, 80 480
                    C 60 560, 25 610, 38 700
                    C 55 760, 75 790, 75 790
                  "
                  fill="none"
                  stroke="rgba(255,255,255,0.75)"
                  strokeWidth={1.7}
                  strokeLinecap="round"
                  strokeDasharray={pathLength}
                  strokeDashoffset={ribbonOffset}
                  style={{ filter: "blur(0.6px)" }}
                />
              )}

              {/* dots for each event */}
              {dotPoints.map((pt, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <g key={`dot-${idx}`}>
                    <motion.circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isActive ? 3.6 : 2.4}
                      fill="white"
                      animate={
                        isActive
                          ? { r: [3.4, 4.1, 3.4] }
                          : { r: 2.4, opacity: 0.85 }
                      }
                      transition={
                        isActive
                          ? {
                              duration: 1.4,
                              repeat: Infinity,
                              ease: easeSoft,
                            }
                          : {}
                      }
                    />
                    {isActive && (
                      <motion.circle
                        cx={pt.x}
                        cy={pt.y}
                        r={8}
                        fill="none"
                        stroke="rgba(255,255,255,0.5)"
                        strokeWidth={0.7}
                        initial={{ opacity: 0.45, r: 3 }}
                        animate={{ opacity: 0, r: 11 }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: easeSoft,
                        }}
                      />
                    )}
                  </g>
                );
              })}

              {/* glassy orb with shimmer */}
              <motion.g
                transform={`translate(${orbX}, ${orbY})`}
                animate={{ rotate: [-10, 8, -10] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {/* outer glow */}
                <circle
                  r={10}
                  fill="rgba(255,255,255,0.45)"
                  style={{ filter: "blur(6px)" }}
                />
                {/* core */}
                <motion.circle
                  r={4.8}
                  fill="url(#orbCoreGradient)"
                  animate={{
                    scale: [1, 1.12, 1],
                    opacity: [0.95, 1, 0.95],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: easeSoft,
                  }}
                />
                {/* specular highlight sweep (shimmer) */}
                <motion.ellipse
                  rx={3.6}
                  ry={1.5}
                  cy={-2}
                  fill="rgba(255,255,255,0.9)"
                  style={{ filter: "blur(1px)" }}
                  animate={{ x: [-1.6, 1.6, -1.6] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.g>
            </svg>
          </div>

          {/* Cards column with tilt + parallax */}
          <motion.div
            style={{ opacity: contentOpacity, rotateZ: cameraTilt }}
            className="relative w-full"
          >
            <div className="relative space-y-10 md:space-y-16">
              {storyEvents.map((event, index) => {
                const isLeft = index % 2 === 0;
                const isActive = index === activeIndex;

                return (
                  <motion.article
                    key={event.year}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className={`
                      relative max-w-xl
                      ${isLeft ? "md:mr-auto md:ml-0" : "md:ml-auto md:mr-0"}
                      ${index !== 0 ? "-mt-2 md:-mt-4" : ""}
                    `}
                    style={{
                      zIndex: storyEvents.length - index,
                      y: isLeft ? parallaxBase : parallaxOpposite,
                    }}
                  >
                    <motion.div
                      className="
                        overflow-hidden rounded-[26px]
                        border bg-white/[0.02]
                        border-white/10
                        shadow-[0_24px_80px_rgba(0,0,0,0.95)]
                        backdrop-blur-[2px]
                        transition-all
                      "
                      animate={
                        isActive
                          ? {
                              y: -4,
                              boxShadow: "0 30px 100px rgba(0,0,0,1)",
                              borderColor: "rgba(255,255,255,0.42)",
                            }
                          : {
                              y: 0,
                              boxShadow: "0 24px 80px rgba(0,0,0,0.9)",
                              borderColor: "rgba(255,255,255,0.1)",
                            }
                      }
                      transition={{ duration: 0.6, ease: easeSoft }}
                    >
                      {/* image */}
                      <div className="relative h-[230px] w-full overflow-hidden">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover object-center transition-transform duration-[2200ms] ease-[cubic-bezier(0.25,0.8,0.4,1)]"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.65)_100%)]" />
                      </div>

                      {/* copy */}
                      <div className="relative px-6 pb-6 pt-4 md:px-7 md:pb-7 md:pt-5">
                        <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.26em] text-gray-400">
                          <span className="font-inter">{event.label}</span>
                          <span
                            className={`
                              font-inter rounded-full border px-3 py-1
                              text-[10px] tracking-[0.26em]
                              ${
                                isActive
                                  ? "border-white/70 bg-white/10 text-gray-50"
                                  : "border-white/20 bg-black/40 text-gray-400"
                              }
                            `}
                          >
                            {event.year}
                          </span>
                        </div>

                        <h3 className="font-playfair text-lg md:text-xl tracking-[0.05em] text-gray-100">
                          {event.title}
                        </h3>

                        <p className="mt-3 font-inter text-sm md:text-[15px] leading-relaxed text-gray-400">
                          {event.body}
                        </p>
                      </div>
                    </motion.div>
                  </motion.article>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
