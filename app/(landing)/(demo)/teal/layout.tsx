import { Header, ThemeIndicator } from "@/components/landing";
import "./teal.css";

export default function TealLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <ThemeIndicator
        name="Teal"
        description="Modern teal, balanced and sophisticated"
        inspiration="Modern & Balanced"
      />
      {children}
    </>
  );
}
