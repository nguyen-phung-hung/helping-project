import Image from "next/image";
import { motion } from "framer-motion";

const LandingSection = () => {
  return (
    <section className="w-full h-screen px-16">
      <div className="w-full h-full z-[-1] absolute left-0 top-0">
        <Image
          src="/pullman.jpg"
          alt="Front Page"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />
      </div>

      <div className="z-10 flex w-full h-full flex-col justify-center gap-6">
        <h1 className="font-playfair text-4xl md:text-6xl tracking-[0.18em] text-white">
          PULL MAN DA NANG
        </h1>
        <p className="mt-4 font-inter text-sm md:text-base text-gray-200">
          Where Modern Comfort Meets Timeless Design.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="px-7 py-3 rounded-full bg-white text-black text-[11px] md:text-xs font-semibold tracking-[0.22em] uppercase font-inter shadow-md shadow-black/30"
          >
            Book Now
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="px-7 py-3 rounded-full border border-white/70 text-white text-[11px] md:text-xs font-semibold tracking-[0.22em] uppercase font-inter bg-white/0 backdrop-blur-[1px]"
          >
            View Rooms
          </motion.button>
        </div>
      </div>
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 1.1 }}
      >
        <div className="flex flex-col items-center gap-2 text-[10px] font-inter tracking-[0.28em] text-gray-500 uppercase">
          <span>Scroll to discover</span>
          <div className="h-8 w-px overflow-hidden bg-gray-600/40">
            <motion.div
              className="h-full w-px bg-gray-300"
              animate={{ y: ["-100%", "100%"] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default LandingSection;
