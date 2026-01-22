import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getAuthenticatedUserId } from "@/lib/auth-session";
import { getBusinessIdForUser } from "@/lib/business-auth";
import { getBusinessWithConfig } from "@/lib/dashboard-data";
import { SettingsTabs } from "@/components/settings/settings-tabs";

// Force dynamic rendering (no static generation)
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    redirect("/signin");
  }

  const businessId = await getBusinessIdForUser(userId);

  if (!businessId) {
    redirect("/signin");
  }

  const data = await getBusinessWithConfig(businessId);

  if (!data) {
    redirect("/signin");
  }

  return (
    <SidebarProvider className="bg-sidebar">
      <DashboardSidebar />
      <div className="h-svh overflow-hidden lg:p-2 w-full">
        <div className="lg:border lg:rounded-md overflow-hidden flex flex-col items-center justify-start bg-container h-full w-full bg-background">
          <DashboardHeader businessName={data.business.name} />

          <div className="w-full overflow-y-auto overflow-x-hidden p-4 h-full">
            <div className="mx-auto w-full max-w-4xl space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                  Manage your business profile and preferences
                </p>
              </div>

              <SettingsTabs
                businessId={businessId}
                business={data.business}
                config={data.config}
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

