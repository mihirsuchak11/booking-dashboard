import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface LeftPanelStepDetailsProps {
  stepNumber: string;
  title: string;
  description: string;
  icon: LucideIcon;
  onBack?: () => void;
}

/**
 * LeftPanelStepDetails - Step information panel for left side
 * 
 * Displays step number, title, description, and icon on the left panel.
 * Used in onboarding pages to show step context.
 */
export function LeftPanelStepDetails({ 
  stepNumber, 
  title, 
  description, 
  icon: Icon,
  onBack 
}: LeftPanelStepDetailsProps) {
  return (
    <div className="hidden lg:flex items-center justify-center relative overflow-hidden h-full">
      {/* Gradient Background */}
      <div 
        className="absolute inset-0" 
        style={{ background: `linear-gradient(to bottom right, var(--auth-panel-bg-from), var(--auth-panel-bg-via), var(--auth-panel-bg-to))` }}
      />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 [background-size:32px_32px]" 
        style={{ backgroundImage: `linear-gradient(to right, var(--auth-grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--auth-grid-color) 1px, transparent 1px)` }}
      />

      {/* Content */}
      <div className="relative z-10 p-8 md:p-12 max-w-md w-full space-y-6">
        {/* Back Button */}
        {onBack && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 -ml-2 mb-4 text-[var(--auth-text-muted)]" 
            onClick={onBack}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Step Number */}
        <div className="text-sm font-medium text-[var(--auth-text-muted)]">
          {stepNumber}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--auth-text-primary)]">
          {title}
        </h1>

        {/* Description */}
        <p className="text-base leading-relaxed text-[var(--auth-text-secondary)]">
          {description}
        </p>

        {/* Icon */}
        <div className="pt-4">
          <div 
            className="w-20 h-20 rounded-full mx-auto flex items-center justify-center bg-[var(--auth-icon-bg)] border border-[var(--auth-icon-border)]"
          >
            <Icon className="h-10 w-10 text-[var(--auth-icon-color)]" />
          </div>
        </div>
      </div>

      {/* Corner Accents */}
      <div 
        className="absolute top-0 right-0 w-32 h-32" 
        style={{ background: `linear-gradient(to bottom left, var(--auth-card-border), transparent)` }}
      />
      <div 
        className="absolute bottom-0 left-0 w-32 h-32" 
        style={{ background: `linear-gradient(to top right, var(--auth-grid-color), transparent)` }}
      />
    </div>
  );
}
