"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Subscription, Invoice } from "@/types/database";
import { SettingsFormHeader } from "./settings-form-header";
import { Check, FileText } from "lucide-react";

interface SubscriptionTabProps {
  subscription: Subscription | null;
  invoices?: Invoice[];
  invoicesError?: string;
  title?: string;
  description?: string;
}

function formatAmount(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.length === 3 ? currency : "USD",
  }).format(cents / 100);
}

export function SubscriptionTab({
  subscription,
  invoices = [],
  invoicesError,
  title = "Subscription",
  description = "Your plan and payment details",
}: SubscriptionTabProps) {
  const getPlanDisplayName = (planKey: string) => {
    const planMap: Record<string, string> = {
      free: "Free",
      professional_monthly: "Professional (Monthly)",
      professional_yearly: "Professional (Yearly)",
      enterprise_monthly: "Enterprise (Monthly)",
      enterprise_yearly: "Enterprise (Yearly)",
    };
    return planMap[planKey] || planKey;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "trialing":
        return "secondary";
      case "past_due":
        return "destructive";
      case "canceled":
        return "outline";
      default:
        return "outline";
    }
  };

  if (!subscription) {
    return (
      <>
        <SettingsFormHeader title={title} description={description} />
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>No subscription found</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You don't have an active subscription. Please contact support if you believe this is an error.
            </p>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <div className="space-y-6">
      <SettingsFormHeader title={title} description={description} />
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Your subscription details and status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Plan</p>
              <p className="text-lg font-semibold">{getPlanDisplayName(subscription.plan_key)}</p>
            </div>
            <Badge variant={getStatusBadgeVariant(subscription.status)}>
              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1).replace("_", " ")}
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created</p>
              <p className="text-sm">
                {new Date(subscription.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p className="text-sm">
                {new Date(subscription.updated_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            {subscription.current_period_end && (
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {subscription.status === "canceled" ? "Access until" : "Next billing date"}
                </p>
                <p className="text-sm">
                  {new Date(subscription.current_period_end).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                  })}
                </p>
              </div>
            )}
          </div>

          {subscription.stripe_customer_id && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Stripe Customer ID</p>
              <p className="text-sm font-mono text-muted-foreground">{subscription.stripe_customer_id}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment history – only for paid plans */}
      {subscription.plan_key !== "free" && (
        <Card>
          <CardHeader>
            <CardTitle>Payment history</CardTitle>
            <CardDescription>Invoices for your subscription</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {invoicesError && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                <p>We couldn&apos;t load invoices. Please try again.</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            )}
            {!invoicesError && invoices.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No invoices yet. Your first invoice will appear after your first payment.
              </p>
            )}
            {!invoicesError && invoices.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">
                        {new Date(inv.datePaid).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        })}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {getPlanDisplayName(subscription.plan_key)}
                      </TableCell>
                      <TableCell>{formatAmount(inv.amount, inv.currency)}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <Check className="size-4" aria-hidden />
                          Paid
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {(inv.invoicePdfUrl || inv.hostedInvoiceUrl) && (
                          <a
                            href={inv.invoicePdfUrl ?? inv.hostedInvoiceUrl ?? "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            <FileText className="size-4" aria-hidden />
                            View PDF
                          </a>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {subscription.plan_key === "free" && (
        <p className="text-sm text-muted-foreground">
          No invoices — you&apos;re on the free plan.
        </p>
      )}
    </div>
  );
}
