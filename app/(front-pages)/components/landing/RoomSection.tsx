"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ParallaxWrapper } from "@/components/ParallawxWrapper";
import { type Variants } from "framer-motion";
import { useRouter } from "next/navigation";

const rooms = [
  {
    name: "Cityview Studio",
    slug: "cityview-studio",
    image: "/rooms/cityview-studio.jpg",
    description:
      "A calm corner with soft lighting, tailored linens, and a framed view of the skyline.",
    size: "32 m²",
    rate: "From $220 / night",
  },
  {
    name: "Signature Suite",
    slug: "signature-suite",
    image: "/rooms/front.jpg",
    description:
      "Open-plan living, sculptural furniture, and layered textures designed for slow mornings.",
    size: "48 m²",
    rate: "From $340 / night",
  },
  {
    name: "Penthouse Loft",
    slug: "penthouse-loft",
    image: "/rooms/penthouse-loft.jpg",
    description:
      "Expansive glass, private lounge, and elevated city views for evenings that linger.",
    size: "72 m²",
    rate: "From $520 / night",
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
              Rooms <span className="text-[1.1em] text-gray-100">&</span> Suites
            </h2>
            <div className="mt-4 h-px w-14 bg-white/15" />
          </div>
          <p className="font-inter text-xs md:text-sm text-gray-400 max-w-md leading-relaxed">
            Thoughtfully scaled spaces inspired by modern architecture — each
            room is a quiet frame of the city, designed for unhurried evenings
            and slow mornings.
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
                <h3 className="font-playfair text-lg text-white tracking-[0.15em] uppercase">
                  {room.name}
                </h3>

                <p className="mt-3 font-inter text-xs md:text-sm text-gray-400 leading-relaxed">
                  {room.description}
                </p>

                <div className="mt-5 flex items-center justify-between text-xs font-inter text-gray-300">
                  <span className="tracking-[0.18em] uppercase">
                    {room.size}
                  </span>
                  <span className="text-[11px] text-gray-200">{room.rate}</span>
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
