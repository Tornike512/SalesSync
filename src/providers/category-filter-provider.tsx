"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

interface CategoryFilterContextType {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

const CategoryFilterContext = createContext<CategoryFilterContextType | null>(
  null,
);

export function CategoryFilterProvider({ children }: { children: ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <CategoryFilterContext.Provider
      value={{ selectedCategory, setSelectedCategory }}
    >
      {children}
    </CategoryFilterContext.Provider>
  );
}

export function useCategoryFilter() {
  const context = useContext(CategoryFilterContext);
  if (!context) {
    throw new Error(
      "useCategoryFilter must be used within a CategoryFilterProvider",
    );
  }
  return context;
}
