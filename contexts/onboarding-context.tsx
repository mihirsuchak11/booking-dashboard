"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { RegionCode, REGIONS } from "@/types/database";
import { getRegionFromTimezone } from "@/lib/region-utils";

export type BusinessType = "hospital" | "photography" | "salon" | "other";

export interface OperatingHours {
  day: string; // "monday", "tuesday", etc.
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const DEFAULT_HOURS: OperatingHours[] = DAYS.map((day) => ({
  day,
  isOpen: !["saturday", "sunday"].includes(day),
  openTime: "09:00",
  closeTime: "17:00",
}));

export interface BusinessInfo {
  name: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  timezone: string;
  type: BusinessType;
  customBusinessType?: string;
  // Region settings
  region: RegionCode;
  currency: string;
  locale: string;
  // Location info (single location embedded)
  address: string;
  operatingHours: OperatingHours[];
  // Booking settings
  bufferTime: number; // minutes between appointments
  advanceBookingDays: number; // how far ahead customers can book
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

export interface OnboardingState {
  businessInfo: BusinessInfo;
  services: Service[];
  faqs: FAQ[];
}

interface OnboardingContextType {
  state: OnboardingState;
  setBusinessInfo: (info: Partial<BusinessInfo>) => void;
  addService: (service: Service) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  removeService: (id: string) => void;
  addFAQ: (faq: FAQ) => void;
  removeFAQ: (id: string) => void;
  updateFAQ: (id: string, faq: Partial<FAQ>) => void;
  setAllData: (data: Partial<OnboardingState>) => void;
}

// Detect default region from browser timezone
const browserTimezone = typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC";
const defaultRegion = getRegionFromTimezone(browserTimezone);
const defaultRegionConfig = REGIONS[defaultRegion];

const defaultBusinessInfo: BusinessInfo = {
  name: "",
  description: "",
  phone: "",
  email: "",
  website: "",
  timezone: defaultRegionConfig?.defaultTimezone || "UTC",
  type: "other",
  customBusinessType: "",
  region: defaultRegion,
  currency: defaultRegionConfig?.currency || "USD",
  locale: defaultRegionConfig?.locale || "en-US",
  address: "",
  operatingHours: DEFAULT_HOURS,
  bufferTime: 15,
  advanceBookingDays: 30,
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

const STORAGE_KEY = "onboarding_state_v2";

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>({
    businessInfo: defaultBusinessInfo,
    services: [],
    faqs: [],
  });
  const [initialized, setInitialized] = useState(false);

  // Load from session storage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Merge with defaults to ensure structure
          setState((prev) => ({
            ...prev,
            ...parsed,
            businessInfo: { ...prev.businessInfo, ...parsed.businessInfo },
          }));
        } catch (e) {
          console.error("Failed to parse onboarding state", e);
        }
      }
      setInitialized(true);
    }
  }, []);

  // Save to session storage on change
  useEffect(() => {
    if (typeof window !== "undefined" && initialized) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, initialized]);

  const setBusinessInfo = (info: Partial<BusinessInfo>) => {
    setState((prev) => ({
      ...prev,
      businessInfo: { ...prev.businessInfo, ...info },
    }));
  };

  const addService = (service: Service) => {
    setState((prev) => ({
      ...prev,
      services: [...prev.services, service],
    }));
  };

  const updateService = (id: string, service: Partial<Service>) => {
    setState((prev) => ({
      ...prev,
      services: prev.services.map((srv) =>
        srv.id === id ? { ...srv, ...service } : srv
      ),
    }));
  };

  const removeService = (id: string) => {
    setState((prev) => ({
      ...prev,
      services: prev.services.filter((srv) => srv.id !== id),
    }));
  };

  const addFAQ = (faq: FAQ) => {
    setState((prev) => ({
      ...prev,
      faqs: [...prev.faqs, faq],
    }));
  };

  const removeFAQ = (id: string) => {
    setState((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((q) => q.id !== id),
    }));
  };

  const updateFAQ = (id: string, faq: Partial<FAQ>) => {
    setState((prev) => ({
      ...prev,
      faqs: prev.faqs.map((q) => (q.id === id ? { ...q, ...faq } : q)),
    }));
  };

  const setAllData = (data: Partial<OnboardingState>) => {
    setState((prev) => ({
      ...prev,
      ...data,
    }));
    // Also force save immediately for things like AI generation
    if (typeof window !== "undefined") {
      const merged = { ...state, ...data };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    }
  };

  // Prevent flicker by not rendering until initialized (optional, but good for consistent UI)
  // or just render default. Here we just render.

  return (
    <OnboardingContext.Provider
      value={{
        state,
        setBusinessInfo,
        addService,
        updateService,
        removeService,
        addFAQ,
        removeFAQ,
        updateFAQ,
        setAllData,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
