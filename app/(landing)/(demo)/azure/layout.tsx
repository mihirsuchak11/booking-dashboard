import { Header, ThemeIndicator } from "@/components/landing";
import "./azure.css";

export default function AzureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <ThemeIndicator
        name="Azure"
        description="Bright azure, clear and vibrant"
        inspiration="Clear & Vibrant"
      />
      {children}
    </>
  );
}
