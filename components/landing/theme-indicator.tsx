"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ThemeIndicatorProps {
  name: string;
  description: string;
  inspiration: string;
}

export function ThemeIndicator({
  name,
  description,
  inspiration,
}: ThemeIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 max-w-sm",
        "animate-in fade-in slide-in-from-top-2 duration-300"
      )}
    >
      <div className="relative rounded-2xl border border-border/50 bg-background/95 backdrop-blur-sm p-4 shadow-lg ring-1 ring-foreground/5">
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-background shadow-sm hover:bg-muted"
          onClick={() => setIsVisible(false)}
          aria-label="Close theme indicator"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </Button>

        <div className="space-y-2 pr-6">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-foreground">{name}</h3>
            <Badge variant="outline" className="text-xs">
              {inspiration}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
