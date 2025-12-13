"use client";

import {
  Apple,
  Beef,
  Coffee,
  Cookie,
  Egg,
  Fish,
  IceCream,
  Leaf,
  type LucideIcon,
  Milk,
  Pizza,
  Salad,
  Wheat,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import salesSyncLogo from "../../../public/images/salesync-icon.webp";
import { Button } from "../button";

interface Category {
  id: number;
  name: string;
  icon: LucideIcon;
  count: number;
}

const categories: Category[] = [
  { id: 1, name: "Fruits & Vegetables", icon: Apple, count: 156 },
  { id: 2, name: "Meat & Poultry", icon: Beef, count: 89 },
  { id: 3, name: "Dairy Products", icon: Milk, count: 124 },
  { id: 4, name: "Bakery & Bread", icon: Wheat, count: 67 },
  { id: 5, name: "Seafood", icon: Fish, count: 43 },
  { id: 6, name: "Eggs", icon: Egg, count: 28 },
  { id: 7, name: "Snacks & Cookies", icon: Cookie, count: 92 },
  { id: 8, name: "Beverages", icon: Coffee, count: 78 },
  { id: 9, name: "Organic Foods", icon: Leaf, count: 134 },
  { id: 10, name: "Frozen Foods", icon: IceCream, count: 56 },
  { id: 11, name: "Ready Meals", icon: Pizza, count: 45 },
  { id: 12, name: "Fresh Salads", icon: Salad, count: 39 },
];

export function Sidebar() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  return (
    <aside className="sidebar-scroll w-80 overflow-y-auto border-background-200 border-r bg-background-100 shadow-[4px_0_12px_rgba(24,58,29,0.15)]">
      <div className="p-6">
        {/* Logo */}
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
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;

            return (
              <Button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-foreground-100 transition-all duration-200 ${
                  isActive
                    ? "bg-background-200"
                    : "bg-transparent hover:bg-background-200 hover:bg-opacity-70"
                }`}
              >
                <div
                  className={`rounded-md p-2 ${
                    isActive ? "bg-foreground-200" : "bg-[var(--color-yellow)]"
                  }`}
                >
                  <Icon size={20} className="text-foreground-100" />
                </div>

                <div className="flex-1 text-left">
                  <div className="font-medium">{category.name}</div>
                  <div className="text-sm opacity-70">
                    {category.count} items
                  </div>
                </div>

                {isActive && (
                  <div className="h-8 w-1 rounded-full bg-foreground-200" />
                )}
              </Button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
