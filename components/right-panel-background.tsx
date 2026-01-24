import { cn } from "@/lib/utils";

interface RightPanelBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * RightPanelBackground - Themed right panel with gradient, grid, and corner accents
 * 
 * Used in split-layout pages for the visual/decorative right side.
 * Provides:
 * - Gradient background
 * - Grid pattern overlay
 * - Corner accent decorations
 * - Hidden on mobile (lg:flex)
 * 
 * @example
 * ```tsx
 * <RightPanelBackground>
 *   <YourIconCard />
 * </RightPanelBackground>
 * ```
 */
export function RightPanelBackground({ children, className }: RightPanelBackgroundProps) {
  return (
    <div className={cn("hidden lg:flex items-center justify-center relative overflow-hidden", className)}>
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
      {children}

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
