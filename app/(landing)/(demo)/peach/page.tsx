import {
  FAQSection,
  FinalCTASection,
  BenefitsSection,
  FooterSection,
  HeroSection,
  HowItWorksSectionVertical,
  PartnerSection,
  PricingSection,
  TestimonialsSection,
  ContactSection,
} from "@/components/landing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Peach Theme - Landing Page",
  description: "Warm peach, soft and approachable - Soft & Approachable",
};

export default function Page() {
  return (
    <main>
      <HeroSection />
      <PartnerSection />
      <BenefitsSection />
      <HowItWorksSectionVertical />
      <PricingSection />
      <TestimonialsSection />
      <div className="relative bg-gradient-to-b from-[#0a0a0f] via-[#0f0f15] to-[#05050a]">
        <FAQSection />
        <FinalCTASection />
      </div>
      <ContactSection />
      <FooterSection />
    </main>
  );
}
