import {
  Button,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { BaseEmailLayout } from "./base-layout";

interface WelcomeEmailProps {
  userName?: string;
  dashboardUrl?: string;
}

export function WelcomeEmail({ userName, dashboardUrl }: WelcomeEmailProps) {
  const appName = "AI Booking Agent";
  const url = dashboardUrl || process.env.NEXT_PUBLIC_APP_URL;

  return (
    <BaseEmailLayout preview={`Welcome to ${appName}!`}>
      <Text style={heading}>Welcome to {appName}! 🎉</Text>
      <Text style={paragraph}>
        {userName ? `Hi ${userName},` : "Hi there,"}
      </Text>
      <Text style={paragraph}>
        Thank you for joining {appName}. Your account is now set up and ready to use.
      </Text>
      <Text style={paragraph}>
        Here's what you can do next:
      </Text>
      <Section style={listSection}>
        <Text style={listItem}>✓ Configure your business settings</Text>
        <Text style={listItem}>✓ Set up your services and availability</Text>
        <Text style={listItem}>✓ Start receiving bookings</Text>
      </Section>
      <Section style={buttonSection}>
        <Button style={button} href={url}>
          Go to Dashboard
        </Button>
      </Section>
      <Text style={paragraph}>
        If you have any questions, feel free to reach out. We're here to help!
      </Text>
      <Text style={paragraph}>
        Best regards,<br />
        The {appName} Team
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
