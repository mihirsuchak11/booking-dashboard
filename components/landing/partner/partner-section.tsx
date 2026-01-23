import { PartnerSlider } from "./partner-slider";
import { partners } from "./partner-data";

export function PartnerSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0a0a0f] py-16 lg:py-20">
      {/* Soft edges (top + bottom) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Subtle top divider so it doesn't feel like a hard cut */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* Bottom blend into the next section (Benefits: #07070c) */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent via-black/25 to-[#07070c]" />
        <svg
          className="absolute inset-x-0 bottom-0 h-10 w-full text-[#07070c]"
          viewBox="0 0 1440 40"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,8 C240,40 480,40 720,20 C960,0 1200,0 1440,18 L1440,40 L0,40 Z"
          />
        </svg>
      </div>

      {/* Section Header */}
      <div className="container mx-auto mb-10 px-[20px] text-center">
        <h2 className="sr-only">Trusted Partners</h2>
        <p className="text-sm font-medium uppercase tracking-wider text-white/50">
          Trusted by leading companies
        </p>
      </div>

      {/* Partner Slider - Full Width */}
      <PartnerSlider partners={partners} />
    </section>
  );
}
