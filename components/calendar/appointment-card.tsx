"use client";

import { CalendarAppointment } from "@/lib/dashboard-data";
import { getEventDuration } from "./calendar-utils";
import { cn } from "@/lib/utils";

interface AppointmentCardProps {
  appointment: CalendarAppointment;
  style: React.CSSProperties;
  onClick?: () => void;
}

const STATUS_COLORS = {
  confirmed: {
    dot: "bg-green-500",
    border: "border-green-500/30",
    bg: "bg-green-500/5",
  },
  pending: {
    dot: "bg-yellow-500",
    border: "border-yellow-500/30",
    bg: "bg-yellow-500/5",
  },
  cancelled: {
    dot: "bg-red-500",
    border: "border-red-500/30",
    bg: "bg-red-500/5",
  },
  completed: {
    dot: "bg-blue-500",
    border: "border-blue-500/30",
    bg: "bg-blue-500/5",
  },
};

export function AppointmentCard({
  appointment,
  style,
  onClick,
}: AppointmentCardProps) {
  const duration = getEventDuration(appointment.startTime, appointment.endTime);
  const isVeryShortEvent = duration < 30;
  const isMediumEvent = duration >= 25 && duration < 60;
  const timeStr = `${appointment.startTime} - ${appointment.endTime}`;
  const statusColors = STATUS_COLORS[appointment.status];

  if (isVeryShortEvent) {
    return (
      <div
        className={cn(
          "absolute left-2 right-2 rounded-lg px-2 py-1 z-10 flex items-center gap-1.5 cursor-pointer hover:bg-muted transition-colors border",
          statusColors.bg,
          statusColors.border,
          appointment.status === "cancelled" && "opacity-60"
        )}
        style={style}
        onClick={onClick}
      >
        <div className={cn("size-1.5 rounded-full shrink-0", statusColors.dot)} />
        <h4 className={cn(
          "text-[10px] font-semibold text-foreground truncate flex-1",
          appointment.status === "cancelled" && "line-through"
        )}>
          {appointment.serviceName}
        </h4>
        <span className="text-[9px] text-muted-foreground shrink-0">
          {appointment.startTime}
        </span>
      </div>
    );
  }

  if (isMediumEvent) {
    return (
      <div
        className={cn(
          "absolute left-2 right-2 rounded-lg px-2.5 py-2 z-10 cursor-pointer hover:bg-muted transition-colors border",
          statusColors.bg,
          statusColors.border,
          appointment.status === "cancelled" && "opacity-60"
        )}
        style={style}
        onClick={onClick}
      >
        <div className="flex flex-col gap-1 h-full">
          <div className="flex items-center gap-1.5">
            <div className={cn("size-1.5 rounded-full shrink-0", statusColors.dot)} />
            <h4 className={cn(
              "text-[10px] font-semibold text-foreground truncate flex-1",
              appointment.status === "cancelled" && "line-through"
            )}>
              {appointment.serviceName}
            </h4>
          </div>
          <p className="text-[9px] text-muted-foreground">
            {appointment.customerName}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "absolute left-2 right-2 rounded-lg p-3 z-10 cursor-pointer hover:bg-muted transition-colors border",
        statusColors.bg,
        statusColors.border,
        appointment.status === "cancelled" && "opacity-60"
      )}
      style={style}
      onClick={onClick}
    >
      <div className="flex flex-col gap-1 h-full">
        <div className="flex-1 min-h-0">
          <div className="flex items-center gap-1.5 mb-1">
            <div className={cn("size-1.5 rounded-full shrink-0", statusColors.dot)} />
            <h4
              className={cn(
                "text-xs font-semibold text-foreground",
                duration <= 60 ? "truncate whitespace-nowrap" : "line-clamp-2",
                appointment.status === "cancelled" && "line-through"
              )}
            >
              {appointment.serviceName}
            </h4>
          </div>
          
          <p className="text-[11px] font-medium text-foreground mb-1">
            {appointment.customerName}
          </p>
          
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">
            {timeStr}
          </p>

          {appointment.servicePrice > 0 && (
            <p className="text-[10px] font-medium text-foreground">
              ${appointment.servicePrice}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-1 border-t border-border/50">
          <span className={cn(
            "text-[9px] font-medium uppercase tracking-wide",
            appointment.status === "confirmed" && "text-green-600",
            appointment.status === "pending" && "text-yellow-600",
            appointment.status === "cancelled" && "text-red-600",
            appointment.status === "completed" && "text-blue-600"
          )}>
            {appointment.status}
          </span>
        </div>
      </div>
    </div>
  );
}

