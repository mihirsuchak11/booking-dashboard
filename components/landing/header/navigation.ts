import { benefitsData, benefitsScrollVhPerCard } from "@/components/landing";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function scrollToSection(href: string) {
  if (href === "#benefits") {
    const benefitsSection = document.getElementById("benefits");
    if (benefitsSection) {
      // Prefer GSAP ScrollTrigger start for pinned sections (more accurate than DOM math)
      const triggers = ScrollTrigger.getAll();
      const benefitsTrigger = triggers.find(
        (trigger) => trigger.trigger === benefitsSection && trigger.vars?.pin
      );

      if (benefitsTrigger && typeof benefitsTrigger.start === "number") {
        // ScrollTrigger.start is the exact scroll position where pinning begins
        // No header offset needed - this is the precise pinning stage
        window.scrollTo({
          top: benefitsTrigger.start,
          behavior: "smooth",
        });
        return;
      }

      // Fallback: standard section top calculation
      const headerOffset = 96;
      const sectionTop = benefitsSection.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: sectionTop - headerOffset,
        behavior: "smooth",
      });
    }
  } else if (href === "#how-it-works") {
    const benefitsSection = document.getElementById("benefits");
    if (benefitsSection) {
      // Find the ScrollTrigger instance for the benefits section
      // This is more accurate than manual calculation
      const triggers = ScrollTrigger.getAll();
      const benefitsTrigger = triggers.find(
        (trigger) => trigger.trigger === benefitsSection && trigger.vars?.pin
      );

      if (benefitsTrigger && typeof benefitsTrigger.end === "number") {
        // Scroll to 100% progress (end of ScrollTrigger, end of horizontal phase)
        // This shows the last card fully and completes the horizontal scroll
        // ScrollTrigger.start and end are absolute scroll positions
        const targetProgress = 1.0; // 100% progress to show last card
        const scrollRange = benefitsTrigger.end - benefitsTrigger.start;
        const targetScroll = benefitsTrigger.start + scrollRange * targetProgress;
        
        // No header offset needed here since ScrollTrigger positions are absolute
        window.scrollTo({
          top: targetScroll,
          behavior: "smooth",
        });
      } else {
        // Fallback: calculate based on section position and scroll distance
        const cardCount = benefitsData.length;
        const cardsPhaseVh = (cardCount - 1) * benefitsScrollVhPerCard;
        const horizontalPhaseVh = 200;
        const totalVh = cardsPhaseVh + horizontalPhaseVh;
        
        const sectionTop = benefitsSection.getBoundingClientRect().top + window.scrollY;
        const headerOffset = 96;
        const scrollDistance = (totalVh * window.innerHeight) / 100;
        // Scroll to 100% progress (end) to show last card
        const targetScroll = sectionTop + scrollDistance * 1.0 - headerOffset;
        
        window.scrollTo({
          top: targetScroll,
          behavior: "smooth",
        });
      }
    }
  } else {
    // Default behavior for other sections
    const targetId = href.slice(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const headerOffset = 96;
      const targetTop = targetElement.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: targetTop - headerOffset,
        behavior: "smooth",
      });
    }
  }
}
