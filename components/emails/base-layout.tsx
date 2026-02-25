import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface BaseEmailLayoutProps {
  preview?: string;
  children: React.ReactNode;
}

export function BaseEmailLayout({ preview, children }: BaseEmailLayoutProps) {
  const appName = "AI Booking Agent";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  return (
    <Html>
      <Head />
      <Preview>{preview || "AI Booking Agent"}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>{appName}</Heading>
          </Section>
          <Section style={content}>{children}</Section>
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} {appName}. All rights reserved.
            </Text>
            <Text style={footerText}>
              <Link href={appUrl} style={link}>
                Visit Dashboard
              </Link>
              {" • "}
              <Link href={`${appUrl}/settings`} style={link}>
                Manage Settings
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const header = {
  padding: "32px 24px",
  borderBottom: "1px solid #e5e7eb",
};

const logo = {
  color: "#111827",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.5",
  margin: "0",
};

const content = {
  padding: "32px 24px",
};

const footer = {
  padding: "24px",
  borderTop: "1px solid #e5e7eb",
  textAlign: "center" as const,
};

const footerText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "8px 0",
};

const link = {
  color: "#2563eb",
  textDecoration: "underline",
};
