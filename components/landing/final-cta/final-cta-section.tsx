"use client";

import "./final-cta.css";
import { Rocket01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function FinalCTASection() {
  return (
    <section
      id="get-started"
      className="relative scroll-mt-24 pt-16 pb-32 px-[20px]"
    >
      {/* Subtle glow effect for emphasis */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.12)_0%,transparent_60%)] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Main Headline */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight tracking-tight">
          <span className="block">Stop Losing Customers</span>
          <span className="block">to Missed Calls</span>
        </h2>

        {/* Subtext */}
        <p className="text-lg sm:text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          Your competitors are already automating.
          <br />
          Start your 14-day free trial in 5 minutes.
        </p>

        {/* CTA Button */}
        <div className="mb-12 flex justify-center">
          <a
            href="/onboarding/search"
            className="cta-button relative p-[3px] rounded-[16px] text-white font-bold text-lg border-none cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-0.5 active:translate-y-0 inline-block"
          >
            <span className="relative z-[2] inline-flex items-center gap-2 py-[15px] px-[45px]">
              Get Started Free
              <HugeiconsIcon
                icon={Rocket01Icon}
                className="h-5 w-5 text-white/90"
                aria-hidden="true"
              />
            </span>
          </a>
        </div>

        {/* Features List */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-white/85">
          <div className="inline-flex items-center gap-2 text-[15px]">
            <HugeiconsIcon
              icon={Tick02Icon}
              className="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
            <span>14-day free trial</span>
          </div>
          <div className="inline-flex items-center gap-2 text-[15px]">
            <HugeiconsIcon
              icon={Tick02Icon}
              className="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
            <span>No credit card</span>
          </div>
          <div className="inline-flex items-center gap-2 text-[15px]">
            <HugeiconsIcon
              icon={Tick02Icon}
              className="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
