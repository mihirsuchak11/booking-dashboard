"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Phone,
  PhoneIncoming,
  Clock,
  Calendar as CalendarIcon,
  PhoneOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { CallWithBookingInfo, CallBookingStatus } from "@/lib/dashboard-data";
import { useRouter, useSearchParams } from "next/navigation";

interface CallLogTableProps {
  calls: CallWithBookingInfo[];
  timezone: string;
  page: number;
  pageSize: number;
  totalCount: number;
}

function CallStatusBadge({ status }: { status: "in_progress" | "completed" | "failed" }) {
  const statusConfig = {
    in_progress: {
      label: "In Progress",
      className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    completed: {
      label: "Completed",
      className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    failed: {
      label: "Failed",
      className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
  };

  const config = statusConfig[status];

  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", config.className)}>
      {config.label}
    </span>
  );
}

function BookingStatusBadge({ status }: { status: CallBookingStatus }) {
  const statusConfig = {
    booked: {
      label: "Booked",
      className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    booking_failed: {
      label: "Booking Failed",
      className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
    not_attempted: {
      label: "Not Attempted",
      className: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    },
  };

  const config = statusConfig[status];

  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", config.className)}>
      {config.label}
    </span>
  );
}

function formatCallTime(dateString: string, timezone: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: timezone,
    }).format(date);
  } catch (error) {
    return dateString;
  }
}

export function CallLogTable({ calls, timezone, page, pageSize, totalCount }: CallLogTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const columns: ColumnDef<CallWithBookingInfo>[] = [
    {
      accessorKey: "started_at",
      header: () => (
        <div className="flex items-center gap-2">
          <Clock className="size-4" />
          Time
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-sm font-medium">
            {formatCallTime(row.original.started_at, timezone)}
          </div>
        );
      },
    },
    {
      accessorKey: "from_number",
      header: () => (
        <div className="flex items-center gap-2">
          <PhoneIncoming className="size-4" />
          From
        </div>
      ),
      cell: ({ row }) => {
        return <div className="text-sm">{row.original.from_number}</div>;
      },
    },
    {
      accessorKey: "to_number",
      header: () => (
        <div className="flex items-center gap-2">
          <Phone className="size-4" />
          To
        </div>
      ),
      cell: ({ row }) => {
        return <div className="text-sm">{row.original.to_number}</div>;
      },
    },
    {
      accessorKey: "call_status",
      header: "Call Status",
      cell: ({ row }) => {
        return <CallStatusBadge status={row.original.call_status} />;
      },
    },
    {
      accessorKey: "booking_status",
      header: "Booking Status",
      cell: ({ row }) => {
        return <BookingStatusBadge status={row.original.booking_status} />;
      },
    },
    {
      accessorKey: "booking_start_time",
      header: () => (
        <div className="flex items-center gap-2">
          <CalendarIcon className="size-4" />
          Booking Time
        </div>
      ),
      cell: ({ row }) => {
        const { booking_start_time, booking_customer_name } = row.original;
        if (!booking_start_time) {
          return <div className="text-sm text-muted-foreground">—</div>;
        }
        return (
          <div>
            <div className="text-sm font-medium">
              {formatCallTime(booking_start_time, timezone)}
            </div>
            {booking_customer_name && (
              <div className="text-xs text-muted-foreground">{booking_customer_name}</div>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const { booking_status } = row.original;
        const showAction = booking_status === "booking_failed" || booking_status === "not_attempted";

        if (!showAction) return null;

        return (
          <Button variant="outline" size="sm" className="h-7 text-xs" disabled>
            {booking_status === "booking_failed" ? "Call back" : "Rebook"}
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: calls,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalCount / pageSize),
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("callsPage", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="rounded-3xl border border-border bg-card">
      <div className="p-6 pb-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PhoneOff className="size-4 text-muted-foreground" />
            <h2 className="text-[15px] font-normal text-foreground tracking-[-0.45px]">
              Call Log
            </h2>
            {totalCount > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {totalCount}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {calls.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <PhoneOff className="size-12 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">No calls found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalCount > 0 && (
        <div className="flex items-center justify-between border-t border-border p-4">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount} calls
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

