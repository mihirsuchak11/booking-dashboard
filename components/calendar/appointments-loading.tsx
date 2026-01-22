import { Skeleton } from "@/components/ui/skeleton";

export function AppointmentsLoading() {
  return (
    <div className="flex flex-col h-full w-full">
      {/* Header skeleton */}
      <div className="border-b border-border bg-background px-6 py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>
        </div>
      </div>

      {/* Controls skeleton */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-48" />
          <div className="ml-auto" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      {/* Calendar skeleton */}
      <div className="flex-1 flex">
        {/* Hours column */}
        <div className="w-[104px] border-r border-border">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-[120px] border-b border-border p-3"
            >
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>

        {/* Days columns */}
        <div className="flex-1 flex">
          {Array.from({ length: 7 }).map((_, dayIndex) => (
            <div
              key={dayIndex}
              className="flex-1 border-r border-border last:border-r-0 min-w-44"
            >
              {/* Day header */}
              <div className="p-2 border-b border-border">
                <Skeleton className="h-4 w-16" />
              </div>
              {/* Time slots */}
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-[120px] border-b border-border p-2">
                  {i % 3 === 0 && (
                    <Skeleton className="h-16 w-full rounded-lg" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

