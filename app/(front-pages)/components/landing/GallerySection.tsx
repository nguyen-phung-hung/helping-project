"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { createPortal } from "react-dom";

type GalleryItem = {
  src: string;
  alt: string;
  label?: string;
};

const galleryItems: GalleryItem[] = [
  {
    src: "/gallery/gallery-1.jpg",
    alt: "Hotel lobby with warm evening lighting",
    label: "Lobby Lounge",
  },
  {
    src: "/gallery/gallery-2.jpg",
    alt: "Suite bedroom with city view",
    label: "Cityview Suite",
  },
  {
    src: "/gallery/gallery-3.jpg",
    alt: "Rooftop terrace at night",
    label: "Rooftop Terrace",
  },
  {
    src: "/gallery/gallery-4.jpg",
    alt: "Minimal bar with ambient light",
    label: "Aurelia Bar",
  },
  {
    src: "/gallery/gallery-5.jpg",
    alt: "Pool at dusk with reflections",
    label: "Pool at Dusk",
  },
  {
    src: "/gallery/gallery-6.jpg",
    alt: "Close-up of textures and decor",
    label: "Quiet Details",
  },
];

export default function GallerySection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure portal only runs on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleOpen = (index: number) => {
    setActiveIndex(index);
  };

  const handleClose = () => {
    setActiveIndex(null);
  };

  const goNext = () => {
    setActiveIndex((prev) => {
      if (prev === null) return 0;
      return (prev + 1) % galleryItems.length;
    });
  };

  const goPrev = () => {
    setActiveIndex((prev) => {
      if (prev === null) return galleryItems.length - 1;
      return (prev - 1 + galleryItems.length) % galleryItems.length;
    });
  };

  // 🔒 Lock/unlock scroll when lightbox is open
  useEffect(() => {
    if (!isClient) return;

    if (activeIndex !== null) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [activeIndex, isClient]);

  // 🎹 Arrow keys + Escape for navigation
  useEffect(() => {
    if (!isClient || activeIndex === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, isClient]);

  // 🔁 Variants for grid fade-in + stagger
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Lightbox content (portaled)
  const lightbox =
    activeIndex !== null ? (
      <AnimatePresence>
        <motion.div
          key={activeIndex}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose} // click background to close
        >
          {/* Inner container so clicking content doesn’t close */}
          <motion.div
            className="relative w-[90vw] max-w-4xl h-[70vh] md:h-[80vh] rounded-2xl overflow-hidden border border-white/20 bg-black/60"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image with subtle zoom-in on open */}
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.04, opacity: 0.98 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.02, opacity: 0.9 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Image
                src={galleryItems[activeIndex].src}
                alt={galleryItems[activeIndex].alt}
                fill
                className="object-contain"
              />
            </motion.div>

            {/* Top gradient bar */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/85 to-transparent" />

            {/* Top bar: label + close */}
            <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-playfair text-xs md:text-sm tracking-[0.22em] text-gray-200 uppercase">
                  {galleryItems[activeIndex].label || "Aurelia Haven"}
                </p>
                <p className="font-inter text-[11px] text-gray-400">
                  {galleryItems[activeIndex].alt}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="rounded-full border border-white/40 bg-black/60 px-3 py-1 text-xs font-inter uppercase tracking-[0.18em] text-gray-200 hover:bg-white hover:text-black transition-colors"
              >
                Close
              </button>
            </div>

            {/* Prev / Next buttons */}
            <div className="absolute inset-y-0 left-0 flex items-center">
              <motion.button
                type="button"
                onClick={goPrev}
                className="ml-3 md:ml-6 rounded-full border border-white/40 bg-black/40 px-3 py-2 text-[11px] font-inter uppercase tracking-[0.18em] text-gray-200 hover:bg-white hover:text-black transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Prev
              </motion.button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              <motion.button
                type="button"
                onClick={goNext}
                className="mr-3 md:mr-6 rounded-full border border-white/40 bg-black/40 px-3 py-2 text-[11px] font-inter uppercase tracking-[0.18em] text-gray-200 hover:bg-white hover:text-black transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Next
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    ) : null;

  return (
    <section id="gallery" className="relative w-full py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/[0.02] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/[0.02] to-transparent" />
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        {/* Header */}
        <div className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="font-playfair text-lg md:text-xl tracking-[0.3em] text-gray-300 uppercase">
              Gallery
            </h2>
            <div className="mt-4 h-px w-14 bg-white/15" />
          </div>
          <p className="font-inter text-xs md:text-sm text-gray-400 max-w-md leading-relaxed">
            A glimpse into Aurelia Haven — architecture, light, and quiet
            moments framed across our spaces.
          </p>
        </div>

        {/* Grid with fade-in + stagger */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 md:gap-8 md:grid-cols-3"
        >
          {galleryItems.map((item, index) => (
            <motion.button
              key={item.src}
              type="button"
              variants={itemVariants}
              onClick={() => handleOpen(index)}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] shadow-[0_18px_60px_rgba(0,0,0,0.7)] focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              {/* Frame with slow hover zoom image */}
              <div className="relative h-56 md:h-64 lg:h-72 overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="
                    object-cover object-center
                    transition-transform duration-500 group-hover:scale-105
                  "
                />
              </div>

              {/* Label */}
              {item.label && (
                <div className="flex items-center justify-between px-5 py-4">
                  <span className="font-playfair text-xs md:text-sm tracking-[0.18em] text-gray-200 uppercase">
                    {item.label}
                  </span>
                  <span className="font-inter text-[10px] tracking-[0.24em] text-gray-400 uppercase">
                    View
                  </span>
                </div>
              )}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Portal the lightbox to <body> so it's not inside SmoothScrollLayout */}
      {isClient && lightbox && createPortal(lightbox, document.body)}
    </section>
  );
}
