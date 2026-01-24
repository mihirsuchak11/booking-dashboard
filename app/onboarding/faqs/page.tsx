import { BrandedBackground } from "@/components/branded-background";
import { BrandedCard } from "@/components/branded-card";
import { RightPanelBackground } from "@/components/right-panel-background";
import { RightPanelIconCard } from "@/components/right-panel-icon-card";
import { FAQsForm } from "./faqs-form";
import { MessageSquareText } from "lucide-react";

export default function OnboardingFAQsPage() {
  return (
    <BrandedBackground>
      <BrandedCard className="grid lg:grid-cols-2 min-h-[600px]">
        {/* Left Side - Form */}
        <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
          <div className="w-full max-w-lg mx-auto">
            {/* Logo/Brand */}
            <div className="text-xl font-semibold text-foreground mb-6">AI tele caller</div>
            <FAQsForm />
          </div>
        </div>

        {/* Right Column: Visual */}
        <RightPanelBackground>
          <RightPanelIconCard 
            icon={MessageSquareText} 
            description="Train your AI agent to answer common customer inquiries instantly" 
          />
        </RightPanelBackground>
      </BrandedCard>
    </BrandedBackground>
  );
}
