// Region types for multi-region support
export type RegionCode = "US" | "IN";

export interface RegionConfig {
  code: RegionCode;
  name: string;
  currency: string;
  currencySymbol: string;
  locale: string;
  dateFormat: string;
  phonePrefix: string;
  defaultTimezone: string;
  timezones: string[];
  deepgramLanguage: string;
  twilioEdge: string;
}

export const REGIONS: Record<RegionCode, RegionConfig> = {
  US: {
    code: "US",
    name: "United States",
    currency: "USD",
    currencySymbol: "$",
    locale: "en-US",
    dateFormat: "MM/DD/YYYY",
    phonePrefix: "+1",
    defaultTimezone: "America/New_York",
    timezones: [
      "America/New_York",
      "America/Chicago",
      "America/Denver",
      "America/Los_Angeles",
      "America/Phoenix",
      "Pacific/Honolulu",
    ],
    deepgramLanguage: "en-US",
    twilioEdge: "ashburn",
  },
  IN: {
    code: "IN",
    name: "India",
    currency: "INR",
    currencySymbol: "₹",
    locale: "en-IN",
    dateFormat: "DD/MM/YYYY",
    phonePrefix: "+91",
    defaultTimezone: "Asia/Kolkata",
    timezones: ["Asia/Kolkata"],
    deepgramLanguage: "en-IN",
    twilioEdge: "singapore",
  },
};

export interface Business {
  id: string; // "biz_..."
  business_id: string; // User requested additional ID column
  owner_user_id: string; // Maps to auth.users.id
  name: string;
  phone: string | null;
  website: string | null;
  address: string | null;
  status: "onboarding" | "active" | "paused";

  // App logic fields (Keep these to avoid breaking dashboard)
  timezone: string;
  region: RegionCode;
  country_code: string;
  currency: string;
  locale: string;
  date_format: string;
  default_phone_number: string | null; // Keep for now as alias to phone

  created_at: string;
  updated_at: string;
}


export interface BusinessConfig {
  business_id: string;
  greeting: string | null;
  working_hours: any; // JSONB
  services?: any; // JSONB
  faqs?: any; // JSONB - { id, question, answer }[]
  booking_settings?: any; // JSONB
  business_profile?: any; // JSONB
  min_notice_hours: number;
  notes_for_ai: string | null;
  openai_model: string | null;
  created_at: string;
  updated_at: string;
}

export interface CallSession {
  id: string;
  business_id: string;
  call_sid: string;
  from_number: string;
  to_number: string;
  status: "in_progress" | "completed" | "failed";
  started_at: string;
  ended_at: string | null;
  summary: string | null;
  created_at: string;
}

export interface CallMessage {
  id: string;
  call_session_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

export interface Booking {
  id: string;
  business_id: string;
  call_session_id: string | null;
  customer_name: string;
  customer_phone: string | null;
  start_time: string;
  end_time: string;
  external_calendar_id: string | null;
  created_at: string;
}

export interface BusinessConfigWithDetails {
  business: Business;
  config: BusinessConfig | null;
}

export interface BusinessStats {
  totalCustomers: number;
  upcomingAppointments: number;
  appointmentsThisWeek: number;
  callsThisWeek: number;
}

/**
 * User profile data stored in our custom `users` table.
 * Synced automatically from auth.users via database trigger.
 */
export interface User {
  id: string; // UUID from auth.users
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  last_sign_in_at: string | null;
}

