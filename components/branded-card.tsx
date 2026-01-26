import { cn } from "@/lib/utils";

interface BrandedCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * BrandedCard - Glass-morphism card container with shine effect
 * 
 * Provides consistent card styling with:
 * - Glass-morphism background (backdrop-blur)
 * - Themed border and shadow
 * - Top shine effect
 * 
 * @example
 * ```tsx
 * <BrandedCard className="grid lg:grid-cols-2 min-h-[600px]">
 *   <div>Left content</div>
 *   <div>Right content</div>
 * </BrandedCard>
 * ```
 */
export function BrandedCard({ children, className }: BrandedCardProps) {
  return (
    <div 
      className={cn(
        "relative w-full max-w-[1128px] backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl bg-[var(--auth-card-bg)] border border-[var(--auth-card-border)]",
        className
      )}
      style={{ 
        boxShadow: `0 25px 50px -12px var(--auth-card-shadow)` 
      }}
    >
      {/* Top shine effect */}
      <div 
        className="absolute inset-x-0 top-0 h-px" 
        style={{ background: `linear-gradient(to right, transparent, var(--auth-shine), transparent)` }}
      />
      
      {children}
    </div>
  );
}
