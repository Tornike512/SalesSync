"use client";
import { CategoryFilterProvider } from "./category-filter-provider";
import { ErrorBoundaryProvider } from "./error-boundary-provider";
import { MobileSidebarProvider } from "./mobile-sidebar-provider";
import { TanstackQueryProvider } from "./tanstack-query-provider";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundaryProvider>
      <TanstackQueryProvider>
        <MobileSidebarProvider>
          <CategoryFilterProvider>{children}</CategoryFilterProvider>
        </MobileSidebarProvider>
      </TanstackQueryProvider>
    </ErrorBoundaryProvider>
  );
};
