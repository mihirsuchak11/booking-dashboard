import Link from "next/link";
import { Button } from "@/components/ui/button";
import { isPlanKey } from "@/config/stripe-plans";
import { RetryPaymentButton } from "./retry-payment-button";

interface StripeCancelPageProps {
  searchParams: Promise<{ plan?: string }> | { plan?: string };
}

export default async function StripeCancelPage({ searchParams }: StripeCancelPageProps) {
  const params = await Promise.resolve(searchParams);
  const planKey = params.plan && isPlanKey(params.plan) ? params.plan : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-2xl font-semibold text-foreground">
          Payment cancelled
        </h1>
        <p className="text-muted-foreground">
          Your payment was cancelled. You can try again or choose a different plan.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {planKey && <RetryPaymentButton planKey={planKey} />}
          <Button asChild variant={planKey ? "outline" : "default"}>
            <Link href="/">Back to pricing</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
