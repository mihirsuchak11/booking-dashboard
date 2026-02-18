import {
  Button,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { BaseEmailLayout } from "./base-layout";

interface Nudge7dEmailProps {
  userName?: string;
  planName: string;
  renewalDate: string;
  billingUrl?: string;
}

export function Nudge7dEmail({
  userName,
  planName,
  renewalDate,
  billingUrl,
}: Nudge7dEmailProps) {
  const url = billingUrl || `${process.env.NEXT_PUBLIC_APP_URL}/settings?tab=subscription`;

  return (
    <BaseEmailLayout preview="Your plan renews in 7 days">
      <Text style={heading}>Your plan renews soon</Text>
      <Text style={paragraph}>
        {userName ? `Hi ${userName},` : "Hi there,"}
      </Text>
      <Text style={paragraph}>
        This is a friendly reminder that your <strong>{planName}</strong> plan will renew automatically in 7 days on{" "}
        <strong>
          {new Date(renewalDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </strong>
        .
      </Text>
      <Text style={paragraph}>
        No action is needed if you'd like to continue with your current plan. Your subscription will renew automatically using your saved payment method.
      </Text>
      <Section style={buttonSection}>
        <Button style={button} href={url}>
          Manage Subscription
        </Button>
      </Section>
      <Text style={paragraph}>
        If you have any questions or need to update your payment method, please visit your dashboard.
      </Text>
    </BaseEmailLayout>
  );
}

const heading = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#111827",
  margin: "0 0 16px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#374151",
  margin: "0 0 16px",
};

const buttonSection = {
  margin: "32px 0",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#2563eb",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};
