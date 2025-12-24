import type { Metadata } from "next";
import "../styles/globals.css";
import { AppProviders } from "@/providers";
import { cn } from "@/utils/cn";

export const metadata: Metadata = {
  title: "SalesSync",
  description: "SalesSync",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("min-h-full")}>
      <body
        className={cn(
          "min-h-full bg-background-100 font-roboto text-foreground-100",
        )}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
