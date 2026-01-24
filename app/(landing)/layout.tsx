import { Header, StructuredData } from "@/components/landing";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <StructuredData />
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
      >
        Skip to main content
      </a>
      <Header />
      <div className="bg-black">
        {children}
      </div>
    </>
  );
}
