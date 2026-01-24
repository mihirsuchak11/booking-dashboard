"use client";

import Image from "next/image";
import { type Partner } from "./partner-data";
import "./partner-slider.css";

interface PartnerSliderProps {
  partners: Partner[];
}

export function PartnerSlider({ partners }: PartnerSliderProps) {
  // Duplicate partners array 3 times for seamless infinite loop
  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <div className="relative overflow-hidden">
      {/* Left gradient overlay */}
      <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-24 bg-gradient-to-r from-[#0a0a0f] to-transparent sm:w-32" />

      {/* Right gradient overlay */}
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-24 bg-gradient-to-l from-[#0a0a0f] to-transparent sm:w-32" />

      {/* Slider track */}
      <div className="animate-infinite-scroll flex w-fit gap-12 py-4 hover:[animation-play-state:paused] sm:gap-16">
        {duplicatedPartners.map((partner, index) => (
          <div
            key={`${partner.id}-${index}`}
            className="flex shrink-0 items-center justify-center"
          >
            <Image
              src={partner.logo}
              alt={partner.name}
              width={120}
              height={40}
              className="h-8 w-auto opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 sm:h-10 lg:h-12"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
