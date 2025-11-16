import { ParallaxWrapper } from "@/components/ParallawxWrapper";
import Image from "next/image";
import Link from "next/link";

export function AboutSection() {
  return (
    <section className="relative w-full py-28 md:py-40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/[0.02] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/[0.02] to-transparent" />
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Thin Image with parallax */}
        <ParallaxWrapper
          amount={100}
          className="relative w-full max-w-sm mx-auto h-[600px] rounded-2xl overflow-hidden border border-white/10 shadow-lg shadow-black/20"
        >
          <Image
            src="/hallway.jpg"
            alt="Hotel interior"
            fill
            className="object-cover object-center"
          />
        </ParallaxWrapper>

        {/* Text */}
        <div className="max-w-xl mx-auto">
          <h2 className="font-playfair text-lg md:text-xl tracking-[0.3em] text-gray-300 uppercase mb-6">
            About
          </h2>

          <div className="w-14 h-px bg-white/20 mb-8"></div>

          <p className="font-inter text-gray-400 text-base md:text-lg leading-relaxed md:leading-loose">
            Aurelia Haven is a modern boutique retreat where architecture,
            comfort, and calm intersect. Framed by clean lines and warm interior
            light, our suites are designed as private sanctuaries for travelers
            who value quiet luxury over noise. Thoughtful amenities, curated
            textures, and seamless digital service ensure every stay feels
            intentionally crafted.
          </p>
          <Link href={"/about"}>
            <div className="mt-8 text-xs md:text-sm font-inter tracking-[0.2em] uppercase text-gray-200 hover:text-white">
              Learn more
            </div>
          </Link>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[120px] bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
    </section>
  );
}

export default AboutSection;
