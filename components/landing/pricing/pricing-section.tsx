"use client";

import { useRef, useState } from "react";
import { PricingHeader } from "./pricing-header";
import { PricingToggle } from "./pricing-toggle";
import { PricingCards } from "./pricing-cards";
import { pricingPlans } from "./pricing-data";

export function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative isolate scroll-mt-24 overflow-hidden bg-[#07070c] py-24"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 [background-image:radial-gradient(ellipse_at_top,rgba(99,102,241,0.16),transparent_56%),radial-gradient(ellipse_at_bottom,rgba(34,197,94,0.07),transparent_60%)]" />
        <div className="absolute -top-44 left-1/2 h-[640px] w-[980px] -translate-x-1/2 rounded-full bg-[conic-gradient(from_90deg_at_50%_50%,rgba(99,102,241,0.14),rgba(168,85,247,0.10),rgba(56,189,248,0.08),rgba(99,102,241,0.14))] blur-3xl opacity-45" />
        <div className="absolute left-1/2 top-[42%] h-[520px] w-[1100px] -translate-x-1/2 rotate-[-10deg] rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.09),transparent)] blur-2xl opacity-55" />
        <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(to_right,rgba(255,255,255,0.45)_1px,transparent_1px)] [background-size:84px_84px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_78%)]" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(rgba(255,255,255,0.75)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/60 to-black/90" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#07070c] via-[#07070c]/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#07070c] via-[#07070c]/70 to-transparent" />
      </div>
      <div className="container mx-auto px-[20px]">
        <PricingHeader />
        <PricingToggle
          billingPeriod={billingPeriod}
          setBillingPeriod={setBillingPeriod}
        />
        <PricingCards
          plans={pricingPlans}
          billingPeriod={billingPeriod}
          sectionRef={sectionRef}
        />
      </div>
    </section>
  );
}
