import { getConversionFunnel } from "@/lib/dashboard-data";
import { isSupabaseConfigured } from "@/lib/supabase-server";
import { ConversionFunnelChart } from "./conversion-funnel-chart";

interface ConversionFunnelWrapperProps {
  businessId: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function ConversionFunnelWrapper({
  businessId,
  searchParams,
}: ConversionFunnelWrapperProps) {
  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    return (
      <ConversionFunnelChart
        totalCalls={0}
        completedCalls={0}
        successfulBookings={0}
        conversionRate={0}
      />
    );
  }

  // Get date filter from search params
  const funnelDateParam = searchParams.funnelDate;
  const funnelDate = funnelDateParam
    ? new Date(Array.isArray(funnelDateParam) ? funnelDateParam[0] : funnelDateParam)
    : undefined;

  const funnel = await getConversionFunnel(businessId, funnelDate);

  return (
    <ConversionFunnelChart
      totalCalls={funnel.totalCalls}
      completedCalls={funnel.completedCalls}
      successfulBookings={funnel.successfulBookings}
      conversionRate={funnel.conversionRate}
    />
  );
}

