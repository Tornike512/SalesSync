"use client";
import { CategoryFilterProvider } from "./category-filter-provider";
import { ErrorBoundaryProvider } from "./error-boundary-provider";
import { TanstackQueryProvider } from "./tanstack-query-provider";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundaryProvider>
      <TanstackQueryProvider>
        <CategoryFilterProvider>{children}</CategoryFilterProvider>
      </TanstackQueryProvider>
    </ErrorBoundaryProvider>
  );
};
