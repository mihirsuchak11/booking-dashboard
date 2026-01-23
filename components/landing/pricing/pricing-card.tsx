import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import type { PricingPlan } from "./pricing-data";

// Helper function to calculate original yearly price (monthly * 12)
function calculateOriginalYearlyPrice(monthlyPrice: string): string {
  const numericValue = parseFloat(monthlyPrice.replace("$", "").replace(",", "."));
  const originalYearly = numericValue * 12;
  return `$${originalYearly.toFixed(2).replace(".", ",")}`;
}

export function PricingCard({
  plan,
  billingPeriod,
}: {
  plan: PricingPlan;
  billingPeriod: "monthly" | "yearly";
}) {
  return (
    <Card
      className={`relative isolate flex h-full flex-col overflow-hidden rounded-3xl border border-white/15 py-0 shadow-lg backdrop-blur-sm gap-2 ${
        plan.isPopular
          ? "bg-gradient-to-b from-white/[0.19] via-white/[0.08] to-white/[0.09] shadow-[inset_0_-1px_0_rgba(0,0,0,0.15)]"
          : "bg-gradient-to-br from-white/10 to-white/5"
      }`}
    >
      {plan.isPopular && (
        <>
          <div className="pointer-events-none absolute inset-x-10 top-0 z-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)] opacity-80 blur-[0.5px]" />
        </>
      )}
      <CardHeader className="relative z-10 px-8 pb-4 pt-10">
        <div className="flex items-center justify-between mb-0">
          <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
          {plan.isPopular && (
            <Badge
              variant="secondary"
              className="bg-white/10 text-white border-white/20"
            >
              Most Popular
            </Badge>
          )}
        </div>
        <p className="text-sm text-white/70 mb-3 mt-0">{plan.description}</p>
        <div className="flex flex-col gap-1">
          {billingPeriod === "yearly" && plan.id !== "free" ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white/40 line-through">
                  {calculateOriginalYearlyPrice(plan.price)}
                </span>
                <span className="text-sm text-white/40 line-through">
                  /year
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold text-white">
                  {plan.yearlyPrice}
                </span>
                <span className="text-sm text-white/60">
                  /year
                </span>
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-primary/30 text-xs font-semibold ml-2"
                >
                  Save 20%
                </Badge>
              </div>
            </>
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">
                {plan.price}
              </span>
              <span className="text-sm text-white/60">
                /month
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative z-10 flex flex-1 flex-col px-6 pb-6 pt-0">
        <Button
          variant={plan.isPopular ? "default" : "outline"}
          className={`w-full mb-6 ${
            plan.isPopular
              ? "bg-primary text-primary-foreground hover:bg-primary/80"
              : "border-white/20 bg-white/5 text-white hover:bg-white/10"
          }`}
        >
          {plan.ctaText}
        </Button>

        <div className="pt-2 flex-1">
          <div className="-mx-6 mb-6">
            <Separator className="bg-white/15" />
          </div>
          <div className="text-xs font-medium uppercase tracking-wider text-white/60 mb-4 text-left">
            Features
          </div>
          <ul className="space-y-3">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <HugeiconsIcon
                  icon={Tick02Icon}
                  strokeWidth={2}
                  className="h-5 w-5 text-primary shrink-0 mt-0.5"
                />
                <span className="text-sm text-white/80">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
