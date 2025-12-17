"use client";
import { Toaster } from "react-hot-toast";
import { CategoryFilterProvider } from "./category-filter-provider";
import { ErrorBoundaryProvider } from "./error-boundary-provider";
import { MobileSidebarProvider } from "./mobile-sidebar-provider";
import { SessionProvider } from "./session-provider";
import { TanstackQueryProvider } from "./tanstack-query-provider";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundaryProvider>
      <TanstackQueryProvider>
        <SessionProvider>
          <MobileSidebarProvider>
            <CategoryFilterProvider>
              {children}
              <Toaster position="bottom-right" />
            </CategoryFilterProvider>
          </MobileSidebarProvider>
        </SessionProvider>
      </TanstackQueryProvider>
    </ErrorBoundaryProvider>
  );
};
