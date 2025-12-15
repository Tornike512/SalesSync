"use client";

import {
  Apple,
  Baby,
  Beef,
  Candy,
  Coffee,
  Cookie,
  Croissant,
  Fish,
  type LucideIcon,
  Milk,
  Package,
  ShoppingBasket,
  Snowflake,
  Sparkles,
  Wine,
} from "lucide-react";
import Image from "next/image";
import { useGetCategories } from "@/hooks/use-get-categories";
import { useCategoryFilter } from "@/providers/category-filter-provider";
import salesSyncLogo from "../../../public/images/salesync-icon.webp";
import { Button } from "../button";

const categoryIcons: Record<string, LucideIcon> = {
  Alcohol: Wine,
  "Baby Products": Baby,
  Bakery: Croissant,
  Beverages: Coffee,
  "Dairy & Eggs": Milk,
  "Frozen Foods": Snowflake,
  "Fruits & Vegetables": Apple,
  Grocery: ShoppingBasket,
  Household: Sparkles,
  "Meat & Fish": Beef,
  Other: Package,
  Snacks: Cookie,
  "Sushi & Asian": Fish,
  Sweets: Candy,
};

export function Sidebar() {
  const { data: categories, isLoading } = useGetCategories();
  const { selectedCategory, setSelectedCategory } = useCategoryFilter();

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
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

        <nav className="space-y-2">
          {isLoading ? (
            <div className="text-foreground-100 opacity-70">Loading...</div>
          ) : (
            categories?.map((category) => {
              const Icon = categoryIcons[category] || Package;
              const isActive = selectedCategory === category;

              return (
                <Button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-foreground-100 transition-all duration-200 ${
                    isActive
                      ? "bg-background-200"
                      : "bg-transparent hover:bg-background-200 hover:bg-opacity-70"
                  }`}
                >
                  <div
                    className={`rounded-md p-2 ${
                      isActive
                        ? "bg-foreground-200"
                        : "bg-[var(--color-yellow)]"
                    }`}
                  >
                    <Icon size={20} className="text-foreground-100" />
                  </div>

                  <div className="flex-1 text-left">
                    <div className="font-medium">{category}</div>
                  </div>

                  {isActive && (
                    <div className="h-8 w-1 rounded-full bg-foreground-200" />
                  )}
                </Button>
              );
            })
          )}
        </nav>
      </div>
    </aside>
  );
}
