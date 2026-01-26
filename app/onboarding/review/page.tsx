"use client";

import { usePathname } from "next/navigation";
import { BrandedBackground } from "@/components/branded-background";
import { BrandedCard } from "@/components/branded-card";
import { OnboardingStepsPanel } from "@/components/onboarding/onboarding-steps-panel";
import { ReviewForm } from "./review-form";
import { useRouter } from "next/navigation";
import { ONBOARDING_STEPS } from "../layout";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function OnboardingReviewPage() {
  const pathname = usePathname();
  const router = useRouter();
  
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
            {/* Back Button and Heading in same row */}
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                size="sm"
                className="text-muted-foreground hover:text-foreground flex-shrink-0"
              >
                <ChevronLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <h1 className="text-xl font-bold text-[var(--auth-text-primary)]">
                AI Tele Caller
              </h1>
            </div>
            {(() => {
              const currentStepIndex = ONBOARDING_STEPS.findIndex(step => step.path === pathname);
              const currentStep = currentStepIndex >= 0 ? ONBOARDING_STEPS[currentStepIndex] : null;
              if (currentStep) {
                return (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-[var(--auth-text-muted)]">
                      Step {currentStepIndex + 1} of {ONBOARDING_STEPS.length}
                    </div>
                    <h2 className="text-lg font-semibold text-[var(--auth-text-primary)]">
                      {currentStep.title}
                    </h2>
                  </div>
                );
              }
              return null;
            })()}
          </div>
          <div className="w-full max-w-4xl flex flex-col h-full min-h-0">
            <ReviewForm />
          </div>
        </div>
      </BrandedCard>
    </BrandedBackground>
  );
}
