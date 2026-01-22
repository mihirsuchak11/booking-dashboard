import { Users, Clipboard, Wallet, FileText } from "lucide-react";

const statsConfig = [
  { title: "Total Customers", icon: Users },
  { title: "Upcoming Appointments", icon: Clipboard },
  { title: "Appointments This Week", icon: Wallet },
  { title: "Calls This Week", icon: FileText },
];

export function StatsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsConfig.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="relative overflow-hidden rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <div className="h-8 bg-muted rounded w-16 animate-pulse"></div>
              </div>
              <div className="flex size-16 items-center justify-center rounded-lg bg-muted border border-border">
                <Icon className="size-8 text-muted-foreground" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

