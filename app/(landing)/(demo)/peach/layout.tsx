import { Header, ThemeIndicator } from "@/components/landing";
import "./peach.css";

export default function PeachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <ThemeIndicator
        name="Peach"
        description="Warm peach, soft and approachable"
        inspiration="Soft & Approachable"
      />
      {children}
    </>
  );
}
