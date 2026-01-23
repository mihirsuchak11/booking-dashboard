import { Header, ThemeIndicator } from "@/components/landing";

export default function HeroV2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <ThemeIndicator
        name="Hero V2"
        description="Hero section with image variant"
        inspiration="Image-based hero"
      />
      {children}
    </>
  );
}
