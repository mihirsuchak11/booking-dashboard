import { Header, ThemeIndicator } from "@/components/landing";
import "./lime.css";

export default function LimeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <ThemeIndicator
        name="Lime"
        description="Fresh lime, vibrant and energetic"
        inspiration="Fresh & Energetic"
      />
      {children}
    </>
  );
}
