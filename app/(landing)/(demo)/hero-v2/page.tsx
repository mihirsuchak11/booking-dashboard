import {
  FAQSection,
  FinalCTASection,
  BenefitsScrollWrapper,
  BenefitsContent,
  FooterSection,
  HeroSectionV2,
  HowItWorksHorizontal,
  HowItWorksSectionVertical,
  PartnerSection,
  PricingSection,
  TestimonialsSection,
  ContactSection,
} from "@/components/landing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hero V2 - Landing Page",
  description: "Hero section with image variant",
};

export default function Page() {
  return (
    <main>
      <HeroSectionV2 />
      <PartnerSection />
      <BenefitsScrollWrapper>
        <BenefitsContent />
        <HowItWorksHorizontal />
      </BenefitsScrollWrapper>
      {/* <HowItWorksSectionVertical /> */}
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
