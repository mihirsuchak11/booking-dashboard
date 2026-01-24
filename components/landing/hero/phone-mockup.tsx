import "./phone-mockup.css";

const conversationBubbles = [
  { text: "Hi, I'd like to book an appointment", sender: "customer", delay: "0.3s" },
  { text: "Of course! What day works best for you?", sender: "ai", delay: "0.6s" },
  { text: "How about this Friday at 2pm?", sender: "customer", delay: "0.9s" },
  { text: "Perfect! I've booked you for Friday at 2pm. See you then!", sender: "ai", delay: "1.2s" },
];

export function PhoneMockup() {
  return (
    <div className="relative mx-auto w-full max-w-xs">
      {/* iPhone Frame */}
      <div className="animate-phone-appear relative mx-auto w-[280px]">
        {/* Outer Frame - Titanium-like bezel */}
        <div className="relative rounded-[3rem] bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 p-[3px] shadow-2xl shadow-black/50">
          {/* Inner bezel */}
          <div className="rounded-[2.85rem] bg-black p-[10px]">
            {/* Screen container */}
            <div className="relative overflow-hidden rounded-[2.25rem] bg-background">
              {/* Dynamic Island */}
              <div className="absolute left-1/2 top-3 z-20 flex h-[28px] w-[100px] -translate-x-1/2 items-center justify-center rounded-full bg-black">
                <div className="absolute left-4 h-2 w-2 rounded-full bg-zinc-900 ring-1 ring-zinc-800" />
              </div>

              {/* Status Bar */}
              <div className="flex items-center justify-between px-6 pb-1 pt-3">
                <span className="text-[10px] font-medium text-foreground">9:41</span>
                <div className="flex items-center gap-1">
                  <svg className="h-3 w-3 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3C8.5 3 5.5 4.5 3.5 7L2 5.5C4.5 2.5 8 1 12 1s7.5 1.5 10 4.5L20.5 7c-2-2.5-5-4-8.5-4z" opacity="0.3"/>
                    <path d="M12 7c-2.5 0-4.5 1-6 3L4.5 8.5C6.5 6 9 5 12 5s5.5 1 7.5 3.5L18 10c-1.5-2-3.5-3-6-3z" opacity="0.5"/>
                    <path d="M12 11c-1.5 0-2.5.5-3.5 1.5L7 11c1.5-1.5 3-2 5-2s3.5.5 5 2l-1.5 1.5c-1-1-2-1.5-3.5-1.5z" opacity="0.7"/>
                    <path d="M12 15c-.5 0-1 .5-1.5 1L9 14.5c1-.5 2-1 3-1s2 .5 3 1L13.5 16c-.5-.5-1-1-1.5-1z"/>
                  </svg>
                  <svg className="h-3.5 w-3.5 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="7" width="3" height="10" rx="1" opacity="0.3"/>
                    <rect x="7" y="5" width="3" height="12" rx="1" opacity="0.5"/>
                    <rect x="12" y="3" width="3" height="14" rx="1" opacity="0.7"/>
                    <rect x="17" y="1" width="3" height="16" rx="1"/>
                  </svg>
                  <div className="flex items-center">
                    <div className="h-3 w-5 rounded-sm border border-foreground/50 p-[1px]">
                      <div className="h-full w-3/4 rounded-[1px] bg-foreground" />
                    </div>
                    <div className="h-1.5 w-[2px] rounded-r-sm bg-foreground/50" />
                  </div>
                </div>
              </div>

              {/* Chat Header */}
              <div className="mt-4 flex items-center gap-3 border-b border-border/50 bg-card/50 px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                  <span className="text-xs font-bold text-primary-foreground">AI</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">AI Receptionist</p>
                  <p className="text-[10px] text-muted-foreground">Online • Booking Agent</p>
                </div>
                <div className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-sm shadow-green-500/50" />
              </div>

              {/* Chat Messages */}
              <div className="min-h-[260px] space-y-2.5 p-3">
                {conversationBubbles.map((bubble, index) => (
                  <div
                    key={index}
                    className={`animate-bubble-slide-up flex ${
                      bubble.sender === "customer" ? "justify-end" : "justify-start"
                    }`}
                    style={{ animationDelay: bubble.delay }}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                        bubble.sender === "customer"
                          ? "rounded-br-md bg-primary text-primary-foreground"
                          : "rounded-bl-md bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-xs leading-relaxed">{bubble.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="border-t border-border/50 bg-card/30 p-3">
                <div className="flex items-center gap-2 rounded-full border border-border/50 bg-background px-3 py-2">
                  <span className="flex-1 text-xs text-muted-foreground">Type a message...</span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                    <svg className="h-3 w-3 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Home Indicator */}
              <div className="flex justify-center pb-2 pt-1">
                <div className="h-1 w-28 rounded-full bg-foreground/20" />
              </div>
            </div>
          </div>
        </div>

        {/* Side Buttons */}
        {/* Silent Switch */}
        <div className="absolute -left-[3px] top-24 h-6 w-1 rounded-l-sm bg-zinc-700" />
        {/* Volume Up */}
        <div className="absolute -left-[3px] top-36 h-10 w-1 rounded-l-sm bg-zinc-700" />
        {/* Volume Down */}
        <div className="absolute -left-[3px] top-48 h-10 w-1 rounded-l-sm bg-zinc-700" />
        {/* Power Button */}
        <div className="absolute -right-[3px] top-36 h-14 w-1 rounded-r-sm bg-zinc-700" />
      </div>
    </div>
  );
}
