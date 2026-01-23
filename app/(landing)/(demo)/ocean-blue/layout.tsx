import { Header, ThemeIndicator } from "@/components/landing";
import "./ocean-blue.css";

export default function OceanBlueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <ThemeIndicator
        name="Ocean Blue"
        description="Deep ocean blue with cool, professional feel"
        inspiration="Professional & Trustworthy"
      />
      {children}
    </>
  );
}
