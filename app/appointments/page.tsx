import { Suspense } from "react";
import { redirect } from "next/navigation";
import { startOfWeek } from "date-fns";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getAuthenticatedUserId } from "@/lib/auth-session";
import { getBusinessIdForUser } from "@/lib/business-auth";
import { getBusinessById, getBookingsForWeek } from "@/lib/dashboard-data";
import {
  AppointmentsWrapper,
  AppointmentsLoading,
} from "@/components/calendar";

// Force dynamic rendering (no static generation)
export const dynamic = "force-dynamic";

export default async function AppointmentsPage() {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    redirect("/signin");
  }

  const businessId = await getBusinessIdForUser(userId);

  if (!businessId) {
    redirect("/signin");
  }

  const business = await getBusinessById(businessId);

  // Fetch initial week appointments (current week)
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const initialAppointments = await getBookingsForWeek(businessId, currentWeekStart);

  return (
    <SidebarProvider className="bg-sidebar">
      <DashboardSidebar />
      <div className="h-svh overflow-hidden lg:p-2 w-full">
        <div className="lg:border lg:rounded-md overflow-hidden flex flex-col h-full w-full bg-background">
          <Suspense fallback={<AppointmentsLoading />}>
            <AppointmentsWrapper
              businessId={businessId}
              businessName={business?.name}
              initialAppointments={initialAppointments}
            />
          </Suspense>
        </div>
      </div>
    </SidebarProvider>
  );
}
