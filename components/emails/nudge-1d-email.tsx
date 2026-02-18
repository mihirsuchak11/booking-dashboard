import {
  Button,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { BaseEmailLayout } from "./base-layout";

interface Nudge1dEmailProps {
  userName?: string;
  planName: string;
  renewalDate: string;
  billingUrl?: string;
}

export function Nudge1dEmail({
  userName,
  planName,
  renewalDate,
  billingUrl,
}: Nudge1dEmailProps) {
  const url = billingUrl || `${process.env.NEXT_PUBLIC_APP_URL}/settings?tab=subscription`;

  return (
    <BaseEmailLayout preview="Your plan renews tomorrow">
      <Text style={heading}>Your plan renews tomorrow ⏰</Text>
      <Text style={paragraph}>
        {userName ? `Hi ${userName},` : "Hi there,"}
      </Text>
      <Text style={paragraph}>
        This is an important reminder that your <strong>{planName}</strong> plan will renew automatically <strong>tomorrow</strong> on{" "}
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
        Please ensure your payment method is up to date to avoid any interruption to your service.
      </Text>
      <Section style={buttonSection}>
        <Button style={button} href={url}>
          Update Payment Method
        </Button>
      </Section>
      <Text style={paragraph}>
        If you have any questions or need assistance, please contact us right away.
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
  backgroundColor: "#dc2626",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};
