import { Header, ThemeIndicator } from "@/components/landing";
import "./salmon.css";

export default function SalmonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <ThemeIndicator
        name="Salmon"
        description="Soft salmon, gentle and warm"
        inspiration="Gentle & Warm"
      />
      {children}
    </>
  );
}
