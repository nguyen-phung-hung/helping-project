"use client";
// import { ThemeSwitcher } from "@/components/theme-switcher";

import LandingSection from "./components/landing/LandingSection";
import AboutSection from "./components/landing/AboutSection";
import RoomsSection from "./components/landing/RoomSection";
import Footer from "./components/Footer";
import GallerySection from "./components/landing/GallerySection";
import ReviewSection from "./components/landing/ReviewSection";
// import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 w-full flex flex-col items-center">
      <LandingSection />
      <AboutSection />
      <RoomsSection />
      <GallerySection />
      <ReviewSection />
      <Footer />
      {/* <ThemeSwitcher /> */}
    </div>
  );
}
