import { SearchForm } from "./search-form";
import { Search } from "lucide-react";

export default function SearchBusinessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8">
      {/* Top Logo */}
      <div className="w-full max-w-[1128px] mb-8">
        <div className="text-xl font-semibold text-foreground">AI tele caller</div>
      </div>

      {/* Main Split Card */}
      <div className="w-full max-w-[1128px] grid lg:grid-cols-2 bg-card border border-border rounded-2xl overflow-hidden shadow-sm min-h-[600px]">

        {/* Left Column: Form */}
        <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16 border-r border-border/50">
          <SearchForm />
        </div>

        {/* Right Column: Visual/Placeholder */}
        <div className="hidden lg:flex items-center justify-center bg-muted/30 p-12">
          <div className="max-w-md w-full aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center border border-border/50 shadow-sm">
            <div className="text-center p-8 space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Search to automatically find your business details</p>
            </div>
          </div>
        </div>

      </div>
      <div className="mt-8 text-center text-xs text-muted-foreground">
        © 2026 AI tele caller. All rights reserved.
      </div>
    </div>
  );
}
