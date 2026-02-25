import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getAuthenticatedUserId } from "@/lib/auth-session";
import { getBusinessIdForUser } from "@/lib/business-auth";
import { getBusinessWithConfig, getSubscriptionByUserId } from "@/lib/dashboard-data";
import { getInvoicesForCustomer } from "@/lib/stripe-invoices";
import { SettingsTabs } from "@/components/settings/settings-tabs";
import type { Invoice } from "@/types/database";

// Force dynamic rendering (no static generation)
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  // Try to get user data if authenticated, but don't require it
  const userId = await getAuthenticatedUserId();
  let businessId: string | null = null;
  let data: Awaited<ReturnType<typeof getBusinessWithConfig>> = null;
  let subscription: Awaited<ReturnType<typeof getSubscriptionByUserId>> = null;
  let invoices: Invoice[] = [];
  let invoicesError: string | undefined;

  if (userId) {
    businessId = await getBusinessIdForUser(userId);
    if (businessId) {
      data = await getBusinessWithConfig(businessId);
    }
    subscription = await getSubscriptionByUserId(userId);
    if (subscription?.stripe_customer_id && subscription.plan_key !== "free") {
      const result = await getInvoicesForCustomer(subscription.stripe_customer_id);
      invoices = result.invoices;
      invoicesError = result.error;
    }
  }

  return (
    <SidebarProvider className="bg-sidebar">
      <DashboardSidebar />
      <div className="h-svh overflow-hidden lg:p-2 w-full">
        <div className="lg:border lg:rounded-md overflow-hidden flex flex-col items-center justify-start bg-container h-full w-full bg-background">
          <DashboardHeader businessName={data?.business.name} />

          <div className="w-full overflow-y-auto overflow-x-hidden py-4 px-0 lg:py-6 lg:px-0 h-full">
            <div className="w-full space-y-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                  Manage your business profile and preferences
                </p>
              </div>

              {data && businessId && userId ? (
                <SettingsTabs
                  businessId={businessId}
                  business={data.business}
                  config={data.config}
                  userId={userId}
                  subscription={subscription}
                  invoices={invoices}
                  invoicesError={invoicesError}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Please sign in to access settings.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

