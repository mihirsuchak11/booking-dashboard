"use client";

import { format } from "date-fns";
import {
  X,
  Phone,
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  FileText,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { CalendarAppointment } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

interface AppointmentSheetProps {
  appointment: CalendarAppointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatTime(time: string): string {
  const [hour, minute] = time.split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return format(date, "EEEE, MMMM dd, yyyy");
}

const STATUS_CONFIG = {
  confirmed: {
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-100",
    label: "Confirmed",
  },
  pending: {
    icon: AlertCircle,
    color: "text-yellow-600",
    bg: "bg-yellow-100",
    label: "Pending Confirmation",
  },
  cancelled: {
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-100",
    label: "Cancelled",
  },
  completed: {
    icon: CheckCircle2,
    color: "text-blue-600",
    bg: "bg-blue-100",
    label: "Completed",
  },
};

export function AppointmentSheet({
  appointment,
  open,
  onOpenChange,
}: AppointmentSheetProps) {
  if (!appointment) return null;

  const dateStr = formatDate(appointment.date);
  const startTimeStr = formatTime(appointment.startTime);
  const endTimeStr = formatTime(appointment.endTime);
  const statusConfig = STATUS_CONFIG[appointment.status];
  const StatusIcon = statusConfig.icon;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[480px] overflow-y-auto p-0 border-l [&>button]:hidden"
      >
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
            <div className="flex items-start justify-between mb-4">
              <div
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
                  statusConfig.bg,
                  statusConfig.color
                )}
              >
                <StatusIcon className="size-4" />
                {statusConfig.label}
              </div>
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-full"
                >
                  <X className="size-4" />
                </Button>
              </SheetClose>
            </div>

            <SheetTitle className="text-xl font-semibold text-foreground text-left">
              {appointment.serviceName}
            </SheetTitle>
            <p className="text-sm text-muted-foreground text-left">
              with {appointment.customerName}
            </p>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-6">
              {/* Date & Time */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Appointment Details
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <CalendarIcon className="size-4 text-muted-foreground" />
                    <span>{dateStr}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="size-4 text-muted-foreground" />
                    <span>
                      {startTimeStr} - {endTimeStr}
                    </span>
                  </div>
                  {appointment.servicePrice > 0 && (
                    <div className="flex items-center gap-3 text-sm">
                      <DollarSign className="size-4 text-muted-foreground" />
                      <span className="font-medium">
                        ${appointment.servicePrice}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-3 pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-foreground">
                  Customer Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="size-4 text-muted-foreground" />
                    {appointment.customerPhone ? (
                      <a
                        href={`tel:${appointment.customerPhone}`}
                        className="text-primary hover:underline"
                      >
                        {appointment.customerPhone}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">No phone provided</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {appointment.notes && (
                <div className="space-y-3 pt-4 border-t border-border">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <FileText className="size-4 text-muted-foreground" />
                    Notes
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {appointment.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-border bg-muted/30">
            <div className="flex gap-3">
              {appointment.status === "pending" && (
                <>
                  <Button className="flex-1" size="sm">
                    Confirm
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Reschedule
                  </Button>
                </>
              )}
              {appointment.status === "confirmed" && (
                <>
                  <Button variant="outline" size="sm" className="flex-1">
                    Reschedule
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Cancel
                  </Button>
                </>
              )}
              {appointment.status === "cancelled" && (
                <Button variant="outline" size="sm" className="flex-1">
                  Rebook
                </Button>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

