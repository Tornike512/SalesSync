"use client";

import { ChevronDown, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { SaleSyncIcon } from "@/assets/salesync-icon";
import { getCategoryIcon } from "@/config/categories";
import { useGetCategories } from "@/hooks/use-get-categories";
import { useCategoryFilter } from "@/providers/category-filter-provider";
import { useMobileSidebar } from "@/providers/mobile-sidebar-provider";
import { Button } from "../button";

export function Sidebar() {
  const { data: categories, isLoading } = useGetCategories();
  const {
    selectedCategory,
    selectedSubcategory,
    setSelectedCategory,
    setSelectedSubcategory,
  } = useCategoryFilter();
  const { isOpen, close } = useMobileSidebar();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );

  const handleCategoryClick = (category: string) => {
    // If clicking the same category that's already selected, deselect it
    if (selectedCategory === category && !selectedSubcategory) {
      setSelectedCategory(null);
      setExpandedCategories(new Set());
    } else {
      setSelectedCategory(category);
      // Close all other categories, keep only the selected one expanded
      setExpandedCategories(new Set([category]));
    }
  };

  const handleSubcategoryClick = (category: string, subcategory: string) => {
    setSelectedCategory(category);
    // If clicking the same subcategory, deselect it
    if (selectedSubcategory === subcategory) {
      setSelectedSubcategory(null);
    } else {
      setSelectedSubcategory(subcategory);
      // Close all other categories, keep only the selected one expanded
      setExpandedCategories(new Set([category]));
    }
    // Close mobile sidebar when subcategory is selected
    close();
  };

  const handleClearFilter = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setExpandedCategories(new Set());
  };

  const hasActiveFilter = selectedCategory !== null;

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="mb-6 flex items-center gap-3 border-background-200 border-b pb-4">
        <SaleSyncIcon width={40} height={40} className="rounded-md" />
        <span className="font-bold text-foreground-100 text-xl">SalesSync</span>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-bold text-2xl text-foreground-100">Categories</h2>

        {/* Clear filter button */}
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            hasActiveFilter
              ? "grid-cols-[1fr] opacity-100"
              : "grid-cols-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <Button
              onClick={handleClearFilter}
              className="flex items-center gap-1 rounded-md bg-background-200 px-2 py-1 text-foreground-100 text-sm transition-all duration-200 hover:bg-foreground-200"
            >
              <X size={14} />
              <span>Clear</span>
            </Button>
          </div>
        </div>
      </div>

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
                {hasSubcategories && (
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isExpanded
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
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
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar-scroll relative z-10 hidden w-80 overflow-y-auto border-background-200 border-r bg-background-100 shadow-[4px_0_12px_rgba(24,58,29,0.15)] md:block">
        <div className="p-6">{sidebarContent}</div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={close}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`sidebar-scroll fixed top-0 left-0 z-50 h-full w-80 max-w-[85vw] transform overflow-y-auto bg-background-100 shadow-[4px_0_12px_rgba(24,58,29,0.15)] transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          {/* Close Button */}
          <Button
            onClick={close}
            className="absolute top-4 right-4 rounded-full p-2 text-foreground-100 hover:bg-background-200"
          >
            <X size={24} />
          </Button>
          {sidebarContent}
        </div>
      </aside>
    </>
  );
}
