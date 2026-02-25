"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Business, BusinessConfig, Subscription, Invoice } from "@/types/database";
import { ProfileTab } from "./profile-tab";
import { HoursTab } from "./hours-tab";
import { ServicesTab } from "./services-tab";
import { FAQsTab } from "./faqs-tab";
import { DangerZoneTab } from "./danger-zone-tab";
import { SubscriptionTab } from "./subscription-tab";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Briefcase,
  HelpCircle,
  Clock,
  CreditCard,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsTabsProps {
  businessId: string;
  business: Business;
  config: BusinessConfig | null;
  userId: string;
  subscription: Subscription | null;
  invoices?: Invoice[];
  invoicesError?: string;
}

type TabValue = "profile" | "services" | "faqs" | "hours" | "subscription" | "danger";

interface NavItem {
  value: TabValue;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  destructive?: boolean;
}

const navSections: { label: string; items: NavItem[] }[] = [
  {
    label: "Business",
    items: [
      { value: "profile", icon: User, title: "Profile", description: "Name, contact & timezone" },
      { value: "services", icon: Briefcase, title: "Services", description: "What you offer" },
      { value: "faqs", icon: HelpCircle, title: "FAQs", description: "Common questions" },
      { value: "hours", icon: Clock, title: "Hours", description: "Availability" },
    ],
  },
  {
    label: "Billing",
    items: [
      { value: "subscription", icon: CreditCard, title: "Subscription", description: "Plan & payment" },
    ],
  },
  {
    label: "Account",
    items: [
      { value: "danger", icon: AlertTriangle, title: "Danger Zone", description: "Delete business", destructive: true },
    ],
  },
];

const allNavItems: NavItem[] = navSections.flatMap((s) => s.items);

export function SettingsTabs({
  businessId,
  business,
  config,
  userId,
  subscription,
  invoices = [],
  invoicesError,
}: SettingsTabsProps) {
  return (
    <Tabs defaultValue="profile" className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8 px-4 lg:px-0">
      {/* Navigation - sidebar on desktop, horizontal scroll on mobile */}
      <TabsList className="w-full lg:w-72 lg:shrink-0 lg:sticky lg:top-4 pl-4 lg:pl-6 h-auto flex flex-col p-0 bg-transparent border-0 shadow-none rounded-xl gap-0">
        {/* Mobile: horizontal scroll of all items */}
        <div className="flex lg:hidden gap-1 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
          {allNavItems.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className={cn(
                "shrink-0 gap-2 rounded-lg px-3 py-2 h-auto font-medium text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground border border-transparent data-[state=active]:border-border",
                item.destructive &&
                  "data-[state=active]:text-destructive data-[state=active]:border-destructive/30"
              )}
            >
              <item.icon className="size-4" />
              {item.title}
            </TabsTrigger>
          ))}
        </div>
        {/* Desktop: grouped sidebar */}
        <nav className="hidden lg:flex lg:w-full flex-col gap-0">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {section.items.map((item) => (
                  <TabsTrigger
                    key={item.value}
                    value={item.value}
                    className={cn(
                      "w-full justify-start gap-3 rounded-lg px-3 py-2.5 h-auto font-medium text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground border border-transparent data-[state=active]:border-border hover:bg-muted/70 transition-colors",
                      item.destructive &&
                        "data-[state=active]:text-destructive data-[state=active]:border-destructive/30 hover:text-destructive"
                    )}
                  >
                    <item.icon className="size-4 shrink-0" />
                    <span>{item.title}</span>
                    <ChevronRight className="size-4 ml-auto opacity-50" />
                  </TabsTrigger>
                ))}
              </div>
              {section.label !== "Account" && (
                <Separator className="my-2" />
              )}
            </div>
          ))}
        </nav>
      </TabsList>

      {/* Content area */}
      <div className="flex-1 min-w-0 rounded-xl border bg-card p-4 sm:p-6 mr-4 lg:mr-6 shadow-sm">
        <TabsContent value="profile" className="mt-0">
          <ProfileTab
            businessId={businessId}
            business={business}
            config={config}
            title="Profile"
            description="Your business name, contact details and timezone"
          />
        </TabsContent>

        <TabsContent value="services" className="mt-0">
          <ServicesTab
            businessId={businessId}
            config={config}
            business={business}
            title="Services"
            description="Manage what you offer to customers"
          />
        </TabsContent>

        <TabsContent value="faqs" className="mt-0">
          <FAQsTab
            businessId={businessId}
            config={config}
            title="FAQs"
            description="Answers to common questions"
          />
        </TabsContent>

        <TabsContent value="hours" className="mt-0">
          <HoursTab
            businessId={businessId}
            config={config}
            title="Hours"
            description="When you're available for bookings"
          />
        </TabsContent>

        <TabsContent value="subscription" className="mt-0">
          <SubscriptionTab
            subscription={subscription}
            invoices={invoices}
            invoicesError={invoicesError}
            title="Subscription"
            description="Your plan and payment details"
          />
        </TabsContent>

        <TabsContent value="danger" className="mt-0">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
            <p className="text-sm text-muted-foreground">
              Irreversible actions for your account
            </p>
          </div>
          <DangerZoneTab businessId={businessId} businessName={business.name} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
