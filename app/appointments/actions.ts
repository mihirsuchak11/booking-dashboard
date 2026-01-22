"use server";

import { getAuthenticatedUserId } from "@/lib/auth-session";
import { getBusinessIdForUser } from "@/lib/business-auth";
import { getBookingsForWeek, CalendarAppointment } from "@/lib/dashboard-data";

export async function fetchAppointmentsForWeek(
  weekStartDate: string
): Promise<{ success: boolean; appointments: CalendarAppointment[]; error?: string }> {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return { success: false, appointments: [], error: "Unauthorized" };
    }

    const businessId = await getBusinessIdForUser(userId);
    if (!businessId) {
      return { success: false, appointments: [], error: "Business not found" };
    }

    const startDate = new Date(weekStartDate);
    const appointments = await getBookingsForWeek(businessId, startDate);

    return { success: true, appointments };
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return { success: false, appointments: [], error: "Failed to fetch appointments" };
  }
}

