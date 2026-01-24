import { Suspense } from "react";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatsWrapper } from "@/components/dashboard/stats-wrapper";
import { StatsLoading } from "@/components/dashboard/stats-loading";
import { ConversionFunnelWrapper } from "@/components/dashboard/conversion-funnel-wrapper";
import { UpcomingAppointmentsWrapper } from "@/components/dashboard/upcoming-appointments-wrapper";
import { UpcomingAppointmentsLoading } from "@/components/dashboard/upcoming-appointments-loading";
import { CallLogWrapper } from "@/components/dashboard/call-log-wrapper";
import { CallLogLoading } from "@/components/dashboard/call-log-loading";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getAuthenticatedUserId } from "@/lib/auth-session";
import { getBusinessIdForUser } from "@/lib/business-auth";
import { getBusinessById } from "@/lib/dashboard-data";

// Force dynamic rendering (no static generation)
export const dynamic = "force-dynamic";

interface DashboardPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    redirect("/signin");
  }

  const businessId = await getBusinessIdForUser(userId);

  if (!businessId) {
    // In the future we can redirect to onboarding; for now go back to sign-in.
    redirect("/signin");
  }

  const business = await getBusinessById(businessId);

  return (
    <SidebarProvider className="bg-sidebar">
      <DashboardSidebar />
      <div className="h-svh overflow-hidden lg:p-2 w-full">
        <div className="lg:border lg:rounded-md overflow-hidden flex flex-col items-center justify-start bg-container h-full w-full bg-background">
          <DashboardHeader businessName={business?.name} />

          <div className="w-full overflow-y-auto overflow-x-hidden p-4 h-full">
            <div className="mx-auto w-full space-y-6">
              {/* Stats Section */}
              <Suspense fallback={<StatsLoading />}>
                <StatsWrapper businessId={businessId} />
              </Suspense>

              {/* Conversion Funnel and Upcoming Appointments */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Suspense
                  fallback={
                    <div className="rounded-xl border border-border bg-card p-6 max-h-[400px]">
                      <div className="text-center py-8 text-muted-foreground">
                        Loading conversion funnel...
                      </div>
                    </div>
                  }
                >
                  <ConversionFunnelWrapper
                    businessId={businessId}
                    searchParams={searchParams}
                  />
                </Suspense>
                <Suspense fallback={<UpcomingAppointmentsLoading />}>
                  <UpcomingAppointmentsWrapper businessId={businessId} />
                </Suspense>
              </div>

              {/* Call Log Table */}
              <Suspense fallback={<CallLogLoading />}>
                <CallLogWrapper
                  businessId={businessId}
                  searchParams={searchParams}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
