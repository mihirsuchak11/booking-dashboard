"use client";

import { CalendarAppointment } from "@/lib/dashboard-data";
import {
  HOURS_24,
  HOUR_HEIGHT,
  getEventTop,
  getEventHeight,
} from "./calendar-utils";
import { AppointmentCard } from "./appointment-card";
import { CurrentTimeIndicator } from "./current-time-indicator";

interface CalendarDayColumnProps {
  day: Date;
  dayIndex: number;
  appointments: CalendarAppointment[];
  today: Date;
  isTodayInWeek: boolean;
  currentTime: Date;
  onScroll?: (index: number) => (e: React.UIEvent<HTMLDivElement>) => void;
  scrollRef?: (el: HTMLDivElement | null) => void;
  onAppointmentClick: (appointment: CalendarAppointment) => void;
}

export function CalendarDayColumn({
  day,
  dayIndex,
  appointments,
  today,
  isTodayInWeek,
  currentTime,
  onScroll,
  scrollRef,
  onAppointmentClick,
}: CalendarDayColumnProps) {
  return (
    <div
      ref={scrollRef}
      onScroll={onScroll?.(dayIndex)}
      className="flex-1 border-r border-border last:border-r-0 relative min-w-44"
    >
      {HOURS_24.map((hour) => (
        <div
          key={hour}
          className="border-b border-border"
          style={{ height: `${HOUR_HEIGHT}px` }}
        />
      ))}

      <CurrentTimeIndicator
        day={day}
        today={today}
        isTodayInWeek={isTodayInWeek}
        currentTime={currentTime}
      />

      {appointments.map((appointment) => {
        const top = getEventTop(appointment.startTime);
        const height = getEventHeight(appointment.startTime, appointment.endTime);

        return (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            style={{
              top: `${top + 4}px`,
              height: `${height - 8}px`,
            }}
            onClick={() => onAppointmentClick(appointment)}
          />
        );
      })}
    </div>
  );
}

