"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { OnboardingProvider } from "@/contexts/onboarding-context";
import "@/app/styles/branded-layout.css";
import { Search, Package, MessageSquareText, ClipboardCheck, LucideIcon } from "lucide-react";

export interface OnboardingStep {
  path: string;
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    path: "/onboarding/search",
    label: "Search",
    title: "Find Your Business",
    description: "Enter your business name and location to get started",
    icon: Search,
  },
  {
    path: "/onboarding/services",
    label: "Services",
    title: "Services & Packages",
    description: "Define your service menu for AI to book appointments",
    icon: Package,
  },
  {
    path: "/onboarding/faqs",
    label: "FAQs",
    title: "Frequently Asked Questions",
    description: "Help AI answer common customer questions accurately",
    icon: MessageSquareText,
  },
  {
    path: "/onboarding/review",
    label: "Review",
    title: "Review & Finish",
    description: "Check your details before creating your AI agent",
    icon: ClipboardCheck,
  },
];

const STEPS = ONBOARDING_STEPS.map(step => ({ path: step.path, label: step.label }));

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
      {children}
    </OnboardingProvider>
  );
}
