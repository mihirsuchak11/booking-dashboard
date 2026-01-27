import {
  getUpcomingBookings,
  getBusinessTimezone,
  formatBookingTime,
} from "@/lib/dashboard-data";
import { isSupabaseConfigured } from "@/lib/supabase-server";
import { Calendar, Phone, Clock, ExternalLink } from "lucide-react";

interface UpcomingAppointmentsWrapperProps {
  businessId: string;
}

function getUpcomingLabel(startTime: string, timezone: string): string {
  const now = new Date();
  const start = new Date(startTime);

  const diffMs = start.getTime() - now.getTime();
  const diffMinutes = diffMs / (1000 * 60);

  // 1) Very near-term: show \"In 1 hour / In 2 hours\"
  if (diffMs > 0) {
    const hours = Math.max(1, Math.round(diffMinutes / 60));
    if (hours <= 2) {
      return hours === 1 ? "In 1 hour" : `In ${hours} hours`;
    }
  }

  // 2) Today / Tomorrow / Upcoming in business timezone
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const todayStr = fmt.format(now);
  const startStr = fmt.format(start);

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowStr = fmt.format(tomorrow);

  if (startStr === todayStr) {
    return "Today";
  }

  if (startStr === tomorrowStr) {
    return "Tomorrow";
  }

  return "Upcoming";
}

function StatusBadge({
  status,
  startTime,
  timezone,
}: {
  status: "upcoming" | "in_progress" | "completed";
  startTime: string;
  timezone: string;
}) {
  const baseConfig = {
    upcoming: {
      className:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    in_progress: {
      className:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    completed: {
      className:
        "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    },
  } as const;

  const config = baseConfig[status];

  let label: string;
  if (status === "upcoming") {
    label = getUpcomingLabel(startTime, timezone);
  } else if (status === "in_progress") {
    label = "In Progress";
  } else {
    label = "Completed";
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.className}`}
    >
      {label}
    </span>
  );
}

export async function UpcomingAppointmentsWrapper({
  businessId,
}: UpcomingAppointmentsWrapperProps) {
  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    return (
      <div className="relative rounded-3xl border border-border bg-card p-6 max-h-[400px]">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="size-4 text-muted-foreground" />
          <h2 className="text-[15px] font-normal text-foreground tracking-[-0.45px]">
            Upcoming Appointments
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Configure Supabase to view appointments
        </p>
      </div>
    );
  }

  const [bookings, timezone] = await Promise.all([
    getUpcomingBookings(businessId, 10),
    getBusinessTimezone(businessId),
  ]);

  return (
    <div className="relative rounded-3xl border border-border bg-card max-h-[400px] overflow-hidden">
      <div className="h-full overflow-y-auto">
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <h2 className="text-[15px] font-normal text-foreground tracking-[-0.45px]">
                Upcoming Appointments
              </h2>
              {bookings.length > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {bookings.length}
                </span>
              )}
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="size-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No upcoming appointments
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                New bookings will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-start justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="size-3.5 text-muted-foreground shrink-0" />
                          <span className="text-sm font-medium text-foreground">
                            {formatBookingTime(booking.start_time, timezone)}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-foreground mb-1">
                          {booking.customer_name}
                        </p>
                        {booking.customer_phone && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Phone className="size-3 shrink-0" />
                            <span>{booking.customer_phone}</span>
                          </div>
                        )}
                      </div>
                      <StatusBadge
                        status={booking.status}
                        startTime={booking.start_time}
                        timezone={timezone}
                      />
                    </div>
                  </div>
                  <button
                    className="ml-3 flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors shrink-0"
                    title="View in calendar"
                  >
                    <ExternalLink className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pure CSS scroll shadow - stays fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-card to-transparent pointer-events-none rounded-b-3xl" />
    </div>
  );
}
