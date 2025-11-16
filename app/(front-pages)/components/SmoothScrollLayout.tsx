"use client";

import React from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

interface SmoothScrollLayoutProps {
  /** Full page content, usually multiple full-height sections */
  children: React.ReactNode;
  /** How many “screens” tall your scroll should be (e.g. 3 = 300vh) */
  pages?: number;
}

const SmoothScrollLayout: React.FC<SmoothScrollLayoutProps> = ({
  children,
  pages = 3,
}) => {
  const { scrollY } = useScroll();

  // Spring-smooth the scroll value
  const smoothY = useSpring(scrollY, {
    stiffness: 100,
    damping: 25,
    mass: 0.3,
  });

  // Invert it so content moves opposite to scroll
  const y = useTransform(smoothY, (value) => -value);

  return (
    <div
      className="relative"
      // total scrollable height (e.g. 3 * 100vh = 300vh)
      style={{ height: `${pages * 100}vh` }}
    >
      <motion.div style={{ y }} className="fixed inset-0 will-change-transform">
        {children}
      </motion.div>
    </div>
  );
};

export default SmoothScrollLayout;
