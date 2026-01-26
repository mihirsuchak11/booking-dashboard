"use client";

import { usePathname } from "next/navigation";
import { BrandedBackground } from "@/components/branded-background";
import { BrandedCard } from "@/components/branded-card";
import { OnboardingStepsPanel } from "@/components/onboarding/onboarding-steps-panel";
import { SearchForm } from "./search-form";
import { ONBOARDING_STEPS } from "../layout";

export default function SearchBusinessPage() {
  const pathname = usePathname();

  return (
    <BrandedBackground>
      <BrandedCard className="grid lg:grid-cols-[1.5fr_4fr] h-full max-w-[1400px] w-full max-h-full">
        {/* Left Side: All Steps */}
        <OnboardingStepsPanel
          steps={ONBOARDING_STEPS}
          currentPath={pathname}
        />

        {/* Right Side - Form */}
        <div className="flex flex-col items-center pt-6 px-6 md:pt-10 md:px-10 lg:pt-12 lg:px-12 pb-0">
          {/* Mobile Header - Only visible on mobile */}
          <div className="w-full max-w-4xl lg:hidden mb-6">
            <h1 className="text-xl font-bold mb-4" style={{ color: `var(--auth-text-primary)` }}>
              AI Tele Caller
            </h1>
            {(() => {
              const currentStepIndex = ONBOARDING_STEPS.findIndex(step => step.path === pathname);
              const currentStep = currentStepIndex >= 0 ? ONBOARDING_STEPS[currentStepIndex] : null;
              if (currentStep) {
                return (
                  <div className="space-y-2">
                    <div className="text-sm font-medium" style={{ color: `var(--auth-text-muted)` }}>
                      Step {currentStepIndex + 1} of {ONBOARDING_STEPS.length}
                    </div>
                    <h2 className="text-lg font-semibold" style={{ color: `var(--auth-text-primary)` }}>
                      {currentStep.title}
                    </h2>
                  </div>
                );
              }
              return null;
            })()}
          </div>
          <div className="w-full max-w-4xl flex flex-col h-full min-h-0 lg:justify-center">
            <SearchForm />
          </div>
        </div>
      </BrandedCard>
    </BrandedBackground>
  );
}
