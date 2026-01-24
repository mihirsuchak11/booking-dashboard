import { Header, ThemeIndicator } from "@/components/landing";
import "./cyan.css";

export default function CyanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <ThemeIndicator
        name="Cyan"
        description="Bright cyan, energetic and tech-forward"
        inspiration="Tech & Innovation"
      />
      {children}
    </>
  );
}
