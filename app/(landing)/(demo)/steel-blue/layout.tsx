import { Header, ThemeIndicator } from "@/components/landing";
import "./steel-blue.css";

export default function SteelBlueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <ThemeIndicator
        name="Steel Blue"
        description="Cool steel blue, industrial and modern"
        inspiration="Industrial & Modern"
      />
      {children}
    </>
  );
}
