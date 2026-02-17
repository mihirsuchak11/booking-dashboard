import "server-only";

import Stripe from "stripe";
import type { Invoice } from "@/types/database";

const DEFAULT_LIMIT = 12;

/**
 * Fetch invoices for a Stripe customer. Returns newest first.
 * Use only when user has a paid subscription (has stripe_customer_id).
 */
export async function getInvoicesForCustomer(
  stripeCustomerId: string,
  limit: number = DEFAULT_LIMIT
): Promise<{ invoices: Invoice[]; error?: string }> {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return { invoices: [], error: "Stripe not configured" };
  }

  const stripe = new Stripe(secret);

  try {
    const response = await stripe.invoices.list({
      customer: stripeCustomerId,
      limit,
      status: "paid",
    });

    const invoices: Invoice[] = (response.data ?? []).map((inv) => {
      const paidAt = (inv as { status_transitions?: { paid_at?: number } }).status_transitions?.paid_at ?? inv.created;
      return {
        id: inv.id,
        number: inv.number ?? null,
        datePaid: new Date(paidAt * 1000).toISOString(),
        amount: inv.amount_paid ?? 0,
        currency: (inv.currency ?? "usd").toUpperCase(),
        status: inv.status ?? "paid",
        hostedInvoiceUrl: inv.hosted_invoice_url ?? null,
        invoicePdfUrl: inv.invoice_pdf ?? null,
      };
    });

    return { invoices };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch invoices";
    console.error("[STRIPE_INVOICES] getInvoicesForCustomer error:", message);
    return { invoices: [], error: message };
  }
}
