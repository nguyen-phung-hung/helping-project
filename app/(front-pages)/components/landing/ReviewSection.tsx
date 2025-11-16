"use client";

import {
  motion,
  useScroll,
  useSpring,
  useVelocity,
  useMotionValue,
  useTransform,
  useAnimationFrame,
  type Variants,
  type Transition,
} from "framer-motion";
import { useState } from "react";

// Simple wrap helper: wrap value v into [min, max)
function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

type Review = {
  name: string;
  role: string;
  stay: string;
  text: string;
  avatar?: string;
};

const reviewsRow1: Review[] = [
  {
    name: "Elena M.",
    role: "Creative Director",
    stay: "Penthouse Loft",
    text: "The kind of quiet luxury that doesn’t try too hard. Every line, every material felt intentional.",
  },
  {
    name: "James R.",
    role: "Product Designer",
    stay: "Signature Suite",
    text: "Woke up to soft city light filtered through the sheer curtains. It felt like staying inside a photograph.",
  },
  {
    name: "Sora K.",
    role: "Architect",
    stay: "Cityview Studio",
    text: "Minimal, warm, and beautifully edited. Nothing unnecessary, everything considered.",
  },
];

const reviewsRow2: Review[] = [
  {
    name: "Lucas V.",
    role: "Film Producer",
    stay: "Penthouse Loft",
    text: "Even the hallways felt cinematic. Aurelia Haven made the city outside feel very far away.",
  },
  {
    name: "Amira T.",
    role: "Art Curator",
    stay: "Signature Suite",
    text: "I loved the textures—linen, stone, glass, and light. It felt like living inside a gallery.",
  },
  {
    name: "Noah L.",
    role: "Entrepreneur",
    stay: "Cityview Studio",
    text: "Seamless digital check-in, calm interiors, and a bed you never want to leave.",
  },
];

// Typed easing tuple so TS is happy
const LUX_EASE: [number, number, number, number] = [0.22, 0.55, 0.36, 1];

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: LUX_EASE,
    },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: LUX_EASE },
  },
};

const cardHoverTransition: Transition = {
  duration: 0.5,
  ease: LUX_EASE,
};

type ReviewsMarqueeRowProps = {
  reviews: Review[];
  direction: 1 | -1;
  speedMultiplier: number;
};

function ReviewsMarqueeRow({
  reviews,
  direction,
  speedMultiplier,
}: ReviewsMarqueeRowProps) {
  const [isHovered, setIsHovered] = useState(false);

  const baseX = useMotionValue(0);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 40,
    stiffness: 160,
    mass: 0.4,
  });

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    const v = smoothVelocity.get();

    // Normalize scroll velocity to subtle boost
    const clamped = Math.max(-1500, Math.min(1500, v));
    const boost = clamped / 3000; // around -0.5 → 0.5

    const baseSpeed = 0.02 * speedMultiplier;
    const moveBy = (baseSpeed + boost * 0.06) * direction * (delta / 16.67); // frame time normalized

    if (!isHovered) {
      baseX.set(baseX.get() + moveBy);
    }
  });

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fade mask edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black via-black/40 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black via-black/40 to-transparent" />

      <motion.div style={{ x }} className="flex gap-6 md:gap-8">
        {/* Duplicate content for seamless loop */}
        {[...reviews, ...reviews].map((review, idx) => (
          <motion.article
            key={`${review.name}-${idx}`}
            className="relative min-w-[260px] max-w-xs md:min-w-[300px] md:max-w-sm rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-6 md:px-7 md:py-7 shadow-[0_22px_60px_rgba(0,0,0,0.75)] backdrop-blur-md"
            whileHover={{
              scale: 1.03,
              y: -6,
            }}
            transition={cardHoverTransition}
          >
            {/* 5-star rating pills */}
            <div className="mb-4 flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[7px] w-[11px] rounded-full bg-gradient-to-r from-gray-200 to-gray-400"
                />
              ))}
            </div>

            <p className="font-inter text-[13px] md:text-sm leading-relaxed text-gray-200/90 mb-5">
              {review.text}
            </p>

            <div className="mt-auto flex items-center justify-between gap-3 pt-2">
              <div className="flex flex-col">
                <span className="font-playfair text-[13px] tracking-[0.18em] uppercase text-gray-100">
                  {review.name}
                </span>
                <span className="font-inter text-[11px] uppercase tracking-[0.18em] text-gray-400">
                  {review.role}
                </span>
              </div>
              <div className="text-right">
                <span className="font-inter text-[10px] uppercase tracking-[0.2em] text-gray-400">
                  Stayed in
                </span>
                <div className="font-inter text-[11px] uppercase tracking-[0.18em] text-gray-200">
                  {review.stay}
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </div>
  );
}

export default function ReviewSection() {
  return (
    <section id="reviews" className="relative w-full py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/[0.02] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/[0.02] to-transparent" />
      <motion.div
        className="mx-auto max-w-6xl px-6 md:px-10"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        {/* Header */}
        <motion.div
          variants={headerVariants}
          className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-5"
        >
          <div>
            <h2 className="font-playfair text-lg md:text-xl tracking-[0.3em] text-gray-300 uppercase">
              Guest Experiences
            </h2>
            <div className="mt-4 h-px w-16 bg-white/20" />
          </div>
          <p className="font-inter text-xs md:text-sm text-gray-400 max-w-md leading-relaxed">
            A quiet collection of five-star reflections from guests who chose
            Aurelia Haven as their city retreat.
          </p>
        </motion.div>

        {/* Two marquee rows with parallax feel */}
        <div className="space-y-8 md:space-y-10">
          <ReviewsMarqueeRow
            reviews={reviewsRow1}
            direction={1}
            speedMultiplier={1}
          />
          <ReviewsMarqueeRow
            reviews={reviewsRow2}
            direction={-1}
            speedMultiplier={0.7}
          />
        </div>
      </motion.div>
    </section>
  );
}
