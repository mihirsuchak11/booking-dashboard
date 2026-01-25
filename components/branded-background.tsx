import "@/app/styles/branded-layout.css";

interface BrandedBackgroundProps {
  children: React.ReactNode;
}

/**
 * BrandedBackground - Premium background with gradient, glow effects, and grid pattern
 * 
 * Used for auth and onboarding pages to provide consistent premium styling.
 * Wraps page content with:
 * - Dark mode forced
 * - Gradient background
 * - Radial glow effects
 * - Subtle grid pattern
 * - Floating glow orbs
 * - Footer with copyright
 * 
 * @example
 * ```tsx
 * <BrandedBackground>
 *   <YourCardContent />
 * </BrandedBackground>
 * ```
 */
export function BrandedBackground({ children }: BrandedBackgroundProps) {
  return (
    <div 
      className="dark min-h-screen flex flex-col px-4 pt-4 relative overflow-hidden"
      style={{ background: `linear-gradient(to bottom, var(--auth-bg-from), var(--auth-bg-via), var(--auth-bg-to))` }}
    >
      {/* Premium Background Effects */}
      <div 
        className="absolute inset-0" 
        style={{ background: `radial-gradient(ellipse at top, var(--auth-glow-primary), transparent 50%)` }} 
      />
      <div 
        className="absolute inset-0" 
        style={{ background: `radial-gradient(ellipse at bottom right, var(--auth-glow-secondary), transparent 50%)` }} 
      />
      <div 
        className="absolute inset-0" 
        style={{ background: `radial-gradient(ellipse at bottom left, var(--auth-glow-tertiary), transparent 50%)` }} 
      />
      
      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 [background-size:64px_64px]" 
        style={{ backgroundImage: `linear-gradient(to right, var(--auth-grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--auth-grid-color) 1px, transparent 1px)` }}
      />
      
      {/* Floating Glow Orbs */}
      <div 
        className="absolute top-1/4 left-1/4 h-[400px] w-[400px] rounded-full blur-3xl" 
        style={{ background: `radial-gradient(circle at center, var(--auth-glow-primary), transparent 60%)` }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] rounded-full blur-3xl" 
        style={{ background: `radial-gradient(circle at center, var(--auth-glow-secondary), transparent 60%)` }}
      />

      {/* Content Area - Fills available height excluding footer */}
      <div 
        className="flex-1 flex items-center justify-center"
        style={{ minHeight: 'calc(100vh - 16px - 1.5rem - 16px - 8px)' }}
      >
        {children}
      </div>

      {/* Footer - Always at bottom with margin-top auto and 16px gap */}
      <div 
        className="mt-auto pt-4 mb-2 text-center text-xs" 
        style={{ color: `var(--auth-text-muted)` }}
      >
        © {new Date().getFullYear()} AI tele caller. All rights reserved.
      </div>
    </div>
  );
}
