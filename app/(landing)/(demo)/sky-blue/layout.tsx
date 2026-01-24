import { Header, ThemeIndicator } from "@/components/landing";
import "./sky-blue.css";

export default function SkyBlueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <ThemeIndicator
        name="Sky Blue"
        description="Light sky blue, calm and serene"
        inspiration="Calm & Serene"
      />
      {children}
    </>
  );
}
