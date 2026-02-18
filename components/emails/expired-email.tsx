import {
  Button,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { BaseEmailLayout } from "./base-layout";

interface ExpiredEmailProps {
  userName?: string;
  planName: string;
  renewalUrl?: string;
}

export function ExpiredEmail({
  userName,
  planName,
  renewalUrl,
}: ExpiredEmailProps) {
  const url = renewalUrl || `${process.env.NEXT_PUBLIC_APP_URL}/settings?tab=subscription`;

  return (
    <BaseEmailLayout preview="Your plan has expired">
      <Text style={heading}>Your plan has expired</Text>
      <Text style={paragraph}>
        {userName ? `Hi ${userName},` : "Hi there,"}
      </Text>
      <Text style={paragraph}>
        Your <strong>{planName}</strong> plan has expired. To continue using all features, please renew your subscription.
      </Text>
      <Text style={paragraph}>
        <strong>What happens next?</strong>
      </Text>
      <Section style={listSection}>
        <Text style={listItem}>• Your account access may be limited</Text>
        <Text style={listItem}>• Some features may be unavailable</Text>
        <Text style={listItem}>• Renew now to restore full access</Text>
      </Section>
      <Section style={buttonSection}>
        <Button style={button} href={url}>
          Renew Subscription
        </Button>
      </Section>
      <Text style={paragraph}>
        If you have any questions or need help renewing, please don't hesitate to contact us.
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

const listSection = {
  margin: "24px 0",
};

const listItem = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#374151",
  margin: "8px 0",
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
