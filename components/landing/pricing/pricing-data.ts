export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  yearlyPrice: string;
  description: string;
  features: string[];
  ctaText: string;
  isPopular?: boolean;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0,00",
    yearlyPrice: "$0,00",
    description: "Great for trying out Finament and for tiny teams",
    features: [
      "Account Aggregation",
      "Expense Tracking",
      "Budgeting Tools",
      "Transaction Insights",
      "Basic Security",
    ],
    ctaText: "Start for Free",
  },
  {
    id: "professional",
    name: "Professional",
    price: "$98,00",
    yearlyPrice: "$940,80",
    description: "Best for growing startups and growth companies",
    features: [
      "Everything in Free",
      "Customizable Dashboards",
      "Advanced Budgeting",
      "Investment Tracking",
      "Enhanced Security",
    ],
    ctaText: "Sign Up with Professional",
    isPopular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$160,00",
    yearlyPrice: "$1,536,00",
    description: "Best for large teams needing high security",
    features: [
      "Financial Planning Tools",
      "Priority Support",
      "Premium Widgets",
      "Advanced Security",
      "Integration with 3rd-Party Services",
    ],
    ctaText: "Sign Up with Enterprise",
  },
];
