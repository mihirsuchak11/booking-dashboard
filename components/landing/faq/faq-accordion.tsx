"use client";

import "./faq-section.css";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FAQ } from "./faq-data";

export function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  return (
    <div className="max-w-4xl mx-auto">
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq) => (
          <AccordionItem
            key={faq.id}
            value={`item-${faq.id}`}
            className="border-white/10 px-6 py-2 rounded-lg bg-white/3 backdrop-blur-sm mb-4 last:mb-0"
          >
            <AccordionTrigger className="text-white/90 hover:text-white text-left font-semibold text-base sm:text-lg py-4 hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-white/60 text-sm sm:text-base leading-relaxed pt-2 pb-4">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
