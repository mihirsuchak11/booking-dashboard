import { getCallLogWithBookings, getBusinessTimezone } from "@/lib/dashboard-data";
import { isSupabaseConfigured } from "@/lib/supabase-server";
import { CallLogTable } from "./call-log-table";
import { PhoneOff } from "lucide-react";

interface CallLogWrapperProps {
  businessId: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function CallLogWrapper({ businessId, searchParams }: CallLogWrapperProps) {
  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <PhoneOff className="size-4 text-muted-foreground" />
          <h2 className="text-[15px] font-normal text-foreground tracking-[-0.45px]">
            Call Log
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">Configure Supabase to view call logs</p>
      </div>
    );
  }

  // Get page from search params
  const pageParam = searchParams?.callsPage;
  const page = pageParam ? parseInt(pageParam as string, 10) : 1;
  const pageSize = 25;

  // Fetch data
  const [callLog, timezone] = await Promise.all([
    getCallLogWithBookings(businessId, page, pageSize),
    getBusinessTimezone(businessId),
  ]);

  return (
    <CallLogTable
      calls={callLog.calls}
      timezone={timezone}
      page={page}
      pageSize={pageSize}
      totalCount={callLog.totalCount}
    />
  );
}

