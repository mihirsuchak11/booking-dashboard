import {
  Button,
  Section,
  Text,
} from "@react-email/components";
import { BaseEmailLayout } from "./base-layout";

interface InvoiceEmailProps {
  amount: number;
  currency: string;
  planName: string;
  invoiceUrl: string;
  date: string;
}

export function InvoiceEmail({
  amount,
  currency,
  planName,
  invoiceUrl,
  date,
}: InvoiceEmailProps) {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100); // Stripe amounts are in cents

  return (
    <BaseEmailLayout preview="Payment Confirmation - Invoice">
      <Text style={heading}>Payment Confirmed ✅</Text>
      <Text style={paragraph}>
        Thank you for your payment! Your subscription has been successfully processed.
      </Text>
      <Section style={invoiceBox}>
        <Text style={invoiceLabel}>Plan:</Text>
        <Text style={invoiceValue}>{planName}</Text>
        <Text style={invoiceLabel}>Amount:</Text>
        <Text style={invoiceValue}>{formattedAmount}</Text>
        <Text style={invoiceLabel}>Date:</Text>
        <Text style={invoiceValue}>
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </Section>
      <Section style={buttonSection}>
        <Button style={button} href={invoiceUrl}>
          View Invoice
        </Button>
      </Section>
      <Text style={paragraph}>
        Your invoice is available for download at any time from your dashboard.
      </Text>
      <Text style={paragraph}>
        If you have any questions about this payment, please don't hesitate to contact us.
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

const invoiceBox = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "24px",
  margin: "24px 0",
  border: "1px solid #e5e7eb",
};

const invoiceLabel = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#6b7280",
  margin: "8px 0 4px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const invoiceValue = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#111827",
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
