import { Header, ThemeIndicator } from "@/components/landing";
import "./turquoise.css";

export default function TurquoiseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <ThemeIndicator
        name="Turquoise"
        description="Bright turquoise, tropical and lively"
        inspiration="Tropical & Lively"
      />
      {children}
    </>
  );
}
