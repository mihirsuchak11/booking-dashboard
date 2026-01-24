import type { Metadata } from "next";
import { Outfit, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const getMetadataBase = (): URL => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return new URL(process.env.NEXT_PUBLIC_APP_URL);
  }
  if (process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL}`);
  }
  return new URL("http://localhost:3000");
};

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: "AI Booking Agent - Your AI Receptionist",
    template: "%s | AI Booking Agent",
  },
  description:
    "An AI-powered voice agent that answers calls, books appointments, and handles customer questions—just like your best employee, but available around the clock.",
  keywords: [
    "AI receptionist",
    "booking agent",
    "appointment scheduling",
    "AI voice agent",
    "automated booking",
    "virtual receptionist",
    "AI phone assistant",
    "customer service AI",
  ],
  authors: [{ name: "AI Booking Agent" }],
  openGraph: {
    title: "AI Booking Agent - Your AI Receptionist",
    description:
      "An AI-powered voice agent that answers calls, books appointments, and handles customer questions—just like your best employee, but available around the clock.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AI Booking Agent - Your AI Receptionist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Booking Agent - Your AI Receptionist",
    description:
      "An AI-powered voice agent that answers calls, books appointments, and handles customer questions.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${instrumentSans.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
