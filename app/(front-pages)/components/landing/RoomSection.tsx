"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ParallaxWrapper } from "@/components/ParallawxWrapper";
import { type Variants } from "framer-motion";
import { useRouter } from "next/navigation";

const rooms = [
  {
    name: "“Tết Sum Vầy Bên Biển”",
    slug: "tet-family-escape",
    image: "/rooms/cityview-studio.jpg", // reuse existing image
    headline: "Family Package",
    subheading: "TẾT FAMILY ESCAPE",
    description:
      "A 3-day, 2-night getaway for 2 adults + 1 child, including a Family Suite, Tết family dinner, Kids Club activities, babysitting, and Hội An shuttle.",
    valueLines: [
      "Individually: ~32,000,000 VND",
      "Package: 28,800,000 VND",
      "Early Bird: 27,200,000 VND (save up to 4.8M)",
    ],
  },
  {
    name: "“Tết Love Escape”",
    slug: "tet-couple-escape",
    image: "/rooms/front.jpg",
    headline: "Couple Package",
    subheading: "ROMANTIC TẾT GETAWAY",
    description:
      "A 3-day, 2-night stay in a Deluxe Room with a private beach dinner, couple spa treatment, and romantic in-room decoration.",
    valueLines: [
      "Individually: ~15,500,000 VND",
      "Package: 13,950,000 VND",
      "Early Bird: 13,250,000 VND (save up to 2.25M)",
    ],
  },
  {
    name: "“Tết Sang Xịn – Chill Từ Sáng Đến Đêm”",
    slug: "tet-genz-lux",
    image: "/rooms/penthouse-loft.jpg",
    headline: "Gen Z Lux Package",
    subheading: "GEN Z LUXURY EXPERIENCE",
    description:
      "A 3-day, 2-night Superior Room stay with floating breakfast, mixology class, watersports access, and F&B credit.",
    valueLines: [
      "Individually: ~11,900,000 VND",
      "Package: 10,710,000 VND",
      "Early Bird: 10,115,000 VND",
    ],
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function RoomsSection() {
  const { push } = useRouter();

  return (
    <section id="rooms" className="relative w-full py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/[0.02] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/[0.02] to-transparent" />
      <div className="mx-auto max-w-6xl px-6">
        {/* Section heading */}
        <motion.div
          className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <div>
            <h2 className="font-playfair text-lg md:text-xl tracking-[0.3em] text-gray-300 uppercase">
              Rooms & Suites
            </h2>
            <div className="mt-4 h-px w-14 bg-white/15" />
          </div>
          <p className="font-inter text-xs md:text-sm text-gray-400 max-w-md leading-relaxed">
            Three curated escapes for Tết — from family gatherings by the sea,
            to quiet couple hideaways and Gen Z stays that run from sunrise
            coffee to midnight cocktails.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="grid gap-10 md:grid-cols-3"
        >
          {rooms.map((room) => (
            <motion.article
              key={room.slug}
              variants={cardVariants}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-b from-white/[0.03] to-white/[0.01] shadow-[0_18px_60px_rgba(0,0,0,0.6)]"
            >
              {/* Image with subtle parallax */}
              <ParallaxWrapper
                amount={50}
                className="relative h-64 md:h-72 overflow-hidden"
              >
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />

                {/* Soft top + bottom fades for cinematic look */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
              </ParallaxWrapper>

              {/* Content */}
              <div className="flex flex-1 flex-col px-6 pt-6 pb-5">
                <p className="font-inter text-[10px] uppercase tracking-[0.28em] text-gray-400">
                  {room.headline}
                </p>
                <h3 className="mt-1 font-playfair text-lg text-white tracking-[0.15em] uppercase">
                  {room.subheading}
                </h3>
                <p className="mt-2 font-playfair text-sm text-gray-200">
                  {room.name}
                </p>

                <p className="mt-3 font-inter text-xs md:text-sm text-gray-400 leading-relaxed">
                  {room.description}
                </p>

                {/* Package value block */}
                <div className="mt-5 space-y-1 text-xs md:text-[13px] font-inter text-gray-300">
                  <p className="uppercase tracking-[0.22em] text-[10px] text-gray-400">
                    Package value
                  </p>
                  {room.valueLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>

                {/* CTA row */}
                <motion.button
                  onClick={() => {
                    push(`/rooms`);
                  }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                  className="mt-5 inline-flex items-center gap-2 text-[11px] font-inter tracking-[0.22em] uppercase text-gray-200 group-hover:text-white"
                >
                  View details
                  <span className="h-px w-5 bg-gray-400 group-hover:bg-white transition-colors" />
                </motion.button>
              </div>

              {/* Glow border on hover */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-0 ring-white/0 transition group-hover:ring-1 group-hover:ring-white/18" />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default RoomsSection;
