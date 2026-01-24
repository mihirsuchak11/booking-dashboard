import { FAQHeader } from "./faq-header";
import { FAQAccordion } from "./faq-accordion";
import { faqs } from "./faq-data";

export function FAQSection() {
  return (
    <section id="faq" className="relative scroll-mt-24 py-24">
      <div className="container mx-auto px-[20px]">
        <FAQHeader />
        <FAQAccordion faqs={faqs} />
      </div>
    </section>
  );
}
