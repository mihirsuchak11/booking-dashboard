"use client";

import { Check } from "lucide-react";
import { OnboardingStep } from "@/app/onboarding/layout";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface OnboardingStepsPanelProps {
  steps: OnboardingStep[];
  currentPath: string;
  onBack?: () => void;
}

/**
 * OnboardingStepsPanel - Left panel showing all onboarding steps with different states
 * 
 * Displays:
 * - Completed steps: Checkmark + heading (compact)
 * - Active step: Icon + full content (title, description) - expanded
 * - Next step: Icon + heading (compact)
 * - Remaining steps: Step number + label (basic)
 */
export function OnboardingStepsPanel({
  steps,
  currentPath,
  onBack,
}: OnboardingStepsPanelProps) {
  // Normalize paths for matching (remove trailing slashes and handle exact matches)
  const normalizedCurrentPath = currentPath.replace(/\/$/, '');
  const currentStepIndex = steps.findIndex((step) => {
    const normalizedStepPath = step.path.replace(/\/$/, '');
    return normalizedStepPath === normalizedCurrentPath;
  });
  
  // Safeguard: if path not found, default to first step
  const safeCurrentStepIndex = currentStepIndex >= 0 ? currentStepIndex : 0;
  
  // Debug: Log the matching (remove in production)
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('OnboardingStepsPanel Debug:', {
      currentPath,
      normalizedCurrentPath,
      currentStepIndex,
      safeCurrentStepIndex,
      steps: steps.map(s => s.path),
    });
  }

  return (
    <div className="hidden lg:flex flex-col relative overflow-hidden h-full">
      {/* Gradient Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom right, var(--auth-panel-bg-from), var(--auth-panel-bg-via), var(--auth-panel-bg-to))`,
        }}
      />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 [background-size:32px_32px]"
        style={{
          backgroundImage: `linear-gradient(to right, var(--auth-grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--auth-grid-color) 1px, transparent 1px)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-6 md:p-8 overflow-y-auto">
        {/* Heading */}
        <h1
          className="text-xl font-bold mb-6"
          style={{ color: `var(--auth-text-primary)` }}
        >
          AI Tele Caller
        </h1>

        {/* Back Button */}
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 -ml-2 mb-4 self-start"
            onClick={onBack}
            style={{ color: `var(--auth-text-muted)` }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Steps List */}
        <div className="flex-1 space-y-4">
          {steps.map((step, index) => {
            const isCompleted = index < safeCurrentStepIndex;
            const isActive = index === safeCurrentStepIndex;
            const isNext = index === safeCurrentStepIndex + 1;
            const isRemaining = index > safeCurrentStepIndex + 1;
            const StepIcon = step.icon;

            // Completed Step - Compact with checkmark + heading
            if (isCompleted) {
              return (
                <div
                  key={step.path}
                  className="flex items-center gap-3 py-3 px-4 rounded-lg transition-all"
                  style={{
                    backgroundColor: `var(--auth-card-bg)`,
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: `var(--auth-card-border)`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: `var(--auth-icon-bg)`,
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: `var(--auth-icon-border)`,
                    }}
                  >
                    <Check
                      className="h-5 w-5 text-green-500"
                    />
                  </div>
                  <div className="flex-1">
                    <div
                      className="text-sm font-semibold"
                      style={{ color: `var(--auth-text-primary)` }}
                    >
                      {step.title}
                    </div>
                  </div>
                </div>
              );
            }

            // Active Step - Expanded with icon + full content
            if (isActive) {
              return (
                <div
                  key={step.path}
                  className="py-5 px-4 rounded-lg space-y-3"
                  style={{
                    backgroundColor: `var(--auth-card-bg)`,
                    borderWidth: "2px",
                    borderStyle: "solid",
                    borderColor: `var(--auth-icon-color)`,
                  }}
                >
                  {/* Step Number */}
                  <div
                    className="text-sm font-medium"
                    style={{ color: `var(--auth-text-muted)` }}
                  >
                    Step {index + 1}/{steps.length}
                  </div>

                  {/* Icon */}
                  <div className="flex justify-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: `var(--auth-icon-bg)`,
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: `var(--auth-icon-border)`,
                      }}
                    >
                      <StepIcon
                        className="h-8 w-8"
                        style={{ color: `var(--auth-icon-color)` }}
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <h2
                    className="text-xl font-semibold tracking-tight text-center"
                    style={{ color: `var(--auth-text-primary)` }}
                  >
                    {step.title}
                  </h2>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed text-center"
                    style={{ color: `var(--auth-text-secondary)` }}
                  >
                    {step.description}
                  </p>
                </div>
              );
            }

            // Next Step - Icon + heading (with reduced opacity)
            if (isNext) {
              return (
                <div
                  key={step.path}
                  className="flex items-center gap-3 py-3 px-4 rounded-lg"
                  style={{
                    backgroundColor: `var(--auth-card-bg)`,
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: `var(--auth-card-border)`,
                    opacity: 0.7,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: `var(--auth-icon-bg)`,
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: `var(--auth-icon-border)`,
                    }}
                  >
                    <StepIcon
                      className="h-5 w-5"
                      style={{ color: `var(--auth-text-muted)` }}
                    />
                  </div>
                  <div className="flex-1">
                    <div
                      className="text-sm font-semibold"
                      style={{ color: `var(--auth-text-primary)` }}
                    >
                      {step.title}
                    </div>
                  </div>
                </div>
              );
            }

            // Remaining Steps - Basic info
            return (
              <div
                key={step.path}
                className="flex items-center gap-3 py-2 px-4 rounded-lg"
                style={{
                  backgroundColor: `var(--auth-card-bg)`,
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: `var(--auth-card-border)`,
                  opacity: 0.6,
                }}
              >
                <div
                  className="text-xs font-medium"
                  style={{ color: `var(--auth-text-muted)` }}
                >
                  {index + 1}.
                </div>
                <div
                  className="text-sm"
                  style={{ color: `var(--auth-text-muted)` }}
                >
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
