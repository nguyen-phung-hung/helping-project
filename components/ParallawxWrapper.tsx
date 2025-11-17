"use client";

import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef, ReactNode } from "react";

type ParallaxWrapperProps = {
  children: ReactNode;
  /**
   * How far (in px) the element moves over its scroll range.
   * Bigger = stronger / “faster” parallax.
   * Positive = move up on scroll; negative = move down.
   */
  amount?: number;
  className?: string;
  variants?: Variants;
};

export function ParallaxWrapper({
  children,
  amount = 80,
  className,
  variants,
}: ParallaxWrapperProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Scroll progress for THIS element only
  const { scrollYProgress } = useScroll({
    target: ref,
    // start when element enters bottom of viewport,
    // end when it leaves top
    offset: ["start end", "end start"],
  });

  // Map scroll progress -> vertical transform
  // at the bottom: y = +amount, at the top: y = -amount
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={className}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
