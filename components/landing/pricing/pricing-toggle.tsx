"use client";

import { useState } from "react";

export function PricingToggle({
  billingPeriod,
  setBillingPeriod,
}: {
  billingPeriod: "monthly" | "yearly";
  setBillingPeriod: (period: "monthly" | "yearly") => void;
}) {
  return (
    <div className="flex justify-center mb-12">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 p-1 backdrop-blur-sm">
        <button
          onClick={() => setBillingPeriod("monthly")}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
            billingPeriod === "monthly"
              ? "bg-white/10 text-white shadow-sm"
              : "text-white/60 hover:text-white/80"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingPeriod("yearly")}
          className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all ${
            billingPeriod === "yearly"
              ? "bg-white/10 text-white shadow-sm"
              : "text-white/60 hover:text-white/80"
          }`}
        >
          Yearly
          <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 text-[10px] font-bold leading-none rounded-full bg-gradient-to-r from-primary to-primary/80 text-white shadow-sm">
            20% OFF
          </span>
        </button>
      </div>
    </div>
  );
}
