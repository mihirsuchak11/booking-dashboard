"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { benefitsData, benefitsScrollVhPerCard } from "./benefits-data";
import { BenefitsScrollProvider } from "./benefits-content";

gsap.registerPlugin(ScrollTrigger);

interface BenefitsScrollWrapperProps {
  children: [ReactNode, ReactNode]; // [BenefitsContent, HowItWorksHorizontal]
}

export function BenefitsScrollWrapper({ children }: BenefitsScrollWrapperProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let trigger: ScrollTrigger | null = null;

    const initGSAP = () => {
      const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;
      
      if (!isDesktop) {
        setActiveIndex(0);
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

      if (trigger) {
        trigger.kill();
        trigger = null;
      }

      const cards = cardsRef.current.filter(Boolean);
      const cardCount = benefitsData.length;
      
      if (cards.length === 0) return;

      const desktopContainer = cardsContainer.querySelector('[data-desktop-cards]') as HTMLElement;
      if (!desktopContainer) return;
      const containerWidth = desktopContainer.offsetWidth;
      const GAP = 16;
      const CARD_WIDTH = (containerWidth - GAP) / 1.1;
      
      const ACTIVE_X = 0;
      const PREV_X_CLAMPED = -30;
      const NEXT_X = CARD_WIDTH + GAP;

      cards.forEach((card, index) => {
        if (!card) return;
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
        end: `+=${(cardCount - 1) * benefitsScrollVhPerCard + 200}vh`,
        pin: container,
        scrub: 0.3,
        onUpdate: (self) => {
          const totalProgress = self.progress;

          const cardsPhaseVh = (cardCount - 1) * benefitsScrollVhPerCard;
          const horizontalPhaseVh = 200;
          const totalVh = cardsPhaseVh + horizontalPhaseVh;
          const cardsPhaseRatio = cardsPhaseVh / totalVh;

          const cardsProgress = Math.min(
            totalProgress / (cardsPhaseRatio || 1),
            1
          );
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

            let targetX: number;
            let targetScale: number;
            let targetZIndex: number;

            if (isLastCard && relativePos >= 0) {
              targetX = ACTIVE_X;
              targetScale = 1;
              targetZIndex = 30;
            } else if (relativePos >= 1) {
              const stackIdx = Math.min(relativePos - 1, 2);
              targetX = PREV_X_CLAMPED - stackIdx * 10;
              targetScale = 0.95 - stackIdx * 0.02;
              targetZIndex = Math.max(10 - stackIdx * 3, 1);
            } else if (relativePos >= 0) {
              const t = relativePos;
              targetX = ACTIVE_X + (PREV_X_CLAMPED - ACTIVE_X) * t;
              targetScale = 1 - t * 0.05;
              targetZIndex = 25 - Math.floor(t * 10);
            } else if (relativePos >= -1) {
              const t = relativePos + 1;
              targetX = NEXT_X + (ACTIVE_X - NEXT_X) * t;
              targetScale = 0.98 + t * 0.02;
              targetZIndex = 30;
            } else if (relativePos >= -2) {
              const t = relativePos + 2;
              const FUTURE_X = NEXT_X + CARD_WIDTH + GAP;
              targetX = FUTURE_X + (NEXT_X - FUTURE_X) * t;
              targetScale = 0.95 + t * 0.03;
              targetZIndex = 15;
            } else {
              targetX = NEXT_X + CARD_WIDTH + GAP;
              targetScale = 0.95;
              targetZIndex = 1;
            }

            gsap.set(card, { x: targetX, scale: targetScale, zIndex: targetZIndex });
          });

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

    initGSAP();

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

  const benefitsContent = children[0];
  const howItWorksHorizontal = children[1];

  return (
    <BenefitsScrollProvider
      activeIndex={activeIndex}
      cardsContainerRef={cardsContainerRef}
      cardsRef={cardsRef}
    >
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
          <div ref={trackRef} className="flex h-full w-full md:w-[200vw]">
            {/* Panel 1: Benefits Content */}
            <div className="w-full md:w-screen flex items-center">
              {benefitsContent}
            </div>

            {/* Panel 2: How It Works Horizontal */}
            {howItWorksHorizontal}
          </div>
        </div>
      </section>
    </BenefitsScrollProvider>
  );
}
