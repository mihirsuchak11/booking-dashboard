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

gsap.registerPlugin(ScrollTrigger);

export function HowItWorksSectionVertical() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    let headingTl: gsap.core.Timeline | null = null;
    let tl: gsap.core.Timeline | null = null;

    const initGSAP = () => {
      // Only initialize GSAP animations on desktop (>= 1024px)
      const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

      // Clean up existing animations
      if (headingTl) {
        headingTl.scrollTrigger?.kill();
        headingTl.kill();
        headingTl = null;
      }
      if (tl) {
        tl.scrollTrigger?.kill();
        tl.kill();
        tl = null;
      }

      if (!isDesktop) {
        // On mobile, reset any GSAP transforms and show cards normally
        const heading = headingRef.current;
        const cards = cardsRef.current;
        if (heading) {
          gsap.set(heading, { clearProps: "all" });
        }
        if (cards.length > 0) {
          gsap.set(cards, { clearProps: "all" });
        }
        return;
      }

      const section = sectionRef.current;
      const heading = headingRef.current;
      const cards = cardsRef.current;

      if (!section || !heading || cards.length === 0) return;

      // Initial states
      gsap.set(heading, {
        scale: 0.35,
      });

      gsap.set(cards, {
        yPercent: 120,
        opacity: 0,
      });

      headingTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top top",
          scrub: true,
        },
      });

      headingTl.to(heading, {
        scale: 1,
        ease: "none",
        duration: 1,
      });

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=200vh",
          scrub: true,
          pin: true,
        },
      });

      tl.to(
        cards,
        {
          yPercent: -10,
          opacity: 1,
          stagger: 0.3,
          ease: "none",
          duration: 0.6,
        },
        0
      );
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
      if (headingTl) {
        headingTl.scrollTrigger?.kill();
        headingTl.kill();
      }
      if (tl) {
        tl.scrollTrigger?.kill();
        tl.kill();
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative isolate min-h-screen scroll-mt-24 overflow-hidden bg-[#07070c] py-12 flex flex-col items-center justify-center"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 [background-image:radial-gradient(circle_at_18%_18%,rgba(99,102,241,0.16),transparent_60%),radial-gradient(circle_at_82%_22%,rgba(56,189,248,0.10),transparent_62%),radial-gradient(circle_at_50%_92%,rgba(168,85,247,0.10),transparent_62%)]" />
        <div className="absolute -top-40 left-1/2 h-[620px] w-[980px] -translate-x-1/2 rounded-full bg-[conic-gradient(from_80deg_at_50%_50%,rgba(99,102,241,0.16),rgba(56,189,248,0.10),rgba(168,85,247,0.10),rgba(99,102,241,0.16))] blur-3xl opacity-45" />
        <div className="absolute left-1/2 top-[38%] h-[520px] w-[1100px] -translate-x-1/2 rotate-[-12deg] rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)] blur-2xl opacity-60" />
        <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(to_right,rgba(255,255,255,0.45)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.45)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_78%)]" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(rgba(255,255,255,0.75)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/60 to-black/90" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#07070c] via-[#07070c]/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#07070c] via-[#07070c]/70 to-transparent" />
      </div>
      <div className="container mx-auto px-[20px] w-full">
        {/* Heading */}
        <h2
          ref={headingRef}
          className="text-white font-bold text-4xl md:text-6xl text-center pt-12 pb-8 md:pt-16 md:pb-12"
        >
          How it works?
        </h2>

        {/* Cards */}
        <div className="relative mt-8 w-full max-w-md md:max-w-lg lg:max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((step, i) => (
          <Card
            key={step}
            ref={(el) => {
              if (el) cardsRef.current[i] = el;
            }}
            className="flex flex-col h-full rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm shadow-lg overflow-hidden pt-0 gap-2"
          >
            {/* Image / visual area */}
            <div className="relative w-full h-56 md:h-64 shrink-0 bg-gradient-to-br from-primary/25 via-primary/10 to-primary/5 flex items-center justify-center">
              <span className="text-[11px] md:text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                Step {step} illustration
              </span>
            </div>

            {/* Header */}
            <CardHeader className="pt-4 pb-0 px-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary/80">
                    Step {step < 10 ? `0${step}` : step}
                  </span>
                  <CardTitle className="text-base md:text-lg text-white">
                    {step === 1 && "Connect your calendar"}
                    {step === 2 && "Let the AI handle requests"}
                    {step === 3 && "Confirm & relax"}
                  </CardTitle>
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 border border-primary/40 text-sm font-semibold text-primary">
                  {step}
                </div>
              </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="px-4 pt-0">
              <p className="text-xs md:text-sm leading-snug text-white/70">
                {step === 1 &&
                  "Sign up in minutes, connect your existing calendars, and set your availability rules once."}
                {step === 2 &&
                  "Your AI booking agent understands preferences, responds to requests, and proposes perfect time slots automatically."}
                {step === 3 &&
                  "You approve or auto-confirm bookings, while guests get instant, professional responses—no back-and-forth."}
              </p>
            </CardContent>
          </Card>
        ))}
        </div>
      </div>
    </section>
  );
}
