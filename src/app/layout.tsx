import type { Metadata } from "next";
import "../styles/globals.css";
import { AppProviders } from "@/providers";
import { cn } from "@/utils/cn";

export const metadata: Metadata = {
  title: "SalesSync",
  description: "SalesSync - Compare prices across retailers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="min-h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          "min-h-full bg-background-100 text-foreground-100 antialiased",
        )}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
