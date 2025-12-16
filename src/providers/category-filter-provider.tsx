"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

interface CategoryFilterContextType {
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  setSelectedSubcategory: (subcategory: string | null) => void;
}

const CategoryFilterContext = createContext<CategoryFilterContextType | null>(
  null,
);

export function CategoryFilterProvider({ children }: { children: ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );

  const handleSetSelectedCategory = (category: string | null) => {
    setSelectedCategory(category);
    // Clear subcategory when main category changes
    setSelectedSubcategory(null);
  };

  return (
    <CategoryFilterContext.Provider
      value={{
        selectedCategory,
        selectedSubcategory,
        setSelectedCategory: handleSetSelectedCategory,
        setSelectedSubcategory,
      }}
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
