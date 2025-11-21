"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const links = [
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
  { path: "/blog", label: "Blog" },
  { path: "/events", label: "Events" },
  { path: "/rooms", label: "Rooms" },
];

const underlineVariants = {
  rest: { width: 0, opacity: 0 },
  hover: { width: "100%", opacity: 1 },
  active: { width: "100%", opacity: 1 },
};

const Navigation = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll to shrink nav
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll(); // run once on mount
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`
        fixed top-0 left-0 right-0 z-50
        border-b border-white/10
        transition-colors duration-300
        ${
          scrolled
            ? "bg-black/70 backdrop-blur-lg"
            : "bg-black/40 backdrop-blur-md"
        }
      `}
    >
      <div
        className={`
          w-full flex items-center justify-between
          px-6 md:px-10
          transition-all duration-300
          ${scrolled ? "h-12" : "h-16"}
        `}
      >
        {/* Logo + Brand */}
        <div className="flex items-center gap-3">
          <Logo />
          <h1 className="font-playfair text-sm md:text-lg tracking-[0.18em] text-white">
            <span className="inline-block pr-[0.05em]">Pullman</span>{" "}
            <span className="inline-block tracking-[0.22em]">Danang</span>
          </h1>
        </div>

        {/* Links */}
        <div className="hidden md:flex gap-10">
          {links.map((link) => {
            const isActive =
              pathname === link.path ||
              (link.path !== "/" && pathname.startsWith(link.path));

            return (
              <motion.div
                key={link.path}
                className="relative"
                initial={false}
                animate={isActive ? "active" : "rest"}
                whileHover="hover"
              >
                <Link
                  href={link.path}
                  className={`
                    font-inter text-[11px] tracking-[0.25em] uppercase
                    transition-colors duration-300
                    ${
                      isActive ? "text-white" : "text-gray-300 hover:text-white"
                    }
                  `}
                >
                  {link.label}
                </Link>

                {/* Underline */}
                <motion.span
                  variants={underlineVariants}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="
                    absolute -bottom-1 left-0
                    h-[1px] bg-white
                  "
                />
              </motion.div>
            );
          })}
        </div>

        {/* Placeholder for mobile (for now) */}
        <div className="md:hidden" />
      </div>
    </motion.nav>
  );
};

export default Navigation;
