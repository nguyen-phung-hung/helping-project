"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";

export default function FloatingContactButton() {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.8, 0.4, 1] }}
      whileHover={{
        scale: 1.06,
        y: -4,
        boxShadow: "0 16px 40px rgba(255,255,255,0.25)",
      }}
      whileTap={{ scale: 0.94 }}
      onClick={() => {
        window.location.href = "tel:+1234567890"; // CHANGE THIS NUMBER
      }}
      className="
        fixed bottom-6 right-6 z-[999]
        h-14 w-14 rounded-full
        flex items-center justify-center
        backdrop-blur-md bg-white/10
        border border-white/20
        shadow-[0_8px_30px_rgba(0,0,0,0.4)]
        cursor-pointer
      "
    >
      {/* glow behind */}
      <span className="absolute inset-0 rounded-full bg-white/20 blur-xl opacity-40" />

      <Phone className="relative z-10 h-6 w-6 text-white" strokeWidth={1.5} />
    </motion.button>
  );
}
