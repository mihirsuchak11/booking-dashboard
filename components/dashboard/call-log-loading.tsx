import {
  Phone,
  PhoneIncoming,
  Clock,
  Calendar as CalendarIcon,
  PhoneOff,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SKELETON_ROWS = 5;

export function CallLogLoading() {
  return (
    <div className="rounded-3xl border border-border bg-card">
      <div className="p-6 pb-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PhoneOff className="size-4 text-muted-foreground" />
            <h2 className="text-[15px] font-normal text-foreground tracking-[-0.45px]">
              Call Log
            </h2>
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground animate-pulse">
              --
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="flex items-center gap-2">
                  <Clock className="size-4" />
                  Time
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <PhoneIncoming className="size-4" />
                  From
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <Phone className="size-4" />
                  To
                </div>
              </TableHead>
              <TableHead>Call Status</TableHead>
              <TableHead>Booking Status</TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="size-4" />
                  Booking Time
                </div>
              </TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: SKELETON_ROWS }).map((_, idx) => (
              <TableRow key={idx}>
                {Array.from({ length: 7 }).map((__, cellIdx) => (
                  <TableCell key={cellIdx}>
                    <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between border-t border-border p-4">
        <div className="h-4 w-48 rounded bg-muted animate-pulse" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-20 rounded bg-muted animate-pulse" />
          <div className="h-4 w-24 rounded bg-muted animate-pulse" />
          <div className="h-8 w-20 rounded bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}


