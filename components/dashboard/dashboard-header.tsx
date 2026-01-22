"use client";

import { Download, Plus, Github, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { signOutAction } from "@/app/(auth)/signin/actions";

interface DashboardHeaderProps {
  businessName?: string | null;
}

export function DashboardHeader({ businessName }: DashboardHeaderProps) {
  const title = businessName
    ? `Welcome back, ${businessName} 👋`
    : "Welcome back 👋";

  return (
    <div className="w-full sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-3 py-2.5 sm:px-4 sm:py-3 md:px-7">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <SidebarTrigger className="shrink-0" />
        <h1 className="text-base sm:text-xl md:text-2xl font-medium text-foreground truncate">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
        <div className="hidden lg:flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="size-4" />
            <span className="hidden xl:inline">Export</span>
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="size-4" />
            <span className="hidden xl:inline">New Project</span>
          </Button>
        </div>
        <Button variant="ghost" size="icon-sm" className="shrink-0" asChild>
          <Link
            href="https://github.com/ln-dev7/square-ui/tree/master/templates/dashboard-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="size-4" />
          </Link>
        </Button>
        <form action={signOutAction}>
          <Button
            type="submit"
            variant="ghost"
            size="icon-sm"
            className="shrink-0"
            aria-label="Sign out"
          >
            <LogOut className="size-4" />
          </Button>
        </form>
        <ThemeToggle />
      </div>
    </div>
  );
}

