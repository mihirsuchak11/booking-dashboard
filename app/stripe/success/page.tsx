import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { getSessionPlan } from "@/lib/stripe-success";
import { checkWebhookConnection } from "@/lib/stripe-webhook-check";

type SearchParams = { session_id?: string };

export default async function StripeSuccessPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const sessionId = typeof params.session_id === "string" ? params.session_id : undefined;

  const plan = sessionId ? await getSessionPlan(sessionId) : null;
  const webhookStatus = sessionId ? await checkWebhookConnection(sessionId) : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-2xl font-semibold text-foreground">
          Payment successful
        </h1>
        <p className="text-muted-foreground">
          Your subscription is active. You can start using your plan.
        </p>
        {plan?.planKey && plan?.planName && (
          <div className="rounded-lg border border-border bg-muted/50 px-4 py-3 text-left">
            <p className="text-sm font-medium text-foreground">Plan details</p>
            <p className="text-sm text-muted-foreground mt-1">
              <span className="font-medium text-foreground">{plan.planName}</span>
              {" · "}
              Status: Active
            </p>
          </div>
        )}
        {webhookStatus?.needsWebhook && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Webhook failed</AlertTitle>
            <AlertDescription>
              Your payment went through, but we couldn&apos;t sync your subscription. Please contact support if your plan doesn&apos;t appear shortly.
            </AlertDescription>
          </Alert>
        )}
        <Button asChild>
          <Link href="/onboarding">Continue to onboarding</Link>
        </Button>
      </div>
    </div>
  );
}
