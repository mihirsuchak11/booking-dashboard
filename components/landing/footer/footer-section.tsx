import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const productLinks = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#demo", label: "Demo" },
  { href: "#changelog", label: "Changelog" },
];

const companyLinks = [
  { href: "#about", label: "About" },
  { href: "#blog", label: "Blog" },
  { href: "#careers", label: "Careers" },
];

const supportLinks = [
  { href: "#contact", label: "Contact" },
  { href: "#help", label: "Help Center" },
  { href: "#status", label: "Status" },
];

const legalLinks = [
  { href: "#privacy", label: "Privacy" },
  { href: "#terms", label: "Terms" },
];

const socialLinks = [
  { href: "#twitter", label: "Twitter" },
  { href: "#linkedin", label: "LinkedIn" },
];

export function FooterSection() {
  return (
    <footer className="bg-[#0a0a0f] border-t border-white/10">
      <div className="container mx-auto px-[20px] py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Logo and Tagline */}
          <div className="lg:col-span-2">
            <a href="#home" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">AI</span>
              </div>
              <span className="text-lg font-semibold tracking-tight text-white">
                Booking Agent
              </span>
            </a>
            <p className="text-white/70 text-sm max-w-md">
              Your AI receptionist for the modern age.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Product
            </h2>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/60 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Company
            </h2>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/60 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Support
            </h2>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/60 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-12" />

        {/* Newsletter Section */}
        <div className="mb-12">
          <h2 className="text-white font-semibold mb-3 text-sm">
            Get product updates
          </h2>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md">
            <div className="flex-1">
              <Label htmlFor="newsletter-email" className="sr-only">
                Email address for newsletter
              </Label>
              <Input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary"
              />
            </div>
            <Button
              type="submit"
              className="bg-primary text-white hover:bg-primary/80 whitespace-nowrap"
            >
              Subscribe
            </Button>
          </form>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-12" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} Booking Agent. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            {/* Legal Links */}
            <div className="flex items-center gap-4">
              {legalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-white/60 text-sm hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-white/60 text-sm hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
