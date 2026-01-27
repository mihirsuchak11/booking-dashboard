import { LucideIcon } from "lucide-react";

interface RightPanelIconCardProps {
  icon: LucideIcon;
  description: string;
  title?: string;
}

/**
 * RightPanelIconCard - Themed icon card for right panel visual content
 * 
 * Displays a centered icon with description text inside a glass-morphism card.
 * Used inside RightPanelBackground for consistent visual styling.
 * 
 * @example
 * ```tsx
 * <RightPanelBackground>
 *   <RightPanelIconCard 
 *     icon={Search} 
 *     description="Search to find your business" 
 *   />
 * </RightPanelBackground>
 * ```
 */
export function RightPanelIconCard({ icon: Icon, description, title }: RightPanelIconCardProps) {
  return (
    <div 
      className="relative max-w-md w-full aspect-square rounded-xl flex flex-col items-center justify-center shadow-sm backdrop-blur-sm bg-[var(--auth-card-bg)] border border-[var(--auth-card-border)]"
    >
      {title && (
        <div className="absolute top-6 left-0 right-0 text-center">
          <div className="text-xl font-semibold text-[var(--auth-text-primary)]">{title}</div>
        </div>
      )}
      <div className="text-center p-8 space-y-4">
        <div 
          className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-[var(--auth-icon-bg)] border border-[var(--auth-icon-border)]"
        >
          <Icon className="h-8 w-8 text-[var(--auth-icon-color)]" />
        </div>
        <p className="text-sm text-[var(--auth-text-secondary)]">{description}</p>
      </div>
    </div>
  );
}
