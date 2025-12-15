import type { Metadata } from "next";
import "../styles/globals.css";
import { Sidebar } from "@/components/sidebar";
import { AppProviders } from "@/providers";
import { cn } from "@/utils/cn";

export const metadata: Metadata = {
  title: "SalesSync",
  description: "SalesSync",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full")}>
      <body
        className={cn(
          "h-full bg-background-100 font-roboto text-foreground-100",
        )}
      >
        <AppProviders>
          <div className="flex h-full">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
