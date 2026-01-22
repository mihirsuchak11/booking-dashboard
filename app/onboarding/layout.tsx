"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { OnboardingProvider } from "@/contexts/onboarding-context";

const STEPS = [
  { path: "/onboarding/search", label: "Search" },
  { path: "/onboarding/questions", label: "Review" },
];

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentStepIndex = STEPS.findIndex((step) => pathname === step.path);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </OnboardingProvider>
  );
}


