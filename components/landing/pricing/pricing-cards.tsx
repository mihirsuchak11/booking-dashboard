"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PricingCard } from "./pricing-card";
import type { PricingPlan } from "./pricing-data";

gsap.registerPlugin(ScrollTrigger);

export function PricingCards({
  plans,
  billingPeriod,
  sectionRef,
}: {
  plans: PricingPlan[];
  billingPeriod: "monthly" | "yearly";
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const popularCardRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current.filter(Boolean);

    if (!section || cards.length === 0) return;

    // Set initial state - cards start below and invisible
    gsap.set(cards, {
      y: 60,
      opacity: 0,
    });

    // Create ScrollTrigger that plays animation only when scrolling down
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 60%",
      onEnter: () => {
        // Reset cards to initial state
        gsap.set(cards, { y: 60, opacity: 0 });
        
        // Animate cards sequentially using stagger (no timeline needed)
        gsap.to(cards, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.6,
          stagger: 0.2,
          ease: "power3.out",
        });
      },
    });

    // Animate light on scroll for popular card
    let lightAnimation: ScrollTrigger | null = null;
    if (popularCardRef.current && lightRef.current) {
      lightAnimation = ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          // Move light horizontally based on scroll progress
          const xPosition = (progress - 0.5) * 500;
          gsap.set(lightRef.current, {
            x: xPosition,
          });
        },
      });
    }

    return () => {
      trigger.kill();
      if (lightAnimation) {
        lightAnimation.kill();
      }
    };
  }, [sectionRef]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-md md:max-w-lg lg:max-w-7xl mx-auto">
      {plans.map((plan, index) => (
        <div
          key={plan.id}
          ref={(el) => {
            if (el) {
              cardsRef.current[index] = el;
              if (plan.isPopular) {
                popularCardRef.current = el;
              }
            }
          }}
          className="relative overflow-hidden"
        >
          {plan.isPopular && (
            <div
              ref={lightRef}
              className="pointer-events-none absolute left-1/2 -top-8 z-0 h-24 w-[86%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.2)_18%,rgba(255,255,255,0.1)_34%,transparent_60%),radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.3)_0%,rgba(255,255,255,0.14)_18%,transparent_52%)] blur-md"
            />
          )}
          <PricingCard plan={plan} billingPeriod={billingPeriod} />
        </div>
      ))}
    </div>
  );
}
