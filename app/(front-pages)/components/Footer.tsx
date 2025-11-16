import Logo from "./Logo";
import Link from "next/link";

const navLinks = [
  { label: "Rooms & Suites", href: "#rooms" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

const infoLinks = [
  { label: "+1 (555) 214-0923", href: "tel:+15552140923" },
  { label: "stay@aureliahaven.com", href: "mailto:stay@aureliahaven.com" },
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-t from-black via-[#050505] to-[#0B0B0B] border-t border-white/10">
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-12 md:py-16">
        {/* Top grid */}
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          {/* Brand & tagline */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Logo />
              <div>
                <h2 className="font-playfair text-sm md:text-base tracking-[0.22em] text-white uppercase">
                  Aurelia Haven
                </h2>
                <p className="font-inter text-[11px] tracking-[0.28em] text-gray-400 uppercase mt-1">
                  Quiet Luxury Hotel
                </p>
              </div>
            </div>

            <p className="font-inter text-sm text-gray-400 leading-relaxed max-w-sm">
              A modern boutique retreat where architecture, calm, and considered
              details shape every stay. Designed for unhurried evenings, slow
              mornings, and guests who prefer quiet luxury over noise.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-playfair text-xs tracking-[0.3em] text-gray-300 uppercase">
              Explore
            </h3>
            <div className="flex flex-col gap-2">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="font-inter text-[11px] tracking-[0.22em] text-gray-400 uppercase hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact / Social */}
          <div className="space-y-4">
            <h3 className="font-playfair text-xs tracking-[0.3em] text-gray-300 uppercase">
              Visit &amp; Contact
            </h3>

            <div className="space-y-2 text-sm font-inter text-gray-400">
              <p>78 Aurelia Way</p>
              <p>Midtown District, New York</p>
              <p>NY 10018, United States</p>
            </div>

            <div className="space-y-1">
              {infoLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block font-inter text-[11px] tracking-[0.22em] text-gray-400 uppercase hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="pt-3 space-y-2">
              <p className="font-playfair text-[11px] tracking-[0.26em] text-gray-300 uppercase">
                Social
              </p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-inter text-[11px] tracking-[0.22em] text-gray-400 uppercase hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 h-px w-full bg-white/10" />

        {/* Bottom row */}
        <div className="mt-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="font-inter text-[11px] text-gray-500">
            © {new Date().getFullYear()} Aurelia Haven. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-4 text-[11px] font-inter text-gray-500">
            <button className="uppercase tracking-[0.22em] hover:text-gray-300 transition-colors">
              Privacy
            </button>
            <button className="uppercase tracking-[0.22em] hover:text-gray-300 transition-colors">
              Terms
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
