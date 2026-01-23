"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { benefitsScrollVhPerCard } from "@/components/landing";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    step: 1,
    title: "Connect your calendar",
    description:
      "Sign up in minutes, connect your existing calendars, and set your availability rules once.",
    imageSrc: "/landing/globe.svg",
    imageAlt: "Calendar connection",
  },
  {
    step: 2,
    title: "Let the AI handle requests",
    description:
      "Your AI booking agent understands preferences, responds to requests, and proposes perfect time slots automatically.",
    imageSrc: "/landing/window.svg",
    imageAlt: "AI handles requests",
  },
  {
    step: 3,
    title: "Confirm & relax",
    description:
      "You approve or auto-confirm bookings, while guests get instant, professional responses—no back-and-forth.",
    imageSrc: "/landing/file.svg",
    imageAlt: "Confirm booking",
  },
];

export function HowItWorksHorizontal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const howRef = useRef<HTMLSpanElement>(null);
  const itRef = useRef<HTMLSpanElement>(null);
  const worksRef = useRef<HTMLSpanElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;
    
    if (!isDesktop) {
      // On mobile, set full opacity and scale
      if (howRef.current) gsap.set(howRef.current, { opacity: 1 });
      if (itRef.current) gsap.set(itRef.current, { opacity: 1 });
      if (worksRef.current) gsap.set(worksRef.current, { opacity: 1 });
      if (card1Ref.current) gsap.set(card1Ref.current, { opacity: 1, scale: 1 });
      if (card2Ref.current) gsap.set(card2Ref.current, { opacity: 1, scale: 1 });
      if (card3Ref.current) gsap.set(card3Ref.current, { opacity: 1, scale: 1 });
      return;
    }

    const container = containerRef.current;
    const how = howRef.current;
    const it = itRef.current;
    const works = worksRef.current;
    const card1 = card1Ref.current;
    const card2 = card2Ref.current;
    const card3 = card3Ref.current;

    if (!container || !how || !it || !works || !card1 || !card2 || !card3) return;

    // Find the benefits section to use as trigger
    const benefitsSection = document.getElementById("benefits");
    if (!benefitsSection) return;

    // Set initial low opacity for all words
    gsap.set([how, it, works], { opacity: 0.2 });
    // Set initial opacity 0 and scale 0.9 for all cards
    gsap.set([card1, card2, card3], { opacity: 0, scale: 0.9 });

    // Calculate scroll phases
    const cardCount = 5; // benefitsData.length
    const cardsPhaseVh = (cardCount - 1) * benefitsScrollVhPerCard;
    const horizontalPhaseVh = 200;
    const totalVh = cardsPhaseVh + horizontalPhaseVh;
    const cardsPhaseRatio = cardsPhaseVh / totalVh;

    // Create ScrollTrigger that animates during the horizontal scroll phase
    // Trigger based on benefits section scroll progress during horizontal phase
    const trigger = ScrollTrigger.create({
      trigger: benefitsSection,
      start: "top top",
      end: `+=${totalVh}vh`,
      scrub: 0.5,
      onUpdate: (self) => {
        const totalProgress = self.progress;

        // Only animate during horizontal phase (after cards are stacked)
        if (totalProgress <= cardsPhaseRatio) {
          // Still in cards phase, keep low opacity for text, 0 for cards
          gsap.set([how, it, works], { opacity: 0.2 });
          gsap.set([card1, card2, card3], { opacity: 0, scale: 0.9 });
          return;
        }

        // Calculate progress within horizontal phase (0 to 1)
        const horizontalProgress = (totalProgress - cardsPhaseRatio) / (1 - cardsPhaseRatio);

        // "How" appears first (0-0.25 of horizontal progress)
        if (horizontalProgress <= 0) {
          gsap.set(how, { opacity: 0.2 });
        } else if (horizontalProgress >= 0.25) {
          gsap.set(how, { opacity: 1 });
        } else {
          const howProgress = horizontalProgress / 0.25;
          gsap.set(how, { opacity: 0.2 + howProgress * 0.8 });
        }

        // "It" appears second (0.25-0.5 of horizontal progress)
        if (horizontalProgress <= 0.25) {
          gsap.set(it, { opacity: 0.2 });
        } else if (horizontalProgress >= 0.5) {
          gsap.set(it, { opacity: 1 });
        } else {
          const itProgress = (horizontalProgress - 0.25) / 0.25;
          gsap.set(it, { opacity: 0.2 + itProgress * 0.8 });
        }

        // "Works" appears third (0.5-0.75 of horizontal progress) - reaches full opacity
        if (horizontalProgress <= 0.5) {
          gsap.set(works, { opacity: 0.2 });
        } else if (horizontalProgress >= 0.75) {
          gsap.set(works, { opacity: 1 });
        } else {
          const worksProgress = (horizontalProgress - 0.5) / 0.25;
          gsap.set(works, { opacity: 0.2 + worksProgress * 0.8 });
        }

        // Card 1 appears much earlier, starting when "It" finishes (0.45-0.7 of horizontal progress)
        if (horizontalProgress <= 0.45) {
          gsap.set(card1, { opacity: 0, scale: 0.9 });
        } else if (horizontalProgress >= 0.7) {
          gsap.set(card1, { opacity: 1, scale: 1 });
        } else {
          const card1Progress = (horizontalProgress - 0.45) / 0.25;
          gsap.set(card1, { 
            opacity: card1Progress,
            scale: 0.9 + card1Progress * 0.1
          });
        }

        // Card 2 appears after Card 1 (0.55-0.8 of horizontal progress)
        if (horizontalProgress <= 0.55) {
          gsap.set(card2, { opacity: 0, scale: 0.9 });
        } else if (horizontalProgress >= 0.8) {
          gsap.set(card2, { opacity: 1, scale: 1 });
        } else {
          const card2Progress = (horizontalProgress - 0.55) / 0.25;
          gsap.set(card2, { 
            opacity: card2Progress,
            scale: 0.9 + card2Progress * 0.1
          });
        }

        // Card 3 appears last (0.65-0.9 of horizontal progress)
        if (horizontalProgress <= 0.65) {
          gsap.set(card3, { opacity: 0, scale: 0.9 });
        } else if (horizontalProgress >= 0.9) {
          gsap.set(card3, { opacity: 1, scale: 1 });
        } else {
          const card3Progress = (horizontalProgress - 0.65) / 0.25;
          gsap.set(card3, { 
            opacity: Math.min(card3Progress, 1),
            scale: 0.9 + Math.min(card3Progress, 1) * 0.1
          });
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="hidden md:flex w-screen items-center justify-center px-[20px]">
      <div className="w-full max-w-7xl mx-auto flex items-center gap-8 lg:gap-12">
        {/* Left Side: How It Works Text */}
        <div className="flex-shrink-0 flex flex-col justify-center">
          <h2 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
            <span ref={howRef} className="block">How</span>
            <span ref={itRef} className="block">It</span>
            <span ref={worksRef} className="block">Works</span>
          </h2>
        </div>

        {/* Right Side: Cards */}
        <div className="flex-1 flex gap-4 lg:gap-6">
          {steps.map((item, index) => {
            const cardRef = index === 0 ? card1Ref : index === 1 ? card2Ref : card3Ref;
            return (
            <Card
              key={item.step}
              ref={cardRef}
              className="flex-1 flex flex-col rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm shadow-lg overflow-hidden pt-0"
            >
              {/* Image */}
              <div className="relative w-full h-52 lg:h-56 bg-gradient-to-br from-primary/25 via-primary/10 to-primary/5 flex items-center justify-center">
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  width={140}
                  height={140}
                  className="opacity-90"
                  loading="lazy"
                />
              </div>

              {/* Header */}
              <CardHeader className="pt-4 pb-4 px-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary/80">
                      Step {item.step < 10 ? `0${item.step}` : item.step}
                    </span>
                    <CardTitle className="text-lg lg:text-xl text-white leading-tight">
                      {item.title}
                    </CardTitle>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 border border-primary/40 text-sm font-semibold text-primary flex-shrink-0">
                    {item.step}
                  </div>
                </div>
              </CardHeader>

              {/* Content */}
              <CardContent className="px-6 pb-4 pt-0">
                <p className="text-xs lg:text-sm leading-snug text-white/70">
                  {item.description}
                </p>
              </CardContent>
            </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
