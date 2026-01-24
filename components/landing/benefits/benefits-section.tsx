"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  LayoutIcon,
  MoreHorizontalCircle01Icon,
  NotificationIcon,
  HelpCircleIcon,
} from "@hugeicons/core-free-icons";
import {
  benefitsData,
  benefitsScrollVhPerCard,
  benefitsSectionContent,
} from "./benefits-data";

gsap.registerPlugin(ScrollTrigger);

export function BenefitsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let trigger: ScrollTrigger | null = null;

    const initGSAP = () => {
      // Only initialize GSAP animations on screens >= 768px
      const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;
      
      if (!isDesktop) {
        // On mobile, just show the first card as active
        setActiveIndex(0);
        // Clean up any existing GSAP animations
        if (trigger) {
          trigger.kill();
          trigger = null;
        }
        return;
      }

      const section = sectionRef.current;
      const container = containerRef.current;
      const cardsContainer = cardsContainerRef.current;
      const track = trackRef.current;
      if (!section || !container || !cardsContainer || !track) return;

      // Kill existing trigger if resizing
      if (trigger) {
        trigger.kill();
        trigger = null;
      }

      const cards = cardsRef.current.filter(Boolean);
      const cardCount = benefitsData.length;
      
      if (cards.length === 0) return;

      // Get the desktop cards container width
      const desktopContainer = cardsContainer.querySelector('[data-desktop-cards]') as HTMLElement;
      if (!desktopContainer) return;
      const containerWidth = desktopContainer.offsetWidth;
      const GAP = 16;
      // Calculate card width: CARD_WIDTH + GAP + 0.1*CARD_WIDTH = containerWidth
      // So: 1.1*CARD_WIDTH + GAP = containerWidth
      // CARD_WIDTH = (containerWidth - GAP) / 1.1
      const CARD_WIDTH = (containerWidth - GAP) / 1.1;
      
      // Active card starts at left edge
      const ACTIVE_X = 0;
      // Prev card - stacked behind on left
      const PREV_X_CLAMPED = -30;
      // Next card - positioned after first card with gap, showing only 10% visible
      // Card 1 ends at CARD_WIDTH, so card 2 starts at CARD_WIDTH + GAP
      const NEXT_X = CARD_WIDTH + GAP;

      // Set card widths and initial positions
      cards.forEach((card, index) => {
        if (!card) return;
        // Set card width dynamically
        card.style.width = `${CARD_WIDTH}px`;
        
        if (index === 0) {
          gsap.set(card, { x: ACTIVE_X, scale: 1, zIndex: 30 });
        } else if (index === 1) {
          gsap.set(card, { x: NEXT_X, scale: 0.98, zIndex: 20 });
        } else {
          gsap.set(card, { x: NEXT_X + CARD_WIDTH + GAP, scale: 0.95, zIndex: 10 });
        }
      });

      trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        // First phase: cards stack. Second phase: horizontal slide to next section.
        end: `+=${(cardCount - 1) * benefitsScrollVhPerCard + 200}vh`,
        pin: container,
        scrub: 0.3,
        onUpdate: (self) => {
          const totalProgress = self.progress;

          const cardsPhaseVh = (cardCount - 1) * benefitsScrollVhPerCard;
          const horizontalPhaseVh = 200;
          const totalVh = cardsPhaseVh + horizontalPhaseVh;
          const cardsPhaseRatio = cardsPhaseVh / totalVh;

          // Map overall scroll progress into 0–1 just for the cards phase
          const cardsProgress = Math.min(
            totalProgress / (cardsPhaseRatio || 1),
            1
          );
          // CLAMP exactIndex so it never exceeds cardCount-1
          // This ensures the last card never moves past active position
          const exactIndex = Math.min(
            cardsProgress * (cardCount - 1),
            cardCount - 1
          );
          const currentActive = Math.min(Math.floor(exactIndex), cardCount - 1);
          setActiveIndex(currentActive);

          cards.forEach((card, index) => {
            if (!card) return;

            const relativePos = exactIndex - index;
            const isLastCard = index === cardCount - 1;

            // Calculate target X based on relative position
            let targetX: number;
            let targetScale: number;
            let targetZIndex: number;

            // IMPORTANT: Last card ALWAYS stays at active position once it reaches there
            if (isLastCard && relativePos >= 0) {
              targetX = ACTIVE_X;
              targetScale = 1;
              targetZIndex = 30;
            } else if (relativePos >= 1) {
              // Previous cards - stacked behind on left
              const stackIdx = Math.min(relativePos - 1, 2);
              targetX = PREV_X_CLAMPED - stackIdx * 10;
              targetScale = 0.95 - stackIdx * 0.02;
              targetZIndex = Math.max(10 - stackIdx * 3, 1);
            } else if (relativePos >= 0) {
              // Active card transitioning to prev
              const t = relativePos;
              targetX = ACTIVE_X + (PREV_X_CLAMPED - ACTIVE_X) * t;
              targetScale = 1 - t * 0.05;
              targetZIndex = 25 - Math.floor(t * 10);
            } else if (relativePos >= -1) {
              // Next card transitioning to active
              const t = relativePos + 1;
              targetX = NEXT_X + (ACTIVE_X - NEXT_X) * t;
              targetScale = 0.98 + t * 0.02;
              targetZIndex = 30;
            } else if (relativePos >= -2) {
              // Next-next card transitioning to next position
              const t = relativePos + 2;
              const FUTURE_X = NEXT_X + CARD_WIDTH + GAP;
              targetX = FUTURE_X + (NEXT_X - FUTURE_X) * t;
              targetScale = 0.95 + t * 0.03;
              targetZIndex = 15;
            } else {
              // Future cards - off screen
              targetX = NEXT_X + CARD_WIDTH + GAP;
              targetScale = 0.95;
              targetZIndex = 1;
            }

            gsap.set(card, { x: targetX, scale: targetScale, zIndex: targetZIndex });
          });

          // Horizontal phase: after cards are fully stacked, slide entire track left
          let horizontalProgress = 0;
          if (totalProgress > cardsPhaseRatio && cardsPhaseRatio < 1) {
            horizontalProgress =
              (totalProgress - cardsPhaseRatio) / (1 - cardsPhaseRatio);
          }

          gsap.set(track, {
            xPercent: -50 * Math.min(Math.max(horizontalProgress, 0), 1),
          });
        },
      });
    };

    // Initial setup
    initGSAP();

    // Handle window resize
    const handleResize = () => {
      initGSAP();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (trigger) {
        trigger.kill();
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="benefits"
      className="relative isolate scroll-mt-24 overflow-x-clip bg-[#07070c]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-44 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.28),transparent_60%)] blur-3xl" />
        <div className="absolute -left-44 top-1/3 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.18),transparent_60%)] blur-3xl" />
        <div className="absolute -right-44 bottom-[-120px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.16),transparent_60%)] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(to_right,rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/35 to-black/70" />
      </div>
      <div
        ref={containerRef}
        className="relative z-10 min-h-screen w-full md:h-screen overflow-hidden"
      >
        {/* Track: 2 panels on desktop -> 200vw */}
        <div ref={trackRef} className="flex h-full w-full md:w-[200vw]">
          {/* Panel 1: existing Benefits content */}
          <div className="w-full md:w-screen flex items-center">
            <div className="container mx-auto px-[20px]">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center lg:items-center">
                {/* Left Panel - 40% */}
                <div className="w-full lg:w-[40%] shrink-0 relative z-50 lg:pl-4 lg:pl-8">
                  <LeftPanel activeIndex={activeIndex} />
                </div>

                {/* Right Panel - 60%, with left padding to prevent overlap */}
                <div
                  ref={cardsContainerRef}
                  className="w-full lg:w-[60%] relative md:h-[520px] lg:pl-16"
                >
                  {/* Single set of cards with responsive layout */}
                  <div
                    className="flex flex-col gap-4 md:flex-none md:block relative md:h-[520px]"
                    data-desktop-cards
                  >
                    {benefitsData.map((benefit, index) => (
                      <div
                        key={benefit.id}
                        ref={(el) => {
                          if (el) cardsRef.current[index] = el;
                        }}
                        className="h-[350px] md:absolute md:top-0 md:left-0 md:h-full md:w-full md:will-change-transform"
                      >
                        <BenefitCard
                          benefit={benefit}
                          isActive={index === activeIndex}
                          isPrev={index < activeIndex}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel 2: horizontal next section (currently simple Test Section) */}
          <div className="hidden md:flex w-screen items-center justify-center px-[20px]">
            <div className="max-w-2xl text-center">
              <p className="text-sm font-medium uppercase tracking-widest text-primary mb-4">
                Test Section
              </p>
              <h3 className="text-3xl md:text-4xl font-semibold text-white mb-4">
                Your next section slides in from the right.
              </h3>
              <p className="text-white/70 text-sm md:text-base">
                This panel appears after all benefit cards are stacked. The scroll stays pinned while the
                content moves horizontally from right to left, then the page continues with normal vertical
                scrolling.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LeftPanel({ activeIndex }: { activeIndex: number }) {
  const cardCount = benefitsData.length;

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <div className="flex flex-col gap-3 lg:gap-4">
        <p className="text-xs lg:text-sm font-medium text-primary uppercase tracking-wider">
          Benefits
        </p>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-white">
          {benefitsSectionContent.heading}
        </h2>
        <p className="text-sm sm:text-base lg:text-lg text-white/70 max-w-md leading-relaxed">
          {benefitsSectionContent.description}
        </p>
      </div>

      <div className="hidden md:flex items-center gap-1">
        {benefitsData.map((_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-xs lg:text-sm font-semibold transition-all duration-300 ${
                index <= activeIndex
                  ? "bg-primary text-white"
                  : "bg-white/10 text-white/50"
              }`}
            >
              {index + 1}
            </div>
            {index < cardCount - 1 && (
              <div className="relative mx-0.5 h-0.5 w-4 lg:w-6 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`absolute inset-0 origin-left rounded-full bg-primary transition-transform duration-300 ${
                    index < activeIndex ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface BenefitCardProps {
  benefit: (typeof benefitsData)[0];
  isActive: boolean;
  isPrev: boolean;
}

function BenefitCard({ benefit, isActive, isPrev }: BenefitCardProps) {
  const benefitIcons: Record<number, any> = {
    1: UserIcon,
    2: LayoutIcon,
    3: MoreHorizontalCircle01Icon,
    4: NotificationIcon,
    5: HelpCircleIcon,
  };

  const Icon = benefitIcons[benefit.id];

  return (
    <div
      className={`h-full w-full rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 flex flex-col border transition-shadow duration-200 ${
        isActive
          ? "bg-[#1a1a1f] border-white/20 shadow-[-30px_0_60px_-15px_rgba(0,0,0,0.9)]"
          : isPrev
            ? "bg-[#141419] border-white/8"
            : "bg-[#16161b] border-white/15 shadow-lg"
      }`}
    >
      <div className="flex-1 rounded-xl lg:rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 lg:mb-6 overflow-hidden relative">
        {/* <Image
          src={benefit.image}
          alt={benefit.title}
          fill
          className="object-cover rounded-xl lg:rounded-2xl"
        /> */}
      </div>
      <div className="flex flex-col gap-2 lg:gap-3">
        <div className="flex items-center gap-2">
          {Icon && (
            <HugeiconsIcon
              icon={Icon}
              strokeWidth={2}
              className="h-4 w-4 lg:h-5 lg:w-5 text-white"
            />
          )}
          <h3 className="text-lg lg:text-xl font-semibold text-white">
            {benefit.title}
          </h3>
        </div>
        <p className="text-white/70 text-xs lg:text-sm leading-relaxed line-clamp-3">
          {benefit.description}
        </p>
      </div>
    </div>
  );
}
