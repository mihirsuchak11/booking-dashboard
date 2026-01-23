import { Header, ThemeIndicator } from "@/components/landing";
import "./navy.css";

export default function NavyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <ThemeIndicator
        name="Navy"
        description="Deep navy, classic and authoritative"
        inspiration="Classic & Authoritative"
      />
      {children}
    </>
  );
}
