"use client";

import { createContext, useContext, RefObject, ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  LayoutIcon,
  MoreHorizontalCircle01Icon,
  NotificationIcon,
  HelpCircleIcon,
} from "@hugeicons/core-free-icons";
import {
  benefitsData,
  benefitsSectionContent,
} from "./benefits-data";

interface BenefitsScrollContextType {
  activeIndex: number;
  cardsContainerRef: RefObject<HTMLDivElement | null>;
  cardsRef: RefObject<HTMLDivElement[]>;
}

const BenefitsScrollContext = createContext<BenefitsScrollContextType | null>(null);

export function useBenefitsScroll() {
  const context = useContext(BenefitsScrollContext);
  if (!context) {
    throw new Error("useBenefitsScroll must be used within BenefitsScrollWrapper");
  }
  return context;
}

export function BenefitsScrollProvider({
  children,
  activeIndex,
  cardsContainerRef,
  cardsRef,
}: {
  children: ReactNode;
  activeIndex: number;
  cardsContainerRef: RefObject<HTMLDivElement | null>;
  cardsRef: RefObject<HTMLDivElement[]>;
}) {
  return (
    <BenefitsScrollContext.Provider
      value={{ activeIndex, cardsContainerRef, cardsRef }}
    >
      {children}
    </BenefitsScrollContext.Provider>
  );
}

export function BenefitsContent() {
  const { activeIndex, cardsContainerRef, cardsRef } = useBenefitsScroll();

  return (
    <div className="container mx-auto px-[20px]">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center lg:items-center">
        {/* Left Panel - 40% */}
        <div className="w-full lg:w-[40%] shrink-0 relative z-50 lg:pl-4 lg:pl-8">
          <LeftPanel activeIndex={activeIndex} />
        </div>

        {/* Right Panel - 60% */}
        <div
          ref={cardsContainerRef}
          className="w-full lg:w-[60%] relative md:h-[520px] lg:pl-16"
        >
          <div
            className="flex flex-col gap-4 md:flex-none md:block relative md:h-[520px]"
            data-desktop-cards
          >
            {benefitsData.map((benefit, index) => (
              <div
                key={benefit.id}
                ref={(el) => {
                  if (el) {
                    if (!cardsRef.current) {
                      cardsRef.current = [];
                    }
                    cardsRef.current[index] = el;
                  }
                }}
                className="h-[350px] md:absolute md:top-0 md:left-0 md:h-full md:w-full md:will-change-transform"
              >
                <BenefitCard
                  benefit={benefit}
                  isActive={index === activeIndex}
                  isPrev={index < activeIndex}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LeftPanel({ activeIndex }: { activeIndex: number }) {
  const cardCount = benefitsData.length;

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <div className="flex flex-col gap-3 lg:gap-4">
        <p className="text-xs lg:text-sm font-medium text-primary uppercase tracking-wider">
          Benefits
        </p>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-white">
          {benefitsSectionContent.heading}
        </h2>
        <p className="text-sm sm:text-base lg:text-lg text-white/70 max-w-md leading-relaxed">
          {benefitsSectionContent.description}
        </p>
      </div>

      <div className="hidden md:flex items-center gap-1">
        {benefitsData.map((_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-xs lg:text-sm font-semibold transition-all duration-300 ${
                index <= activeIndex
                  ? "bg-primary text-white"
                  : "bg-white/10 text-white/50"
              }`}
            >
              {index + 1}
            </div>
            {index < cardCount - 1 && (
              <div className="relative mx-0.5 h-0.5 w-4 lg:w-6 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`absolute inset-0 origin-left rounded-full bg-primary transition-transform duration-300 ${
                    index < activeIndex ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface BenefitCardProps {
  benefit: (typeof benefitsData)[0];
  isActive: boolean;
  isPrev: boolean;
}

function BenefitCard({ benefit, isActive, isPrev }: BenefitCardProps) {
  const benefitIcons: Record<number, any> = {
    1: UserIcon,
    2: LayoutIcon,
    3: MoreHorizontalCircle01Icon,
    4: NotificationIcon,
    5: HelpCircleIcon,
  };

  const Icon = benefitIcons[benefit.id];

  return (
    <div
      className={`h-full w-full rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 flex flex-col border transition-shadow duration-200 ${
        isActive
          ? "bg-[#1a1a1f] border-white/20 shadow-[-30px_0_60px_-15px_rgba(0,0,0,0.9)]"
          : isPrev
            ? "bg-[#141419] border-white/8"
            : "bg-[#16161b] border-white/15 shadow-lg"
      }`}
    >
      <div className="flex-1 rounded-xl lg:rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 lg:mb-6 overflow-hidden relative">
        {/* Image placeholder */}
      </div>
      <div className="flex flex-col gap-2 lg:gap-3">
        <div className="flex items-center gap-2">
          {Icon && (
            <HugeiconsIcon
              icon={Icon}
              strokeWidth={2}
              className="h-4 w-4 lg:h-5 lg:w-5 text-white"
            />
          )}
          <h3 className="text-lg lg:text-xl font-semibold text-white">
            {benefit.title}
          </h3>
        </div>
        <p className="text-white/70 text-xs lg:text-sm leading-relaxed line-clamp-3">
          {benefit.description}
        </p>
      </div>
    </div>
  );
}
