import { BrandedBackground } from "@/components/branded-background";
import { BrandedCard } from "@/components/branded-card";
import { RightPanelBackground } from "@/components/right-panel-background";
import { RightPanelIconCard } from "@/components/right-panel-icon-card";
import { SearchForm } from "./search-form";
import { Search } from "lucide-react";

export default function SearchBusinessPage() {
  return (
    <BrandedBackground>
      <BrandedCard className="grid lg:grid-cols-2 min-h-[600px]">
        {/* Left Side - Form */}
        <div className="flex flex-col p-6 md:p-10 lg:p-12">
          <div className="w-full max-w-sm flex flex-col h-full">
            {/* Logo/Brand */}
            <div className="text-xl font-semibold text-foreground mb-6 flex-shrink-0">AI tele caller</div>
            <SearchForm />
          </div>
        </div>

        {/* Right Column: Visual */}
        <RightPanelBackground>
          <RightPanelIconCard 
            icon={Search} 
            description="Search to automatically find your business details" 
          />
        </RightPanelBackground>
      </BrandedCard>
    </BrandedBackground>
  );
}
