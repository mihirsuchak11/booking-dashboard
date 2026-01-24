"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ContactForm() {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 lg:p-10 flex-1">
      <form className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white/90 text-sm font-medium">
            Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary h-12"
            aria-describedby="name-help"
            required
          />
          <p id="name-help" className="sr-only">Enter your full name</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-white/90 text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary h-12"
            aria-describedby="email-help"
            required
          />
          <p id="email-help" className="sr-only">Enter a valid email address</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-white/90 text-sm font-medium">
            Message
          </Label>
          <Textarea
            id="message"
            placeholder="Tell us how we can help..."
            rows={8}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary resize-none min-h-[180px]"
            aria-describedby="message-help"
            required
          />
          <p id="message-help" className="sr-only">Enter your message or inquiry</p>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-primary text-white hover:bg-primary/80 h-12 text-base font-semibold"
        >
          Send Message
        </Button>
      </form>
    </div>
  );
}
