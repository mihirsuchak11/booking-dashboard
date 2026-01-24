import { TestimonialsHeader } from "./testimonials-header";
import { TestimonialsSlider } from "./testimonials-slider";
import { testimonials } from "./testimonials-data";

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="relative isolate scroll-mt-24 overflow-hidden bg-[#07070c] py-24"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.16),transparent_55%)]" />
        <div className="absolute left-1/2 top-6 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_58%)] blur-2xl" />
        <div className="absolute left-1/2 top-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full border border-white/10 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_70%)]" />
        <div className="absolute left-1/2 top-24 h-[420px] w-[680px] -translate-x-1/2 rounded-full border border-white/10 opacity-25 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(rgba(255,255,255,0.75)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_78%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/50 to-black/85" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#07070c] via-[#07070c]/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#07070c] via-[#07070c]/70 to-transparent" />
      </div>
      <TestimonialsHeader />
      <TestimonialsSlider testimonials={testimonials} />
    </section>
  );
}
