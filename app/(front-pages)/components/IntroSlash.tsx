// components/IntroOverlay.tsx
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "./Logo";

const INTRO_STORAGE_KEY = "ah:intro-last-shown";
const INTRO_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

const IntroOverlay = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const now = Date.now();
    const lastShownRaw = window.localStorage.getItem(INTRO_STORAGE_KEY);
    const lastShown = lastShownRaw ? Number(lastShownRaw) : 0;

    // If never shown or older than 15 minutes → show intro
    if (!lastShown || now - lastShown > INTRO_INTERVAL_MS) {
      setIsVisible(true);
      // Mark as shown *right away* so reloads within 15 min don't replay it
      window.localStorage.setItem(INTRO_STORAGE_KEY, String(now));
    }
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="intro-overlay"
          className="
            fixed inset-0 z-[9999] flex items-center justify-center
            bg-[#050505]
            bg-[radial-gradient(circle_at_center,#191919_0,#050505_55%,#000000_100%)]
          "
          initial={{ y: 0 }}
          animate={{ y: "-100vh" }}
          transition={{
            type: "spring",
            damping: 50,
            stiffness: 200,
            delay: 1.35,
          }}
          onAnimationComplete={() => setIsVisible(false)}
        >
          {/* Center stack: logo + name + line */}
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Logo */}
            <motion.div
              key="intro-logo"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Logo asLink={false} className="w-20 h-20" />
            </motion.div>

            {/* Name */}
            <motion.p
              key="intro-name"
              className="font-playfair text-xs md:text-sm tracking-[0.45em] uppercase text-gray-200"
              initial={{ opacity: 0, letterSpacing: "0.25em" }}
              animate={{ opacity: 1, letterSpacing: "0.45em" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
            >
              AURELIA HAVEN
            </motion.p>

            {/* Underline */}
            <motion.div
              key="intro-underline"
              className="h-px w-24 origin-center bg-gradient-to-r from-transparent via-white/50 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.25 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroOverlay;
