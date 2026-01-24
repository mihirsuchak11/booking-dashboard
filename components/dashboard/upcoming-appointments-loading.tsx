import { Calendar } from "lucide-react";

export function UpcomingAppointmentsLoading() {
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
              {/* Loading badge shimmer */}
              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-muted animate-pulse h-5 w-6" />
            </div>
          </div>

          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-start justify-between p-3 rounded-lg border border-border"
              >
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                  <div className="h-3 bg-muted rounded w-28 animate-pulse"></div>
                </div>
                <div className="h-5 w-16 bg-muted rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shadow matching the actual component */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card to-transparent pointer-events-none rounded-b-3xl" />
    </div>
  );
}

