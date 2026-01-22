"use client";

import { format } from "date-fns";
import { useAppointmentsStore } from "@/store/appointments-store";
import { CalendarAppointment } from "@/lib/dashboard-data";
import { useEffect, useRef, useState } from "react";
import { AppointmentSheet } from "./appointment-sheet";
import { CalendarWeekHeader } from "./calendar-week-header";
import { CalendarHoursColumn } from "./calendar-hours-column";
import { CalendarDayColumn } from "./calendar-day-column";
import { getInitialScrollOffset } from "./calendar-utils";

export function AppointmentsCalendarView() {
  const {
    goToNextWeek,
    goToPreviousWeek,
    getWeekDays,
    getCurrentWeekAppointments,
    loading,
  } = useAppointmentsStore();
  const weekDays = getWeekDays();
  const appointments = getCurrentWeekAppointments();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] =
    useState<CalendarAppointment | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const today = new Date();

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const appointmentsByDay: Record<string, CalendarAppointment[]> = {};
  weekDays.forEach((day) => {
    const dayStr = format(day, "yyyy-MM-dd");
    appointmentsByDay[dayStr] = appointments.filter((a) => a.date === dayStr);
  });

  const isTodayInWeek = weekDays.some(
    (day) => format(day, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
  );

  // Scroll to current time on mount
  useEffect(() => {
    if (hasScrolled) return;

    const scrollToCurrentTime = () => {
      if (scrollContainerRef.current) {
        const scrollOffset = getInitialScrollOffset();
        scrollContainerRef.current.scrollTop = scrollOffset;
        setHasScrolled(true);
      }
    };

    // Try immediately and with delays to ensure DOM is ready
    scrollToCurrentTime();
    const timeout1 = setTimeout(scrollToCurrentTime, 100);
    const timeout2 = setTimeout(scrollToCurrentTime, 300);
    const timeout3 = setTimeout(scrollToCurrentTime, 500);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, [hasScrolled]);

  const handleAppointmentClick = (appointment: CalendarAppointment) => {
    setSelectedAppointment(appointment);
    setSheetOpen(true);
  };

  return (
    <>
      <AppointmentSheet
        appointment={selectedAppointment}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
      <div className="flex flex-col h-full w-full overflow-hidden">
        <CalendarWeekHeader
          weekDays={weekDays}
          onPreviousWeek={goToPreviousWeek}
          onNextWeek={goToNextWeek}
        />

        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-auto"
        >
          <div className="flex min-w-full w-max">
            <CalendarHoursColumn />

            {weekDays.map((day, dayIndex) => {
              const dayStr = format(day, "yyyy-MM-dd");
              const dayAppointments = appointmentsByDay[dayStr] || [];

              return (
                <CalendarDayColumn
                  key={day.toISOString()}
                  day={day}
                  dayIndex={dayIndex}
                  appointments={dayAppointments}
                  today={today}
                  isTodayInWeek={isTodayInWeek}
                  currentTime={currentTime}
                  onAppointmentClick={handleAppointmentClick}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
