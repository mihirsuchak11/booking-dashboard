"use client";

import { useEffect, useCallback } from "react";
import { AppointmentsHeader } from "./appointments-header";
import { AppointmentsControls } from "./appointments-controls";
import { AppointmentsCalendarView } from "./appointments-calendar-view";
import { useAppointmentsStore } from "@/store/appointments-store";
import { CalendarAppointment } from "@/lib/dashboard-data";
import { fetchAppointmentsForWeek } from "@/app/appointments/actions";

interface AppointmentsWrapperProps {
  businessId: string;
  businessName?: string;
  initialAppointments: CalendarAppointment[];
}

export function AppointmentsWrapper({
  businessId,
  businessName,
  initialAppointments,
}: AppointmentsWrapperProps) {
  const { setBusinessId, setAppointments, setFetchFunction } =
    useAppointmentsStore();

  // Create fetch function that uses server action
  const fetchFn = useCallback(async (weekStart: Date) => {
    const result = await fetchAppointmentsForWeek(weekStart.toISOString());
    if (result.success) {
      return result.appointments;
    }
    return [];
  }, []);

  // Initialize store on mount
  useEffect(() => {
    setBusinessId(businessId);
    setAppointments(initialAppointments);
    setFetchFunction(fetchFn);
  }, [businessId, initialAppointments, fetchFn, setBusinessId, setAppointments, setFetchFunction]);

  return (
    <div className="flex flex-col h-full w-full">
      <AppointmentsHeader businessName={businessName} />
      <AppointmentsControls />
      <div className="flex-1 overflow-hidden">
        <AppointmentsCalendarView />
      </div>
    </div>
  );
}
