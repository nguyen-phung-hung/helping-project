"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export function GlobalBackground() {
  const { scrollY } = useScroll();

  // Very subtle parallax shift of the glow
  const glowY = useTransform(scrollY, [0, 2000], [0, -120]);
  const glowOpacity = useTransform(scrollY, [0, 400, 1600], [0.4, 0.9, 0.45]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-20 bg-[#050505]"
    >
      {/* Grain layer */}
      <div className="absolute inset-0 bg-[url(/textures/aurelia-noise.png)] opacity-[0.45] mix-blend-soft-light bg-[length:220px_220px] bg-repeat" />

      {/* Parallax glow */}
      <motion.div
        className="absolute -inset-x-1 top-[-20%] h-[160%]
                   bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.18),_transparent_60%)]
                   blur-3xl"
        style={{ y: glowY, opacity: glowOpacity }}
      />

      {/* Vignette to keep edges dark and classy */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent,_rgba(0,0,0,0.9))]" />
    </div>
  );
}
