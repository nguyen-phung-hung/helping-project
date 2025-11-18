"use client";
// import { ThemeSwitcher } from "@/components/theme-switcher";

import LandingSection from "./components/landing/LandingSection";
import AboutSection from "./components/landing/AboutSection";
import RoomsSection from "./components/landing/RoomSection";

import GallerySection from "./components/landing/GallerySection";
import ReviewSection from "./components/landing/ReviewSection";
import SmoothScrollLayout from "./components/SmoothScrollLayout";
// import Link from "next/link";

export default function Home() {
  return (
    <SmoothScrollLayout pages={7}>
      <div className="flex-1 w-full flex flex-col items-center">
        <LandingSection />
        <AboutSection />
        <RoomsSection />
        <GallerySection />
        <ReviewSection />
        {/* <Footer /> */}
        {/* <ThemeSwitcher /> */}
      </div>
    </SmoothScrollLayout>
  );
}
