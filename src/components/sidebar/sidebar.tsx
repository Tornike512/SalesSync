"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { getCategoryIcon } from "@/config/categories";
import { useGetCategories } from "@/hooks/use-get-categories";
import { useCategoryFilter } from "@/providers/category-filter-provider";
import salesSyncLogo from "../../../public/images/salesync-icon.webp";
import { Button } from "../button";

export function Sidebar() {
  const { data: categories, isLoading } = useGetCategories();
  const {
    selectedCategory,
    selectedSubcategory,
    setSelectedCategory,
    setSelectedSubcategory,
  } = useCategoryFilter();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );

  const toggleCategoryExpanded = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const handleCategoryClick = (category: string) => {
    // If clicking the same category that's already selected, deselect it
    if (selectedCategory === category && !selectedSubcategory) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
    // Toggle expansion when clicking category
    toggleCategoryExpanded(category);
  };

  const handleSubcategoryClick = (category: string, subcategory: string) => {
    setSelectedCategory(category);
    // If clicking the same subcategory, deselect it
    if (selectedSubcategory === subcategory) {
      setSelectedSubcategory(null);
    } else {
      setSelectedSubcategory(subcategory);
    }
  };

  return (
    <aside className="sidebar-scroll relative z-10 w-80 overflow-y-auto border-background-200 border-r bg-background-100 shadow-[4px_0_12px_rgba(24,58,29,0.15)]">
      <div className="p-6">
        {/* Logo */}
        <div className="mb-6 flex items-center gap-3 border-background-200 border-b pb-4">
          <Image
            src={salesSyncLogo}
            alt="SalesSync logo"
            width={40}
            height={40}
            className="rounded-md"
            priority
          />
          <span className="font-bold text-foreground-100 text-xl">
            SalesSync
          </span>
        </div>

        <h2 className="mb-6 font-bold text-2xl text-foreground-100">
          Categories
        </h2>

        <nav className="space-y-1">
          {isLoading ? (
            <div className="text-foreground-100 opacity-70">Loading...</div>
          ) : (
            categories &&
            Object.entries(categories).map(([category, subcategories]) => {
              const Icon = getCategoryIcon(category);
              const isExpanded = expandedCategories.has(category);
              const isCategoryActive = selectedCategory === category;
              const hasSubcategories = subcategories.length > 0;

              return (
                <div key={category}>
                  <Button
                    onClick={() => handleCategoryClick(category)}
                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-foreground-100 transition-all duration-200 ${
                      isCategoryActive && !selectedSubcategory
                        ? "bg-background-200"
                        : "bg-transparent hover:bg-background-200 hover:bg-opacity-70"
                    }`}
                  >
                    <div
                      className={`rounded-md p-2 ${
                        isCategoryActive && !selectedSubcategory
                          ? "bg-foreground-200"
                          : "bg-[var(--color-yellow)]"
                      }`}
                    >
                      <Icon size={20} className="text-foreground-100" />
                    </div>

                    <div className="flex-1 text-left">
                      <div className="font-medium">{category}</div>
                    </div>

                    {hasSubcategories && (
                      <div className="text-foreground-100 opacity-70">
                        {isExpanded ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </div>
                    )}

                    {isCategoryActive && !selectedSubcategory && (
                      <div className="h-8 w-1 rounded-full bg-foreground-200" />
                    )}
                  </Button>

                  {/* Subcategories */}
                  {hasSubcategories && isExpanded && (
                    <div className="mt-1 ml-6 space-y-1 border-foreground-200 border-l pl-4">
                      {subcategories.map((subcategory) => {
                        const isSubcategoryActive =
                          isCategoryActive &&
                          selectedSubcategory === subcategory;

                        return (
                          <Button
                            key={subcategory}
                            onClick={() =>
                              handleSubcategoryClick(category, subcategory)
                            }
                            className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-foreground-100 text-sm transition-all duration-200 ${
                              isSubcategoryActive
                                ? "bg-background-200"
                                : "bg-transparent hover:bg-background-200 hover:bg-opacity-70"
                            }`}
                          >
                            <span className="flex-1 text-left">
                              {subcategory}
                            </span>
                            {isSubcategoryActive && (
                              <div className="h-5 w-1 rounded-full bg-foreground-200" />
                            )}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </nav>
      </div>
    </aside>
  );
}
