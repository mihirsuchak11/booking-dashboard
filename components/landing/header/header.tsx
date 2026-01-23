"use client";

import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { MobileMenu } from "./mobile-menu";
import { headerNavLinks } from "./nav-links";
import { useEffect, useState } from "react";
import { scrollToSection } from "./navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { benefitsData, benefitsScrollVhPerCard } from "@/components/landing";

export function Header() {
  const [activeHref, setActiveHref] = useState<(typeof headerNavLinks)[number]["href"]>(
    headerNavLinks[0].href
  );

  useEffect(() => {
    const sections = headerNavLinks
      .map((link) => ({
        href: link.href,
        el: document.getElementById(link.href.slice(1)),
      }))
      .filter((s): s is { href: (typeof headerNavLinks)[number]["href"]; el: HTMLElement } =>
        Boolean(s.el)
      );

    if (sections.length === 0) return;

    const headerOffsetPx = 96;
    let ticking = false;

    const updateActive = () => {
      const benefitsSection = document.getElementById("benefits");

      // Check if we're in the pinned benefits ScrollTrigger section
      if (benefitsSection) {
        const triggers = ScrollTrigger.getAll();
        const benefitsTrigger = triggers.find(
          (trigger) => trigger.trigger === benefitsSection && trigger.vars?.pin
        );

        if (
          benefitsTrigger &&
          typeof benefitsTrigger.start === "number" &&
          typeof benefitsTrigger.end === "number" &&
          benefitsTrigger.end > benefitsTrigger.start
        ) {
          const scrollY = window.scrollY;
          
          // Get Pricing section position to know when to stop using pinned nav logic
          const pricingEl = document.getElementById("pricing");
          const pricingTop = pricingEl
            ? pricingEl.getBoundingClientRect().top + window.scrollY
            : Number.POSITIVE_INFINITY;

          // Use pinned nav logic if:
          // 1. We're within the pinned range, OR
          // 2. We just exited the pinned section but haven't reached Pricing yet
          // This prevents flickering back to "Benefits" after horizontal phase ends
          const shouldUsePinnedNav =
            (scrollY >= benefitsTrigger.start && scrollY <= benefitsTrigger.end) ||
            (scrollY > benefitsTrigger.end && scrollY < pricingTop - headerOffsetPx);

          if (shouldUsePinnedNav) {
            // Calculate progress within the ScrollTrigger (0 to 1)
            // Clamp progress to [0, 1] for cases where scrollY is beyond end
            const progressRaw =
              (scrollY - benefitsTrigger.start) / (benefitsTrigger.end - benefitsTrigger.start);
            const progress = Math.min(Math.max(progressRaw, 0), 1);

            // Same calculation as benefits-scroll-wrapper.tsx
            const cardCount = benefitsData.length;
            const cardsPhaseVh = (cardCount - 1) * benefitsScrollVhPerCard;
            const horizontalPhaseVh = 200;
            const totalVh = cardsPhaseVh + horizontalPhaseVh;
            const cardsPhaseRatio = cardsPhaseVh / totalVh;

            // Small gap to ensure smooth transition (1% of total progress)
            const gap = 0.01;

            // Switch to "How it Works" once cards are stacked and we enter horizontal phase
            // If we're past the end, always show "How it Works"
            const pinnedActive =
              progress >= cardsPhaseRatio + gap || scrollY > benefitsTrigger.end
                ? "#how-it-works"
                : "#benefits";

            setActiveHref((prev) => {
              if (prev !== pinnedActive) {
                return pinnedActive as (typeof headerNavLinks)[number]["href"];
              }
              return prev;
            });
            return;
          }
        }
      }

      // Fallback: original DOM-based logic for normal sections
      const y = window.scrollY + headerOffsetPx;
      let current = sections[0]?.href ?? headerNavLinks[0].href;

      for (const s of sections) {
        const top = s.el.getBoundingClientRect().top + window.scrollY;
        if (top <= y) current = s.href;
      }

      setActiveHref((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        updateActive();
      });
    };

    const onHashChange = () => {
      const hash = window.location.hash;
      if (headerNavLinks.some((l) => l.href === hash)) {
        setActiveHref(hash as (typeof headerNavLinks)[number]["href"]);
      }
    };

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>,
    href: string
  ) => {
    // Handle both mouse clicks and keyboard activation (Enter/Space)
    if (e.type === "click") {
      e.preventDefault();
    } else if (e.type === "keydown") {
      const keyEvent = e as React.KeyboardEvent<HTMLAnchorElement>;
      if (keyEvent.key === "Enter" || keyEvent.key === " ") {
        e.preventDefault();
        scrollToSection(href);
      }
      return; // Allow other keys to work normally
    }
    scrollToSection(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <div className="flex h-14 w-full max-w-4xl items-center justify-between rounded-full border border-white/10 bg-[#0a0a0f]/80 px-6 backdrop-blur-md">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("#home");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              scrollToSection("#home");
            }
          }}
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f] rounded-lg"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <span className="text-xs font-bold text-primary-foreground">AI</span>
          </div>
          <span className="text-base font-semibold tracking-tight text-white">
            Booking Agent
          </span>
        </a>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {headerNavLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              onKeyDown={(e) => handleNavClick(e, link.href)}
              aria-current={activeHref === link.href ? "page" : undefined}
              className={`text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f] rounded-md ${
                activeHref === link.href ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white hover:bg-white/10"
            asChild
          >
            <a href="#demo">Demo</a>
          </Button>
          <Button size="sm" variant="default" className="bg-primary text-white hover:bg-primary/80" asChild>
            <a href="#get-started" className="flex items-center gap-1.5" aria-label="Get Started">
              Get Started
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} aria-hidden="true" />
            </a>
          </Button>
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}
