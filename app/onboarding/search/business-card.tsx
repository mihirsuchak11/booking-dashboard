"use client";

import { MapPin, Phone, Star, Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { BusinessSearchResult } from "../actions";

interface BusinessCardProps {
    business: BusinessSearchResult;
    isSelected?: boolean;
    onSelect: (business: BusinessSearchResult) => void;
}

export function BusinessCard({ business, isSelected, onSelect }: BusinessCardProps) {
    return (
        <button
            onClick={() => onSelect(business)}
            className={cn(
                "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
                "hover:border-primary/50 hover:bg-accent/50 hover:shadow-md",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isSelected
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border bg-card"
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0 space-y-2">
                    {/* Business Name */}
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground truncate">
                            {business.name}
                        </h3>
                        {isSelected && (
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <Check className="w-3 h-3 text-primary-foreground" />
                            </div>
                        )}
                    </div>

                    {/* Category Badge */}
                    {business.category && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                            {business.category}
                        </span>
                    )}

                    {/* Address */}
                    {business.address && (
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{business.address}</span>
                        </div>
                    )}

                    {/* Phone */}
                    {business.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4 flex-shrink-0" />
                            <span>{business.phone}</span>
                        </div>
                    )}

                    {/* Website */}
                    {business.websiteUrl && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Globe className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate text-primary/80">
                                {business.websiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                            </span>
                        </div>
                    )}
                </div>

                {/* Rating */}
                {business.rating && (
                    <div className="flex items-center gap-1 text-sm font-medium text-amber-500 flex-shrink-0">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{business.rating.toFixed(1)}</span>
                    </div>
                )}
            </div>
        </button>
    );
}
