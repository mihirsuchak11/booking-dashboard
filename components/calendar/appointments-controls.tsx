"use client";

import { useState } from "react";
import {
  Search,
  Calendar as CalendarIcon,
  SlidersHorizontal,
  Check,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppointmentsStore } from "@/store/appointments-store";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function AppointmentsControls() {
  const {
    searchQuery,
    setSearchQuery,
    goToToday,
    goToDate,
    currentWeekStart,
    statusFilter,
    setStatusFilter,
  } = useAppointmentsStore();
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const weekStart = format(currentWeekStart, "MMM dd");
  const weekEnd = format(
    new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000),
    "MMM dd yyyy"
  );

  const hasActiveFilters = statusFilter !== "all";

  return (
    <div className="px-3 md:px-6 py-4 border-b border-border">
      <div className="flex items-center gap-2 md:gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-[280px] shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-8 bg-background"
          />
        </div>

        <Button
          variant="outline"
          className="h-8 px-3 shrink-0"
          onClick={goToToday}
        >
          Today
        </Button>

        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-8 px-3 gap-2 justify-start text-left font-normal shrink-0",
                "hover:bg-accent"
              )}
            >
              <CalendarIcon className="size-4 text-muted-foreground" />
              <span className="text-xs text-foreground">
                {weekStart} - {weekEnd}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={currentWeekStart}
              onSelect={(date) => {
                if (date) {
                  goToDate(date);
                  setDatePickerOpen(false);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <div className="ml-auto" />

        <Popover open={filterOpen} onOpenChange={setFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("h-8 px-3 gap-2", hasActiveFilters && "bg-accent")}
            >
              <SlidersHorizontal className="size-4" />
              <span className="hidden sm:inline text-xs">Filter</span>
              {hasActiveFilters && (
                <span className="size-1.5 rounded-full bg-primary" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="p-4 w-[240px]"
            align="end"
          >
            <div className="space-y-4 w-full">
              <div>
                <h4 className="text-sm font-semibold mb-3">
                  Appointment Status
                </h4>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between h-9 px-3"
                    onClick={() => setStatusFilter("all")}
                  >
                    <span className="text-sm">All</span>
                    {statusFilter === "all" && (
                      <Check className="size-4 text-primary" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between h-9 px-3"
                    onClick={() => setStatusFilter("confirmed")}
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="size-4 text-green-500" />
                      <span className="text-sm">Confirmed</span>
                    </div>
                    {statusFilter === "confirmed" && (
                      <Check className="size-4 text-primary" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between h-9 px-3"
                    onClick={() => setStatusFilter("pending")}
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock className="size-4 text-yellow-500" />
                      <span className="text-sm">Pending</span>
                    </div>
                    {statusFilter === "pending" && (
                      <Check className="size-4 text-primary" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between h-9 px-3"
                    onClick={() => setStatusFilter("cancelled")}
                  >
                    <div className="flex items-center gap-2.5">
                      <XCircle className="size-4 text-red-500" />
                      <span className="text-sm">Cancelled</span>
                    </div>
                    {statusFilter === "cancelled" && (
                      <Check className="size-4 text-primary" />
                    )}
                  </Button>
                </div>
              </div>

              {hasActiveFilters && (
                <>
                  <Separator />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-9"
                    onClick={() => {
                      setStatusFilter("all");
                    }}
                  >
                    Clear filters
                  </Button>
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

