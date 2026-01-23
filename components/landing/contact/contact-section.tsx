import { ContactHeader } from "./contact-header";
import { ContactForm } from "./contact-form";
import { ContactInfo } from "./contact-info";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-24 pt-16 pb-32 px-[20px] bg-gradient-to-b from-[#05050a] via-[#0a0a0f] to-[#0a0a0f]"
    >
      {/* Subtle glow effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.08)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(139,92,246,0.06)_0%,transparent_60%)] pointer-events-none" />
      
      <div className="max-lg:max-w-[800px] lg:max-w-6xl mx-auto relative z-10">
        <ContactHeader />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 items-stretch max-lg:max-w-[600px] lg:max-w-4xl mx-auto">
          <ContactForm />
          <ContactInfo />
        </div>
      </div>
    </section>
  );
}
