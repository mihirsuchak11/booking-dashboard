import { getBusinessStats } from "@/lib/dashboard-data";
import { isSupabaseConfigured } from "@/lib/supabase-server";
import { StatCard } from "./stat-card";

interface StatsWrapperProps {
  businessId: string;
}

export async function StatsWrapper({ businessId }: StatsWrapperProps) {
  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Customers" value="--" icon="users" />
        <StatCard title="Upcoming Appointments" value="--" icon="clipboard" />
        <StatCard title="Appointments This Week" value="--" icon="wallet" />
        <StatCard title="Calls This Week" value="--" icon="invoice" />
      </div>
    );
  }

  const stats = await getBusinessStats(businessId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Customers"
        value={stats.totalCustomers.toString()}
        icon="users"
      />
      <StatCard
        title="Upcoming Appointments"
        value={stats.upcomingAppointments.toString()}
        icon="clipboard"
      />
      <StatCard
        title="Appointments This Week"
        value={stats.appointmentsThisWeek.toString()}
        icon="wallet"
      />
      <StatCard
        title="Calls This Week"
        value={stats.callsThisWeek.toString()}
        icon="invoice"
      />
    </div>
  );
}

