"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Business, BusinessConfig } from "@/types/database";
import {
  updateBusinessAction,
  updateBusinessConfigAction,
} from "@/app/settings/actions";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

interface ProfileTabProps {
  businessId: string;
  business: Business;
  config: BusinessConfig | null;
}

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Anchorage",
  "Pacific/Honolulu",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Australia/Sydney",
  "Pacific/Auckland",
  "UTC",
];

export function ProfileTab({ businessId, business, config }: ProfileTabProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get extended profile from config
  const businessProfile = config?.working_hours?.businessProfile || {};

  // Form state - Business table fields
  const [name, setName] = useState(business.name);
  const [timezone, setTimezone] = useState(business.timezone);
  const [phone, setPhone] = useState(business.default_phone_number || "");

  // Form state - Extended fields from config
  const [description, setDescription] = useState(businessProfile.description || "");
  const [email, setEmail] = useState(businessProfile.email || "");
  const [website, setWebsite] = useState(businessProfile.website || "");
  const [address, setAddress] = useState(businessProfile.address || "");

  // Form state - AI settings
  const [greeting, setGreeting] = useState(config?.greeting || "");
  const [notesForAi, setNotesForAi] = useState(config?.notes_for_ai || "");

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      // Update business table
      const businessResult = await updateBusinessAction({
        name,
        timezone,
        default_phone_number: phone || null,
      });

      if (!businessResult.success) {
        setError(businessResult.error || "Failed to update business");
        setSaving(false);
        return;
      }

      // Update config with extended profile
      const existingWorkingHours = config?.working_hours || {};
      const configResult = await updateBusinessConfigAction(businessId, {
        greeting: greeting || null,
        notes_for_ai: notesForAi || null,
        working_hours: {
          ...existingWorkingHours,
          businessProfile: {
            description,
            email,
            website,
            address,
            businessType: businessProfile.businessType || "other",
            customBusinessType: businessProfile.customBusinessType || "",
          },
        },
      });

      if (!configResult.success) {
        setError(configResult.error || "Failed to update config");
        setSaving(false);
        return;
      }

      toast.success("Profile updated", {
        description: "Your business information was saved successfully.",
      });

      router.refresh();
    } catch (err) {
      console.error("Save error:", err);
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Business Information</h2>

        <div className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-muted-foreground">Business Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your business name"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-muted-foreground">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your business..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-muted-foreground">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-muted-foreground">Address</label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St, City, State, ZIP"
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Contact Information</h2>

        <div className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@yourbusiness.com"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-muted-foreground">Website</label>
            <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourbusiness.com"
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">AI Assistant Settings</h2>

        <div className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-muted-foreground">Greeting Message</label>
            <Input
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              placeholder="Hello! Thank you for calling..."
            />
            <p className="text-xs text-muted-foreground">
              The first message the AI will say when answering calls
            </p>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-muted-foreground">Notes for AI</label>
            <textarea
              value={notesForAi}
              onChange={(e) => setNotesForAi(e.target.value)}
              placeholder="Special instructions for the AI assistant..."
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <p className="text-xs text-muted-foreground">
              Additional context or instructions for the AI (e.g., special
              services, policies, or how to handle specific questions)
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
