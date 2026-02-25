"use client";

import { cn } from "@/lib/utils";

interface SettingsFormHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Sticky header row for settings forms: title + description on the left,
 * actions (e.g. Save button) on the right. Sticks to top when scrolling.
 */
export function SettingsFormHeader({
  title,
  description,
  children,
  className,
}: SettingsFormHeaderProps) {
  return (
    <div
      className={cn(
        "sticky -top-4 z-10 -mt-4 flex flex-wrap items-start justify-between gap-4 border-b border-border bg-card pt-4 pb-4 sm:-top-6 sm:-mt-6 sm:pt-6 min-w-0",
        className
      )}
    >
      <div className="min-w-0">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}
