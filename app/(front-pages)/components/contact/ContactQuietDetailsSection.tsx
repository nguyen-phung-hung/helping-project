"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from "framer-motion";

const easeSoft: [number, number, number, number] = [0.25, 0.8, 0.4, 1];

export default function ContactQuietDetailsSection() {
  const cardRef = useRef<HTMLDivElement | null>(null);

  // scroll parallax for the right card
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 80%", "end 20%"],
  });
  const cardY = useTransform(scrollYProgress, [0, 1], [20, -10]);

  // mouse tilt for the map card
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springX = useSpring(tiltX, { stiffness: 120, damping: 20, mass: 0.5 });
  const springY = useSpring(tiltY, { stiffness: 120, damping: 20, mass: 0.5 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    tiltX.set(y * -10);
    tiltY.set(x * 12);
  };

  const handleLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <section
      className="
      h-screen
    relative overflow-hidden w-full
    bg-gradient-to-b from-[#050505] via-[#050505] to-[#050505]
              /* NEW: gap from the section above */
    py-16 md:py-20
    text-gray-100
  "
    >
      {/* faint divider halo at top */}
      {/* <div
        aria-hidden
        className="
        pointer-events-none absolute inset-x-0 top-0 h-24
        bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_65%)]
      "
      /> */}

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 pt-4 md:flex-row md:items-center md:px-10 md:pt-6">
        {/* LEFT: quiet details list */}
        <div className="md:w-[52%] space-y-6">
          <div className="space-y-3">
            <p className="font-inter text-[11px] uppercase tracking-[0.35em] text-gray-500">
              Quiet details
            </p>
            <h3 className="font-playfair text-2xl md:text-3xl tracking-[0.06em]">
              Other ways to reach Aurelia.
            </h3>
            <p className="font-inter text-sm md:text-[15px] leading-relaxed text-gray-400 max-w-xl">
              Prefer to call ahead, send a note, or arrive with a driver? These
              are the lines we keep the calmest.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                label: "Address",
                value: "Aurelia Haven, Hillside Avenue 17, Da Nang",
                hint: "Best entered as “Aurelia Haven” in ride apps.",
              },
              {
                label: "Concierge line",
                value: "+84 (0) 236 000 000",
                hint: "Daily, 8:00 – 23:00 (local time).",
              },
              {
                label: "Email",
                value: "concierge@aureliahaven.com",
                hint: "We reply within one business day.",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="
                  relative overflow-hidden rounded-[999px]
                  border border-white/10 bg-white/[0.015]
                  px-4 py-3 md:px-5 md:py-3.5
                  shadow-[0_16px_50px_rgba(0,0,0,0.9)]
                "
              >
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_55%)] opacity-70" />
                <div className="relative flex flex-col">
                  <span className="font-inter text-[10px] uppercase tracking-[0.26em] text-gray-400">
                    {item.label}
                  </span>
                  <span className="font-inter text-sm md:text-[15px] text-gray-50">
                    {item.value}
                  </span>
                  <span className="font-inter text-[11px] text-gray-500 mt-0.5">
                    {item.hint}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: abstract map / location card */}
        <motion.div
          ref={cardRef}
          style={{ y: cardY }}
          className="md:w-[48%] flex justify-center md:justify-end"
        >
          <motion.div
            className="
              relative w-full max-w-md
              overflow-hidden rounded-[30px]
              border border-white/12 bg-white/[0.02]
              shadow-[0_26px_90px_rgba(0,0,0,0.95)]
              backdrop-blur-[3px]
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
              boxShadow: "0 32px 110px rgba(0,0,0,1)",
            }}
            transition={{ duration: 0.6, ease: easeSoft }}
          >
            <div className="relative h-[240px] w-full overflow-hidden">
              {/* abstract “map” gradient */}
              <div
                className="
                  absolute inset-0
                  bg-[radial-gradient(circle_at_20%_10%,#ffffff22,transparent_55%),
                      radial-gradient(circle_at_80%_80%,#c5a36d33,transparent_60%),
                      radial-gradient(circle_at_10%_80%,#ffffff11,transparent_55%)]
                "
              />
              {/* subtle grid lines */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[length:36px_36px]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[length:36px_36px]" />
              </div>

              {/* pin + shimmer ring */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="relative"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: easeSoft }}
                >
                  {/* glow ring */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0.4, scale: 0.7 }}
                    animate={{ opacity: [0.4, 0, 0.4], scale: [0.7, 1.2, 0.7] }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: easeSoft,
                    }}
                  >
                    <div className="h-16 w-16 rounded-full border border-white/40 blur-[1px]" />
                  </motion.div>
                  {/* pin */}
                  <div
                    className="
                      relative h-7 w-7 rounded-full
                      bg-[radial-gradient(circle_at_30%_20%,#ffffff,rgba(255,255,255,0.35))]
                      shadow-[0_0_25px_rgba(255,255,255,0.65)]
                    "
                  >
                    <div className="absolute inset-0 rounded-full border border-white/70/80" />
                  </div>
                </motion.div>
              </div>

              {/* bottom labels */}
              <div className="absolute inset-x-0 bottom-0 px-5 pb-5 pt-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                <p className="font-inter text-[10px] uppercase tracking-[0.26em] text-gray-400">
                  Location · Hillside above the bay
                </p>
                <p className="mt-1 font-inter text-xs text-gray-300 max-w-xs">
                  Five minutes from the shoreline, one turn off the main avenue.
                  Most drivers know it simply as &ldquo;the quiet hotel on the
                  hill.&rdquo;
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
