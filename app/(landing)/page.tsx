import {
  FAQSection,
  FinalCTASection,
  BenefitsScrollWrapper,
  BenefitsContent,
  HowItWorksHorizontal,
  // HowItWorksSectionVertical,
  FooterSection,
  HeroSection,
  PartnerSection,
  PricingSection,
  TestimonialsSection,
  ContactSection,
} from "@/components/landing";

export default function Page() {
  return (
    <main id="main-content" tabIndex={-1}>
      <HeroSection />
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
