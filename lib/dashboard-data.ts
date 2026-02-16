import "server-only";

import { supabase } from "./supabase-server";
import {
  BusinessStats,
  Business,
  Booking,
  BusinessConfig,
} from "../types/database";

export type BookingStatus = "upcoming" | "in_progress" | "completed";
export type CallBookingStatus = "booked" | "booking_failed" | "not_attempted";

export interface UpcomingBooking {
  id: string;
  customer_name: string;
  customer_phone: string | null;
  start_time: string;
  end_time: string;
  status: BookingStatus;
}

export type AppointmentStatus =
  | "confirmed"
  | "pending"
  | "cancelled"
  | "completed";

export interface CalendarAppointment {
  id: string;
  title: string;
  startTime: string; // "09:00"
  endTime: string; // "10:00"
  date: string; // "2024-11-25"
  customerName: string;
  customerPhone: string;
  serviceName: string;
  servicePrice: number;
  status: AppointmentStatus;
  notes?: string;
}

export interface CallWithBookingInfo {
  id: string;
  started_at: string;
  from_number: string;
  to_number: string;
  call_status: "in_progress" | "completed" | "failed";
  booking_status: CallBookingStatus;
  booking_start_time: string | null;
  booking_customer_name: string | null;
}

export interface CallLogResult {
  calls: CallWithBookingInfo[];
  totalCount: number;
}

export interface ConversionFunnel {
  totalCalls: number;
  completedCalls: number;
  successfulBookings: number;
  conversionRate: number; // Percentage (0-100)
}

/**
 * Fetches basic information about a business by its ID.
 */
export async function getBusinessById(
  businessId: string
): Promise<Business | null> {
  try {
    const { data, error } = await supabase
      .from("businesses")
      .select("id, name, timezone, default_phone_number, created_at")
      .eq("id", businessId)
      .maybeSingle();

    if (error || !data) {
      console.error(
        `[Dashboard] Failed to fetch business ${businessId}:`,
        error?.message
      );
      return null;
    }

    return data as Business;
  } catch (error) {
    console.error("[Dashboard] Error in getBusinessById:", error);
    return null;
  }
}

/**
 * Fetches the timezone for a business from the database
 */
export async function getBusinessTimezone(businessId: string): Promise<string> {
  const { data, error } = await supabase
    .from("businesses")
    .select("timezone")
    .eq("id", businessId)
    .single();

  if (error || !data) {
    console.error(
      `[Dashboard] Failed to fetch timezone for business ${businessId}:`,
      error?.message
    );
    // Default to UTC if we can't fetch the timezone
    return "UTC";
  }

  return data.timezone;
}

/**
 * Computes the start of the current week (Monday 00:00) in the given timezone
 * Uses Postgres AT TIME ZONE for accurate timezone handling
 */
function getWeekStartQuery(timezone: string): string {
  // This PostgreSQL expression:
  // 1. Gets current timestamp in the business timezone
  // 2. Extracts the day of week (1 = Monday, 7 = Sunday)
  // 3. Subtracts days to get to Monday
  // 4. Truncates to midnight (00:00:00)
  return `
    date_trunc('day', 
      (now() AT TIME ZONE '${timezone}') - 
      (EXTRACT(DOW FROM (now() AT TIME ZONE '${timezone}')) - 1) * INTERVAL '1 day'
    ) AT TIME ZONE '${timezone}'
  `;
}

/**
 * Fetches all statistics for a business dashboard
 */
export async function getBusinessStats(
  businessId: string
): Promise<BusinessStats> {
  try {
    console.log(`[Dashboard] Fetching stats for business: ${businessId}`);

    // Fetch timezone first
    const timezone = await getBusinessTimezone(businessId);
    console.log(`[Dashboard] Using timezone: ${timezone}`);

    // Calculate 7 days ago for fallback queries
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Run all queries in parallel for better performance
    const [
      bookingsResult,
      upcomingResult,
      appointmentsWeekResult,
      callsWeekResult,
    ] = await Promise.all([
      // 1. Total Customers (distinct customer_phone from bookings)
      supabase
        .from("bookings")
        .select("customer_phone")
        .eq("business_id", businessId)
        .not("customer_phone", "is", null),

      // 2. Upcoming Appointments
      supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("business_id", businessId)
        .gte("start_time", new Date().toISOString()),

      // 3. Appointments This Week (using fallback - last 7 days)
      supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("business_id", businessId)
        .gte("start_time", sevenDaysAgo.toISOString())
        .lte("start_time", new Date().toISOString()),

      // 4. Calls This Week (using fallback - last 7 days)
      supabase
        .from("call_sessions")
        .select("*", { count: "exact", head: true })
        .eq("business_id", businessId)
        .gte("started_at", sevenDaysAgo.toISOString()),
    ]);

    // Process total customers (unique count)
    const uniquePhones = new Set(
      bookingsResult.data?.map((b) => b.customer_phone) || []
    );
    const totalCustomers = uniquePhones.size;

    console.log(`[Dashboard] Stats fetched successfully:`, {
      totalCustomers,
      upcomingAppointments: upcomingResult.count || 0,
      appointmentsThisWeek: appointmentsWeekResult.count || 0,
      callsThisWeek: callsWeekResult.count || 0,
    });

    return {
      totalCustomers,
      upcomingAppointments: upcomingResult.count || 0,
      appointmentsThisWeek: appointmentsWeekResult.count || 0,
      callsThisWeek: callsWeekResult.count || 0,
    };
  } catch (error) {
    console.error("[Dashboard] Error fetching business stats:", error);
    // Return zeros on error rather than throwing
    return {
      totalCustomers: 0,
      upcomingAppointments: 0,
      appointmentsThisWeek: 0,
      callsThisWeek: 0,
    };
  }
}

/**
 * Fetches conversion funnel metrics for a business
 * @param businessId - Business ID
 * @param dateFilter - Optional date to filter by month. If not provided, defaults to "this week" (last 7 days)
 */
export async function getConversionFunnel(
  businessId: string,
  dateFilter?: Date
): Promise<ConversionFunnel> {
  try {
    console.log(
      `[Dashboard] Fetching conversion funnel for business: ${businessId}`,
      dateFilter ? `for month: ${dateFilter.toISOString()}` : "for this week"
    );

    // Fetch timezone first
    const timezone = await getBusinessTimezone(businessId);

    // Determine date range based on filter
    let startDate: Date;
    let endDate: Date;

    if (dateFilter) {
      // Filter by selected month
      startDate = new Date(dateFilter.getFullYear(), dateFilter.getMonth(), 1);
      endDate = new Date(
        dateFilter.getFullYear(),
        dateFilter.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
    } else {
      // Default to "this week" (last 7 days)
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      endDate = new Date();
    }

    // Run queries in parallel
    const [totalCallsResult, completedCallsResult, bookingsResult] =
      await Promise.all([
        // 1. Total Calls
        supabase
          .from("call_sessions")
          .select("id", { count: "exact", head: true })
          .eq("business_id", businessId)
          .gte("started_at", startDate.toISOString())
          .lte("started_at", endDate.toISOString()),

        // 2. Completed Calls
        supabase
          .from("call_sessions")
          .select("id", { count: "exact", head: true })
          .eq("business_id", businessId)
          .eq("status", "completed")
          .gte("started_at", startDate.toISOString())
          .lte("started_at", endDate.toISOString()),

        // 3. Bookings (to find which calls resulted in bookings)
        supabase
          .from("bookings")
          .select("call_session_id")
          .eq("business_id", businessId)
          .not("call_session_id", "is", null)
          .gte("start_time", startDate.toISOString())
          .lte("start_time", endDate.toISOString()),
      ]);

    const totalCalls = totalCallsResult.count || 0;
    const completedCalls = completedCallsResult.count || 0;

    // Count unique call_session_ids that have bookings
    const bookingCallIds = new Set(
      bookingsResult.data?.map((b) => b.call_session_id) || []
    );
    const successfulBookings = bookingCallIds.size;

    // Calculate conversion rate: (successful bookings / completed calls) * 100
    const conversionRate =
      completedCalls > 0
        ? Math.round((successfulBookings / completedCalls) * 100)
        : 0;

    console.log(`[Dashboard] Conversion funnel fetched:`, {
      totalCalls,
      completedCalls,
      successfulBookings,
      conversionRate,
    });

    return {
      totalCalls,
      completedCalls,
      successfulBookings,
      conversionRate,
    };
  } catch (error) {
    console.error("[Dashboard] Error fetching conversion funnel:", error);
    return {
      totalCalls: 0,
      completedCalls: 0,
      successfulBookings: 0,
      conversionRate: 0,
    };
  }
}

/**
 * Helper function to determine booking status based on start and end times
 */
export function getBookingStatus(
  startTime: string,
  endTime: string,
  now: Date = new Date()
): BookingStatus {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (now < start) {
    return "upcoming";
  } else if (now >= start && now <= end) {
    return "in_progress";
  } else {
    return "completed";
  }
}

/**
 * Fetches upcoming bookings for a business
 */
export async function getUpcomingBookings(
  businessId: string,
  limit: number = 10
): Promise<UpcomingBooking[]> {
  try {
    console.log(
      `[Dashboard] Fetching upcoming bookings for business: ${businessId}`
    );

    const { data, error } = await supabase
      .from("bookings")
      .select("id, customer_name, customer_phone, start_time, end_time")
      .eq("business_id", businessId)
      .gte("start_time", new Date().toISOString())
      .order("start_time", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("[Dashboard] Error fetching upcoming bookings:", error);
      return [];
    }

    const now = new Date();
    const bookings: UpcomingBooking[] = (data || []).map((booking) => ({
      id: booking.id,
      customer_name: booking.customer_name || "Unknown",
      customer_phone: booking.customer_phone,
      start_time: booking.start_time,
      end_time: booking.end_time,
      status: getBookingStatus(booking.start_time, booking.end_time, now),
    }));

    console.log(
      `[Dashboard] Fetched ${bookings.length} upcoming bookings successfully`
    );

    return bookings;
  } catch (error) {
    console.error("[Dashboard] Error in getUpcomingBookings:", error);
    return [];
  }
}

/**
 * Fetches bookings for a specific week range and maps to CalendarAppointment format
 */
export async function getBookingsForWeek(
  businessId: string,
  weekStartDate: Date
): Promise<CalendarAppointment[]> {
  try {
    // Calculate week end (7 days from start)
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 7);

    console.log(
      `[Dashboard] Fetching bookings for week: ${weekStartDate.toISOString()} to ${weekEndDate.toISOString()}`
    );

    const { data, error } = await supabase
      .from("bookings")
      .select("id, customer_name, customer_phone, start_time, end_time")
      .eq("business_id", businessId)
      .gte("start_time", weekStartDate.toISOString())
      .lt("start_time", weekEndDate.toISOString())
      .order("start_time", { ascending: true });

    if (error) {
      console.error("[Dashboard] Error fetching bookings for week:", error);
      return [];
    }

    const now = new Date();
    const appointments: CalendarAppointment[] = (data || []).map((booking) => {
      const startDateTime = new Date(booking.start_time);
      const endDateTime = new Date(booking.end_time);

      // Determine status based on time
      let status: AppointmentStatus;
      if (endDateTime < now) {
        status = "completed";
      } else if (startDateTime <= now && endDateTime > now) {
        status = "confirmed"; // In progress
      } else {
        status = "confirmed"; // Upcoming
      }

      return {
        id: booking.id,
        title: `Appointment - ${booking.customer_name || "Customer"}`,
        startTime: startDateTime.toTimeString().slice(0, 5), // "HH:MM"
        endTime: endDateTime.toTimeString().slice(0, 5), // "HH:MM"
        date: startDateTime.toISOString().split("T")[0], // "YYYY-MM-DD"
        customerName: booking.customer_name || "Unknown",
        customerPhone: booking.customer_phone || "",
        serviceName: "Appointment",
        servicePrice: 0,
        status,
      };
    });

    console.log(`[Dashboard] Fetched ${appointments.length} bookings for week`);

    return appointments;
  } catch (error) {
    console.error("[Dashboard] Error in getBookingsForWeek:", error);
    return [];
  }
}

/**
 * Formats a date/time in the business timezone
 */
export function formatBookingTime(
  dateString: string,
  timezone: string
): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: timezone,
    }).format(date);
  } catch (error) {
    console.error("[Dashboard] Error formatting date:", error);
    return dateString;
  }
}

/**
 * Fetches call log with booking information for pagination
 */
export async function getCallLogWithBookings(
  businessId: string,
  page: number = 1,
  pageSize: number = 25
): Promise<CallLogResult> {
  try {
    console.log(
      `[Dashboard] Fetching call log for business: ${businessId}, page: ${page}`
    );

    const offset = (page - 1) * pageSize;

    // First, get total count
    const { count: totalCount } = await supabase
      .from("call_sessions")
      .select("*", { count: "exact", head: true })
      .eq("business_id", businessId);

    // Fetch call sessions for this page
    const { data: callSessions, error: callsError } = await supabase
      .from("call_sessions")
      .select("id, started_at, from_number, to_number, status")
      .eq("business_id", businessId)
      .order("started_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (callsError || !callSessions) {
      console.error("[Dashboard] Error fetching call sessions:", callsError);
      return { calls: [], totalCount: 0 };
    }

    // If no calls, return early
    if (callSessions.length === 0) {
      return { calls: [], totalCount: totalCount || 0 };
    }

    // Extract call session IDs
    const callSessionIds = callSessions.map((call) => call.id);

    // Fetch bookings associated with these call sessions
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("call_session_id, start_time, customer_name")
      .in("call_session_id", callSessionIds)
      .order("start_time", { ascending: true });

    if (bookingsError) {
      console.error("[Dashboard] Error fetching bookings:", bookingsError);
      // Continue with no bookings data
    }

    // Build a map of call_session_id -> earliest booking
    const bookingMap = new Map<
      string,
      { start_time: string; customer_name: string }
    >();
    if (bookings) {
      for (const booking of bookings) {
        if (
          booking.call_session_id &&
          !bookingMap.has(booking.call_session_id)
        ) {
          bookingMap.set(booking.call_session_id, {
            start_time: booking.start_time,
            customer_name: booking.customer_name,
          });
        }
      }
    }

    // Combine data and derive booking status
    const calls: CallWithBookingInfo[] = callSessions.map((call) => {
      const booking = bookingMap.get(call.id);
      let bookingStatus: CallBookingStatus;

      if (booking) {
        bookingStatus = "booked";
      } else if (call.status === "failed") {
        bookingStatus = "booking_failed";
      } else if (call.status === "completed") {
        bookingStatus = "not_attempted";
      } else {
        // in_progress
        bookingStatus = "not_attempted";
      }

      return {
        id: call.id,
        started_at: call.started_at,
        from_number: call.from_number,
        to_number: call.to_number,
        call_status: call.status as "in_progress" | "completed" | "failed",
        booking_status: bookingStatus,
        booking_start_time: booking?.start_time || null,
        booking_customer_name: booking?.customer_name || null,
      };
    });

    console.log(
      `[Dashboard] Fetched ${calls.length} calls (page ${page}/${Math.ceil(
        (totalCount || 0) / pageSize
      )})`
    );

    return {
      calls,
      totalCount: totalCount || 0,
    };
  } catch (error) {
    console.error("[Dashboard] Error in getCallLogWithBookings:", error);
    return { calls: [], totalCount: 0 };
  }
}

// ============================================================================
// Settings Data Functions
// ============================================================================

export interface BusinessWithConfig {
  business: Business;
  config: BusinessConfig | null;
}

/**
 * Fetches business with its config for settings page
 */
export async function getBusinessWithConfig(
  businessId: string
): Promise<BusinessWithConfig | null> {
  try {
    console.log(`[Settings] Fetching business with config: ${businessId}`);

    const [businessResult, configResult] = await Promise.all([
      supabase
        .from("businesses")
        .select("id, name, timezone, default_phone_number, region, country_code, currency, locale, date_format, phone, website, address, status, created_at")
        .eq("id", businessId)
        .single(),
      supabase
        .from("business_configs")
        .select("*")
        .eq("business_id", businessId)
        .maybeSingle(),
    ]);

    if (businessResult.error || !businessResult.data) {
      console.error(
        `[Settings] Failed to fetch business ${businessId}:`,
        businessResult.error?.message
      );
      return null;
    }

    return {
      business: businessResult.data as Business,
      config: configResult.data as BusinessConfig | null,
    };
  } catch (error) {
    console.error("[Settings] Error in getBusinessWithConfig:", error);
    return null;
  }
}

export async function updateBusiness(
  businessId: string,
  data: Partial<Business>
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`[Settings] Updating business ${businessId}:`, data);

    const { error, count } = await supabase
      .from("businesses")
      .update(data, { count: "exact" })
      .eq("id", businessId);

    if (error) {
      console.error(`[Settings] Failed to update business ${businessId}:`, error.message);
      return { success: false, error: error.message };
    }

    if (count === 0) {
      console.warn(`[Settings] No business found with ID ${businessId} to update.`);
      return { success: false, error: "RECORD_NOT_FOUND" };
    }

    return { success: true };
  } catch (error) {
    console.error("[Settings] Error in updateBusiness:", error);
    return { success: false, error: "Unknown error occurred" };
  }
}

/**
 * Updates or creates business config
 */
export async function updateBusinessConfig(
  businessId: string,
  data: Partial<
    Omit<BusinessConfig, "business_id" | "created_at" | "updated_at">
  >
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`[Settings] Updating business config ${businessId}:`, data);

    // Use upsert to create or update
    const { error } = await supabase.from("business_configs").upsert(
      {
        business_id: businessId,
        ...data,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "business_id" }
    );

    if (error) {
      console.error(`[Settings] Failed to update config for ${businessId}:`, JSON.stringify(error, null, 2));
      return { success: false, error: error.message };
    }

    console.log(`[Settings] Successfully updated config for ${businessId}`);
    return { success: true };
  } catch (error) {
    console.error("[Settings] Error in updateBusinessConfig:", error);
    return { success: false, error: "Unknown error occurred" };
  }
}

/**
 * Creates a new business and links it to a user
 */
export async function createBusiness(
  userId: string,
  data: {
    name: string;
    timezone: string;
    default_phone_number?: string | null;
    status?: "onboarding" | "active" | "paused"; // New status
    owner_user_id?: string; // Explicit owner
    address?: string | null;
    website?: string | null;
    phone?: string | null;
    region?: string;
    country_code?: string;
    currency?: string;
    locale?: string;
    date_format?: string;
  }
): Promise<{ success: boolean; businessId?: string; error?: string }> {
  try {
    console.log(`[Settings] Creating business for user ${userId}:`, data);

    // Generate a friendly business_id (e.g. biz_uuid)
    // For now we can just use the UUID as the base, or generate a new one.
    // Let's let the DB handle the ID generation for the primary key,
    // and we will start populating the new columns.

    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .insert({
        name: data.name,
        timezone: data.timezone,
        default_phone_number: data.default_phone_number || null,
        owner_user_id: userId, // PRIMARY LINK
        status: data.status || "onboarding",
        address: data.address || null,
        website: data.website || null,
        phone: data.phone || null,
        // business_id: `biz_${crypto.randomUUID().split('-')[0]}`, // Optional: if we want a short code
        region: data.region || "US",
        country_code: data.country_code || data.region || "US",
        currency: data.currency || "USD",
        locale: data.locale || "en-US",
        date_format: data.date_format || "MM/DD/YYYY",
      })
      .select("id")
      .single();

    if (businessError || !business) {
      console.error(`[Settings] Failed to create business:`, JSON.stringify(businessError, null, 2));
      return {
        success: false,
        error: businessError?.message || "Failed to create business",
      };
    }

    // Secondary Update: Set business_id to id (or fancy format) if needed
    // The user asked for "business_id" column. We can set it to the PK for consistency
    // or generate a fancy one. Let's start by updating it to match the ID for simplicity
    // unless we generate it client side.
    // Actually, let's just update it immediately to be safe.
    await supabase.from("businesses").update({ business_id: business.id }).eq("id", business.id);

    console.log(`[Settings] Successfully created business entry: ${business.id}`);

    // We NO LONGER need business_owners if we are using owner_user_id
    // But for safety during migration, we can keep it silent or remove it.
    // Given the user said "1:1", I will REMOVE the business_owners insert
    // to prove we are using the new schema.

    return { success: true, businessId: business.id };
  } catch (error) {
    console.error("[Settings] Error in createBusiness:", error);
    return { success: false, error: "Unknown error occurred" };
  }
}

/**
 * Deletes a business and all related data (cascades in DB)
 */
export async function deleteBusiness(
  businessId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`[Settings] Deleting business ${businessId}`);

    const { error } = await supabase
      .from("businesses")
      .delete()
      .eq("id", businessId);

    if (error) {
      console.error(`[Settings] Failed to delete business:`, error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("[Settings] Error in deleteBusiness:", error);
    return { success: false, error: "Unknown error occurred" };
  }
}
