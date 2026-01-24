import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";
import type { Testimonial } from "./testimonials-data";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div>
      <Card className="py-0 h-full w-full rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm shadow-lg overflow-hidden flex flex-col transition-all duration-300">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex gap-1 mb-4">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <HugeiconsIcon
                key={i}
                icon={StarIcon}
                className="h-5 w-5 text-primary fill-primary"
                aria-hidden="true"
              />
            ))}
          </div>
          <blockquote className="text-white/90 text-base leading-relaxed mb-4 flex-1 min-h-0">
            "{testimonial.content}"
          </blockquote>
          <footer className="border-t border-white/15 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-white/10 flex-shrink-0 flex items-center justify-center">
                <span className="text-white/80 text-lg font-semibold" aria-hidden="true">
                  {testimonial.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-base">
                  {testimonial.name}
                </p>
                <p className="text-white/60 text-xs">
                  {testimonial.role}, {testimonial.company}
                </p>
              </div>
            </div>
          </footer>
        </CardContent>
      </Card>
    </div>
  );
}
