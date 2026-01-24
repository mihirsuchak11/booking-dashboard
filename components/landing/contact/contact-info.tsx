import { HugeiconsIcon } from "@hugeicons/react";
import { MailIcon, Call02Icon } from "@hugeicons/core-free-icons";

export function ContactInfo() {
  return (
    <address className="flex flex-col space-y-8 not-italic">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <HugeiconsIcon
              icon={MailIcon}
              className="h-6 w-6 text-primary"
              aria-hidden="true"
            />
          </div>
          <div>
            <div className="text-white font-semibold text-lg mb-2">Email Us</div>
            <p className="text-white/70 text-sm mb-3">
              Send us an email and we'll respond within 24 hours.
            </p>
            <a
              href="mailto:hello@bookingagent.com"
              className="text-primary hover:text-primary/80 transition-colors text-base font-medium"
            >
              hello@bookingagent.com
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <HugeiconsIcon
              icon={Call02Icon}
              className="h-6 w-6 text-primary"
              aria-hidden="true"
            />
          </div>
          <div>
            <div className="text-white font-semibold text-lg mb-2">Call Us</div>
            <p className="text-white/70 text-sm mb-3">
              Speak directly with our team during business hours.
            </p>
            <a
              href="tel:+1234567890"
              className="text-primary hover:text-primary/80 transition-colors text-base font-medium"
            >
              +1 (234) 567-890
            </a>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
        <p className="text-white/80 text-sm leading-relaxed">
          <span className="font-semibold text-white">Business Hours:</span>
          <br />
          Monday - Friday: 9:00 AM - 6:00 PM EST
          <br />
          Saturday: 10:00 AM - 4:00 PM EST
          <br />
          Sunday: Closed
        </p>
      </div>
    </address>
  );
}
