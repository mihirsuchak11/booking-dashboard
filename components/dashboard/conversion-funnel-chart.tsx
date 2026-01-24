"use client";

import React, { useState } from "react";
import { Phone, TrendingUp, Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

// Colors matching the design
const TOTAL_CALLS_COLOR_LIGHT = "#252C2C";
const TOTAL_CALLS_COLOR_DARK = "#E8E9ED";
const COMPLETED_COLOR = "#888DF9";
const BOOKINGS_COLOR = "#4CAF50"; // Green for successful bookings

// Colors for labels and grid
const LABEL_COLOR_LIGHT = "#95979d";
const LABEL_COLOR_DARK = "#B4B4B4";
const GRID_COLOR_LIGHT = "#E8E9ED";
const GRID_COLOR_DARK = "#2A2A2A";

interface ConversionFunnelChartProps {
  totalCalls: number;
  completedCalls: number;
  successfulBookings: number;
  conversionRate: number;
}

export function ConversionFunnelChart({
  totalCalls,
  completedCalls,
  successfulBookings,
  conversionRate,
}: ConversionFunnelChartProps) {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  // Get date from search params (read directly, no local state needed)
  const dateParam = searchParams.get("funnelDate");
  const [date, setDate] = React.useState<Date | undefined>(dateParam ? new Date(dateParam) : undefined);

  const isDark = resolvedTheme === "dark";
  const totalCallsColor = isDark ? TOTAL_CALLS_COLOR_DARK : TOTAL_CALLS_COLOR_LIGHT;
  const labelColor = isDark ? LABEL_COLOR_DARK : LABEL_COLOR_LIGHT;
  const gridColor = isDark ? GRID_COLOR_DARK : GRID_COLOR_LIGHT;

  const formatDateRange = (date: Date | undefined) => {
    if (!date) return "This Week";
    const month = date.toLocaleDateString("en-US", { month: "long" });
    return month;
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setOpen(false);

    // Update URL search params
    const params = new URLSearchParams(searchParams.toString());
    if (selectedDate) {
      params.set("funnelDate", selectedDate.toISOString());
    } else {
      params.delete("funnelDate");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Prepare data for the chart
  const chartData = [
    {
      stage: "Total Calls",
      value: totalCalls,
      color: totalCallsColor,
    },
    {
      stage: "Completed",
      value: completedCalls,
      color: COMPLETED_COLOR,
    },
    {
      stage: "Bookings",
      value: successfulBookings,
      color: BOOKINGS_COLOR,
    },
  ];

  // Calculate max value for Y-axis (round up to nearest 50)
  const maxValue = Math.max(totalCalls, completedCalls, successfulBookings, 100);
  const yAxisMax = Math.ceil(maxValue / 50) * 50;

  return (
    <div className="relative rounded-3xl border border-border bg-card p-6 max-h-[400px] overflow-y-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Phone className="size-4 text-muted-foreground" />
          <h2 className="text-[15px] font-normal text-foreground tracking-[-0.45px]">
            Conversion Funnel
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-help">
                <TrendingUp className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {conversionRate}%
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {successfulBookings} bookings out of {completedCalls} completed calls
              </p>
            </TooltipContent>
          </Tooltip>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-2 text-xs px-[10px] py-[4px]"
              >
                <CalendarIcon className="size-4" />
                {formatDateRange(date)}
                <ChevronDown className="size-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                onSelect={handleDateSelect}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-center gap-[22px]">
        <div className="flex items-center gap-1.5">
          <div
            className="size-3 rounded-full"
            style={{ backgroundColor: totalCallsColor }}
          />
          <span className="text-xs font-medium text-muted-foreground tracking-[-0.24px]">
            Total Calls
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="size-3 rounded-full"
            style={{ backgroundColor: COMPLETED_COLOR }}
          />
          <span className="text-xs font-medium text-muted-foreground tracking-[-0.24px]">
            Completed
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="size-3 rounded-full"
            style={{ backgroundColor: BOOKINGS_COLOR }}
          />
          <span className="text-xs font-medium text-muted-foreground tracking-[-0.24px]">
            Bookings
          </span>
        </div>
      </div>

      <div className="relative pl-8">
        <ResponsiveContainer width="100%" height={237}>
          <BarChart
            data={chartData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            barCategoryGap={20}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridColor}
              strokeWidth={1}
            />
            <XAxis
              dataKey="stage"
              tick={{
                fill: labelColor,
                fontSize: 12,
                fontWeight: 400,
                fontFamily: "inherit",
              }}
              axisLine={false}
              tickLine={false}
              tickMargin={13}
              style={{
                letterSpacing: "-0.24px",
              }}
            />
            <YAxis
              tick={{
                fill: labelColor,
                fontSize: 12,
                fontWeight: 400,
                fontFamily: "inherit",
              }}
              axisLine={false}
              tickLine={false}
              domain={[0, yAxisMax]}
              style={{
                letterSpacing: "-0.24px",
              }}
              width={40}
            />
            <RechartsTooltip
              cursor={{ fill: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)' }}
              contentStyle={{
                backgroundColor: "transparent",
                border: "none",
                boxShadow: "none",
                padding: 0,
              }}
              wrapperStyle={{
                outline: "none",
              }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const entry = payload[0];
                return (
                  <div className="rounded-lg border border-border bg-card p-2 shadow-lg">
                    <p className="mb-1.5 text-xs font-medium text-foreground tracking-[-0.24px]">
                      {entry.payload.stage}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <div
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: entry.payload.color }}
                      />
                      <span className="text-xs font-medium text-foreground tracking-[-0.24px]">
                        {entry.value}
                      </span>
                    </div>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="value"
              radius={[4.912, 4.912, 0, 0]}
              barSize={60}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

