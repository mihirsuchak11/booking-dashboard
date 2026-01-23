import { Header, ThemeIndicator } from "@/components/landing";
import "./jade.css";

export default function JadeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <ThemeIndicator
        name="Jade"
        description="Rich jade, sophisticated and elegant"
        inspiration="Sophisticated & Elegant"
      />
      {children}
    </>
  );
}
