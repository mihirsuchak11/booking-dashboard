import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StripeCancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-2xl font-semibold text-foreground">
          Payment cancelled
        </h1>
        <p className="text-muted-foreground">
          Your payment was cancelled. You can try again or choose a different plan.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Back to pricing</Link>
        </Button>
      </div>
    </div>
  );
}
