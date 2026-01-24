import { Header, ThemeIndicator } from "@/components/landing";
import "./mint.css";

export default function MintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <ThemeIndicator
        name="Mint"
        description="Cool mint, refreshing and calming"
        inspiration="Refreshing & Calming"
      />
      {children}
    </>
  );
}
