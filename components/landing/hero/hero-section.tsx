import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, PlayIcon } from "@hugeicons/core-free-icons";
import { HeroBackground } from "./hero-background";
import { SocialProofBar } from "./social-proof-bar";
import { PhoneMockup } from "./phone-mockup";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen scroll-mt-24 overflow-hidden flex items-center bg-[#0a0a0f]"
    >
      <HeroBackground />
      <div className="container relative z-10 mx-auto px-[20px] pt-24 lg:pt-28 pb-10 sm:pb-12 lg:pb-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <div className="flex flex-col gap-5 lg:pl-8">
            <h1 className="text-3xl font-bold tracking-tight leading-tight sm:text-4xl lg:text-5xl text-white">
              Your AI Receptionist That Actually Sounds Human
            </h1>

            <p className="text-sm text-white/70 sm:text-base lg:text-lg max-w-none sm:max-w-xl leading-relaxed">
              An AI-powered voice agent that answers calls, books appointments, and handles customer questions—just like your best employee, but available around the clock.
            </p>

            <SocialProofBar />

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
              <Button
                size="xl"
                variant="default"
                className="w-full sm:w-auto h-11 sm:h-12 px-4 sm:px-6 text-sm sm:text-base bg-primary text-white hover:bg-primary/80"
                asChild
              >
                <a href="#demo" className="flex w-full items-center justify-center gap-2" aria-label="Try a Live Demo Call">
                  Try a Live Demo Call
                  <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} aria-hidden="true" />
                </a>
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="w-full sm:w-auto h-11 sm:h-12 px-4 sm:px-6 text-sm sm:text-base border-white/20 bg-transparent text-white hover:bg-white/10 hover:border-white/40 hover:text-white transition-all"
                asChild
              >
                <a href="#video" className="flex w-full items-center justify-center gap-2" aria-label="Watch How It Works">
                  <HugeiconsIcon icon={PlayIcon} strokeWidth={2} aria-hidden="true" />
                  Watch How It Works
                </a>
              </Button>
            </div>
          </div>

          {/* Right Column - Phone Mockup */}
          <div className="flex justify-center lg:justify-end">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
