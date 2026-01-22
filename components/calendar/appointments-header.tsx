"use client";

import { format } from "date-fns";
import { useAppointmentsStore } from "@/store/appointments-store";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Loader2 } from "lucide-react";

interface AppointmentsHeaderProps {
  businessName?: string;
}

export function AppointmentsHeader({ businessName }: AppointmentsHeaderProps) {
  const { today, getCurrentWeekAppointments, loading } = useAppointmentsStore();
  const appointments = getCurrentWeekAppointments();

  // Calculate stats from current week appointments
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayAppointments = appointments.filter((apt) => apt.date === todayStr);
  const stats = {
    total: todayAppointments.length,
    confirmed: todayAppointments.filter((apt) => apt.status === "confirmed")
      .length,
    pending: todayAppointments.filter((apt) => apt.status === "pending").length,
  };

  return (
    <div className="border-b border-border bg-background">
      <div className="px-3 md:px-6 py-2.5 md:py-3">
        <div className="flex items-center justify-between gap-2 md:gap-3 flex-nowrap">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <SidebarTrigger className="shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm md:text-base lg:text-lg font-semibold text-foreground truncate mb-0 md:mb-1">
                  {format(today, "MMMM dd, yyyy")}
                </h1>
                {loading && (
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                )}
              </div>
              <p className="hidden md:block text-xs text-muted-foreground">
                You have {stats.total} appointment{stats.total !== 1 ? "s" : ""}{" "}
                today
                {stats.pending > 0 && (
                  <span className="text-yellow-600">
                    {" "}
                    • {stats.pending} pending
                  </span>
                )}
                {stats.confirmed > 0 && (
                  <span className="text-green-600">
                    {" "}
                    • {stats.confirmed} confirmed
                  </span>
                )}
              </p>
            </div>
          </div>

          {businessName && (
            <div className="text-xs text-muted-foreground hidden lg:block">
              {businessName}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
