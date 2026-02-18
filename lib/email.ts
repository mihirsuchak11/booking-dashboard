"use server";

import { Resend } from "resend";
import { render } from "@react-email/render";
import React from "react";
import { supabase } from "@/lib/supabase-server";
import { WelcomeEmail } from "@/components/emails/welcome-email";
import { InvoiceEmail } from "@/components/emails/invoice-email";
import { Nudge7dEmail } from "@/components/emails/nudge-7d-email";
import { Nudge1dEmail } from "@/components/emails/nudge-1d-email";
import { ExpiredEmail } from "@/components/emails/expired-email";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const FROM_NAME = process.env.RESEND_FROM_NAME || "AI Booking Agent";
// TODO: DEBUG CODE - NEED TO REMOVE
// In DEBUG mode, redirect all emails to test email address to work around Resend testing restrictions
const DEBUG = process.env.DEBUG === "true";
const TEST_EMAIL = process.env.TEST_EMAIL || "harshad.qa@outlook.com";

/**
 * Get user email from Supabase Auth (server-only).
 */
export async function getUserEmail(userId: string): Promise<string | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.admin.getUserById(userId);
  if (error || !user?.email) return null;
  return user.email;
}

/**
 * Send email using Resend.
 */
async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
}): Promise<{ success: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    console.error("[EMAIL] RESEND_API_KEY not configured");
    return { success: false, error: "Email service not configured" };
  }

  // TODO: DEBUG CODE - NEED TO REMOVE
  // In DEBUG mode, redirect all emails to test email address to work around Resend testing restrictions
  // When domain is verified in production, remove this and send emails directly to users
  const recipientEmail = DEBUG ? TEST_EMAIL : to;
  if (DEBUG) {
    console.log(`[EMAIL] DEBUG mode: Redirecting email from ${to} to ${TEST_EMAIL}`);
  }

  try {
    const html = await render(react);
    const { error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: recipientEmail,
      subject,
      html,
    });

    if (error) {
      console.error("[EMAIL] Send error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[EMAIL] Unexpected error:", message);
    return { success: false, error: message };
  }
}

/**
 * Send welcome email after onboarding.
 */
export async function sendWelcomeEmail({
  userId,
  userName,
  dashboardUrl,
}: {
  userId: string;
  userName?: string;
  dashboardUrl?: string;
}): Promise<{ success: boolean; error?: string }> {
  const email = await getUserEmail(userId);
  if (!email) {
    return { success: false, error: "User email not found" };
  }

  return sendEmail({
    to: email,
    subject: "Welcome to AI Booking Agent! 🎉",
    react: React.createElement(WelcomeEmail, { userName, dashboardUrl }),
  });
}

/**
 * Send payment confirmation email with invoice.
 */
export async function sendInvoiceEmail({
  userId,
  amount,
  currency,
  planName,
  invoiceUrl,
  date,
}: {
  userId: string;
  amount: number;
  currency: string;
  planName: string;
  invoiceUrl: string;
  date: string;
}): Promise<{ success: boolean; error?: string }> {
  console.log(`[EMAIL] sendInvoiceEmail called for userId: ${userId}, amount: ${amount}, currency: ${currency}`);
  const email = await getUserEmail(userId);
  if (!email) {
    console.error(`[EMAIL] User email not found for userId: ${userId}`);
    return { success: false, error: "User email not found" };
  }

  console.log(`[EMAIL] Sending invoice email to: ${email}`);
  return sendEmail({
    to: email,
    subject: "Payment Confirmation - Invoice",
    react: React.createElement(InvoiceEmail, {
      amount,
      currency,
      planName,
      invoiceUrl,
      date,
    }),
  });
}

/**
 * Send 7-day renewal nudge email.
 */
export async function sendNudge7dEmail({
  userId,
  userName,
  planName,
  renewalDate,
  billingUrl,
}: {
  userId: string;
  userName?: string;
  planName: string;
  renewalDate: string;
  billingUrl?: string;
}): Promise<{ success: boolean; error?: string }> {
  const email = await getUserEmail(userId);
  if (!email) {
    return { success: false, error: "User email not found" };
  }

  return sendEmail({
    to: email,
    subject: "Your plan renews in 7 days",
    react: React.createElement(Nudge7dEmail, {
      userName,
      planName,
      renewalDate,
      billingUrl,
    }),
  });
}

/**
 * Send 1-day renewal nudge email.
 */
export async function sendNudge1dEmail({
  userId,
  userName,
  planName,
  renewalDate,
  billingUrl,
}: {
  userId: string;
  userName?: string;
  planName: string;
  renewalDate: string;
  billingUrl?: string;
}): Promise<{ success: boolean; error?: string }> {
  const email = await getUserEmail(userId);
  if (!email) {
    return { success: false, error: "User email not found" };
  }

  return sendEmail({
    to: email,
    subject: "Your plan renews tomorrow ⏰",
    react: React.createElement(Nudge1dEmail, {
      userName,
      planName,
      renewalDate,
      billingUrl,
    }),
  });
}

/**
 * Send expired plan email.
 */
export async function sendExpiredEmail({
  userId,
  userName,
  planName,
  renewalUrl,
}: {
  userId: string;
  userName?: string;
  planName: string;
  renewalUrl?: string;
}): Promise<{ success: boolean; error?: string }> {
  const email = await getUserEmail(userId);
  if (!email) {
    return { success: false, error: "User email not found" };
  }

  return sendEmail({
    to: email,
    subject: "Your plan has expired",
    react: React.createElement(ExpiredEmail, {
      userName,
      planName,
      renewalUrl,
    }),
  });
}
