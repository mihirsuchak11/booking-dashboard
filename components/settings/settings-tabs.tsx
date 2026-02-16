"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Business, BusinessConfig } from "@/types/database";
import { ProfileTab } from "./profile-tab";
import { HoursTab } from "./hours-tab";
import { ServicesTab } from "./services-tab";
import { FAQsTab } from "./faqs-tab";
import { DangerZoneTab } from "./danger-zone-tab";

interface SettingsTabsProps {
  businessId: string;
  business: Business;
  config: BusinessConfig | null;
}

export function SettingsTabs({
  businessId,
  business,
  config,
}: SettingsTabsProps) {
  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="faqs">FAQs</TabsTrigger>
        <TabsTrigger value="hours">Hours</TabsTrigger>
        <TabsTrigger
          value="danger"
          className="text-destructive data-[state=active]:text-destructive"
        >
          Danger Zone
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <ProfileTab
          businessId={businessId}
          business={business}
          config={config}
        />
      </TabsContent>

      <TabsContent value="services">
        <ServicesTab businessId={businessId} config={config} business={business} />
      </TabsContent>

      <TabsContent value="faqs">
        <FAQsTab businessId={businessId} config={config} />
      </TabsContent>

      <TabsContent value="hours">
        <HoursTab businessId={businessId} config={config} />
      </TabsContent>

      <TabsContent value="danger">
        <DangerZoneTab businessId={businessId} businessName={business.name} />
      </TabsContent>
    </Tabs>
  );
}
