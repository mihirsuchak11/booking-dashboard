"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { BusinessConfig } from "@/types/database";
import { updateBusinessConfigAction } from "@/app/settings/actions";
import { Loader2, Save, Clock, Calendar } from "lucide-react";
import { toast } from "sonner";

interface HoursTabProps {
  businessId: string;
  config: BusinessConfig | null;
}

interface DayHours {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface WorkingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const DEFAULT_HOURS: WorkingHours = {
  monday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  tuesday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  wednesday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  thursday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  friday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  saturday: { isOpen: false, openTime: "09:00", closeTime: "17:00" },
  sunday: { isOpen: false, openTime: "09:00", closeTime: "17:00" },
};

const MIN_NOTICE_OPTIONS = [
  { value: 1, label: "1 hour" },
  { value: 2, label: "2 hours" },
  { value: 4, label: "4 hours" },
  { value: 12, label: "12 hours" },
  { value: 24, label: "24 hours" },
  { value: 48, label: "48 hours" },
];

const BUFFER_TIME_OPTIONS = [
  { value: 0, label: "No buffer" },
  { value: 5, label: "5 minutes" },
  { value: 10, label: "10 minutes" },
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 60, label: "1 hour" },
];

const ADVANCE_BOOKING_OPTIONS = [
  { value: 7, label: "1 week" },
  { value: 14, label: "2 weeks" },
  { value: 30, label: "1 month" },
  { value: 60, label: "2 months" },
  { value: 90, label: "3 months" },
];

export function HoursTab({ businessId, config }: HoursTabProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get booking settings from config
  const bookingSettings = config?.working_hours?.bookingSettings || {};

  // Parse working hours from config or use defaults
  const initialHours: WorkingHours =
    config?.working_hours && typeof config.working_hours === "object"
      ? { ...DEFAULT_HOURS, ...config.working_hours }
      : DEFAULT_HOURS;

  const [hours, setHours] = useState<WorkingHours>(initialHours);
  const [minNoticeHours, setMinNoticeHours] = useState(
    config?.min_notice_hours || 24
  );
  const [bufferTime, setBufferTime] = useState(bookingSettings.bufferTime || 15);
  const [advanceBookingDays, setAdvanceBookingDays] = useState(
    bookingSettings.advanceBookingDays || 30
  );

  const updateDay = (day: keyof WorkingHours, updates: Partial<DayHours>) => {
    setHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], ...updates },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      // Preserve existing data in working_hours
      const existingWorkingHours = config?.working_hours || {};

      const result = await updateBusinessConfigAction(businessId, {
        working_hours: {
          ...existingWorkingHours,
          // Update day hours
          ...hours,
          // Update booking settings
          bookingSettings: {
            bufferTime,
            advanceBookingDays,
          },
        },
        min_notice_hours: minNoticeHours,
      });

      if (!result.success) {
        setError(result.error || "Failed to update hours");
        setSaving(false);
        return;
      }

      toast.success("Hours updated", {
        description: "Your operating hours and booking settings were saved.",
      });

      router.refresh();
    } catch (err) {
      console.error("Save error:", err);
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const capitalizeDay = (day: string) =>
    day.charAt(0).toUpperCase() + day.slice(1);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Operating Hours</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Set when your business is available for appointments
        </p>

        <div className="space-y-4">
          {DAYS.map((day) => (
            <div
              key={day}
              className="flex items-center gap-4 py-2 border-b last:border-0"
            >
              <div className="w-28 flex items-center gap-2">
                <Checkbox
                  id={`${day}-open`}
                  checked={hours[day].isOpen}
                  onCheckedChange={(checked) =>
                    updateDay(day, { isOpen: !!checked })
                  }
                />
                <label
                  htmlFor={`${day}-open`}
                  className="text-sm font-medium text-muted-foreground cursor-pointer"
                >
                  {capitalizeDay(day)}
                </label>
              </div>

              {hours[day].isOpen ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="time"
                    value={hours[day].openTime}
                    onChange={(e) => updateDay(day, { openTime: e.target.value })}
                    className="w-32"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="time"
                    value={hours[day].closeTime}
                    onChange={(e) =>
                      updateDay(day, { closeTime: e.target.value })
                    }
                    className="w-32"
                  />
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Closed</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Booking Settings</h2>

        <div className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Minimum Notice Required
            </label>
            <select
              value={minNoticeHours}
              onChange={(e) => setMinNoticeHours(Number(e.target.value))}
              className="flex h-9 w-full max-w-xs rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {MIN_NOTICE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              How far in advance customers must book appointments
            </p>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Buffer Time Between Appointments
            </label>
            <select
              value={bufferTime}
              onChange={(e) => setBufferTime(Number(e.target.value))}
              className="flex h-9 w-full max-w-xs rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {BUFFER_TIME_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              Time gap between consecutive appointments
            </p>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Advance Booking Limit
            </label>
            <select
              value={advanceBookingDays}
              onChange={(e) => setAdvanceBookingDays(Number(e.target.value))}
              className="flex h-9 w-full max-w-xs rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {ADVANCE_BOOKING_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              How far in advance customers can book
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
