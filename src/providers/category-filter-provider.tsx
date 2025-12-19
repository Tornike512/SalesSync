"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  type ReactNode,
  Suspense,
  useContext,
  useEffect,
  useState,
} from "react";

interface CategoryFilterContextType {
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  setSelectedSubcategory: (subcategory: string | null) => void;
}

const CategoryFilterContext = createContext<CategoryFilterContextType | null>(
  null,
);

function CategoryFilterProviderInner({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category"),
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    searchParams.get("subcategory"),
  );

  // Function to update URL params
  const updateURLParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleSetSelectedCategory = (category: string | null) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    updateURLParams({ category, subcategory: null });
  };

  const handleSetSelectedSubcategory = (subcategory: string | null) => {
    setSelectedSubcategory(subcategory);
    updateURLParams({ subcategory });
  };

  // Sync state with URL params when they change externally (e.g., browser back/forward)
  useEffect(() => {
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");

    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
  }, [searchParams]);

  return (
    <CategoryFilterContext.Provider
      value={{
        selectedCategory,
        selectedSubcategory,
        setSelectedCategory: handleSetSelectedCategory,
        setSelectedSubcategory: handleSetSelectedSubcategory,
      }}
    >
      {children}
    </CategoryFilterContext.Provider>
  );
}

export function CategoryFilterProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <CategoryFilterProviderInner>{children}</CategoryFilterProviderInner>
    </Suspense>
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
