"use client";

import { ChevronDown, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GithubIcon } from "@/assets/github-icon";
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
    if (selectedCategory === category && !selectedSubcategory) {
      setSelectedCategory(null);
      setExpandedCategories(new Set());
    } else {
      setSelectedCategory(category);
      setExpandedCategories(new Set([category]));
    }
  };

  const handleSubcategoryClick = (category: string, subcategory: string) => {
    setSelectedCategory(category);
    if (selectedSubcategory === subcategory) {
      setSelectedSubcategory(null);
    } else {
      setSelectedSubcategory(subcategory);
      setExpandedCategories(new Set([category]));
    }
    close();
  };

  const handleClearFilter = () => {
    setSelectedCategory(null);
    setExpandedCategories(new Set());
  };

  const hasActiveFilter =
    selectedCategory !== null || selectedSubcategory !== null;

  useEffect(() => {
    if (selectedSubcategory && categories) {
      for (const [category, subcategories] of Object.entries(categories)) {
        if (subcategories.includes(selectedSubcategory)) {
          setExpandedCategories(new Set([category]));
          break;
        }
      }
    } else if (selectedCategory) {
      setExpandedCategories(new Set([selectedCategory]));
    }
  }, [selectedCategory, selectedSubcategory, categories]);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="mb-8 flex items-center justify-between border-[var(--background-300)] border-b pb-6">
        <Link href="/" className="group flex items-center gap-3">
          <SaleSyncIcon width={40} height={40} className="rounded-lg" />
          <span className="font-bold font-display text-[var(--foreground-100)] text-xl transition-colors group-hover:text-[var(--accent-primary)]">
            SalesSync
          </span>
        </Link>
        <Link
          href="https://github.com/Tornike512"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg p-2 text-[var(--foreground-200)] transition-all hover:bg-[var(--background-200)] hover:text-[var(--foreground-100)]"
          aria-label="Visit GitHub profile"
        >
          <GithubIcon width={22} height={22} />
        </Link>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display font-semibold text-[var(--foreground-100)] text-lg">
          Categories
        </h2>

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
              variant="ghost"
              size="sm"
              className="flex items-center gap-1.5 text-[var(--foreground-200)] hover:text-[var(--accent-coral)]"
            >
              <X size={14} />
              <span>Clear</span>
            </Button>
          </div>
        </div>
      </div>

      <nav className="space-y-1">
        {isLoading ? (
          <div className="flex items-center gap-3 px-3 py-4">
            <div className="skeleton h-10 w-10 rounded-lg bg-[var(--background-200)]" />
            <div className="skeleton h-4 w-24 rounded bg-[var(--background-200)]" />
          </div>
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
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${
                    isCategoryActive && !selectedSubcategory
                      ? "bg-[var(--accent-primary-soft)] text-[var(--accent-primary)]"
                      : "text-[var(--foreground-100)] hover:bg-[var(--background-200)]"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                      isCategoryActive && !selectedSubcategory
                        ? "bg-[var(--accent-primary)] text-white"
                        : "bg-[var(--background-200)] text-[var(--foreground-200)]"
                    }`}
                  >
                    <Icon size={20} />
                  </div>

                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{category}</div>
                  </div>

                  {hasSubcategories && (
                    <div
                      className={`transition-colors ${
                        isCategoryActive && !selectedSubcategory
                          ? "text-[var(--accent-primary)]"
                          : "text-[var(--foreground-300)]"
                      }`}
                    >
                      {isExpanded ? (
                        <ChevronDown size={18} />
                      ) : (
                        <ChevronRight size={18} />
                      )}
                    </div>
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
                      <div className="mt-1 ml-5 space-y-0.5 border-[var(--background-300)] border-l pl-5">
                        {subcategories.map((subcategory) => {
                          const isSubcategoryActive =
                            selectedSubcategory === subcategory;

                          return (
                            <Button
                              key={subcategory}
                              onClick={() =>
                                handleSubcategoryClick(category, subcategory)
                              }
                              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
                                isSubcategoryActive
                                  ? "bg-[var(--accent-primary-soft)] font-medium text-[var(--accent-primary)]"
                                  : "text-[var(--foreground-200)] hover:bg-[var(--background-200)] hover:text-[var(--foreground-100)]"
                              }`}
                            >
                              <span className="flex-1 text-left">
                                {subcategory}
                              </span>
                              {isSubcategoryActive && (
                                <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
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
      <aside className="sidebar-scroll sticky top-0 z-10 hidden h-dvh w-72 overflow-y-auto border-[var(--background-300)] border-r bg-white lg:block">
        <div className="p-5">{sidebarContent}</div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-[var(--foreground-100)]/10 backdrop-blur-[2px] lg:hidden"
          onClick={close}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`sidebar-scroll fixed top-0 left-0 z-50 h-full w-72 max-w-[85vw] transform overflow-y-auto bg-white shadow-[var(--shadow-xl)] transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 pt-16">
          {/* Close Button */}
          <Button
            onClick={close}
            variant="ghost"
            className="absolute top-4 right-4 z-10 rounded-full p-2 text-[var(--foreground-200)] hover:text-[var(--foreground-100)]"
          >
            <X size={22} />
          </Button>
          {sidebarContent}
        </div>
      </aside>
    </>
  );
}
