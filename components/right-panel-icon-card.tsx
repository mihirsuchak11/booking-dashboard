import { LucideIcon } from "lucide-react";

interface RightPanelIconCardProps {
  icon: LucideIcon;
  description: string;
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
export function RightPanelIconCard({ icon: Icon, description }: RightPanelIconCardProps) {
  return (
    <div 
      className="relative max-w-md w-full aspect-square rounded-xl flex items-center justify-center shadow-sm backdrop-blur-sm"
      style={{
        backgroundColor: `var(--auth-card-bg)`,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: `var(--auth-card-border)`
      }}
    >
      <div className="text-center p-8 space-y-4">
        <div 
          className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
          style={{ 
            backgroundColor: `var(--auth-icon-bg)`, 
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: `var(--auth-icon-border)` 
          }}
        >
          <Icon className="h-8 w-8" style={{ color: `var(--auth-icon-color)` }} />
        </div>
        <p className="text-sm" style={{ color: `var(--auth-text-secondary)` }}>{description}</p>
      </div>
    </div>
  );
}
