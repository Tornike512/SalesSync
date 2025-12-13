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
import { useState } from "react";
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
    <aside className="w-80 overflow-y-auto border-[#e1eedd] border-r bg-[#fefbe9]">
      <div className="p-6">
        <h2 className="mb-6 font-bold text-2xl text-[#183a1d]">Categories</h2>

        <nav className="space-y-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;

            return (
              <Button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-[#183a1d] transition-all duration-200 ${
                  isActive
                    ? "bg-[#e1eedd]"
                    : "bg-transparent hover:bg-[#e1eedd] hover:bg-opacity-70"
                }`}
              >
                <div
                  className={`rounded-md p-2 ${
                    isActive ? "bg-[#f0a04b]" : "bg-[#f6c453]"
                  }`}
                >
                  <Icon size={20} className="text-[#183a1d]" />
                </div>

                <div className="flex-1 text-left">
                  <div className="font-medium text-[#183a1d]">
                    {category.name}
                  </div>
                  <div className="text-[#183a1d] text-sm opacity-70">
                    {category.count} items
                  </div>
                </div>

                {isActive && (
                  <div className="h-8 w-1 rounded-full bg-[#f0a04b]" />
                )}
              </Button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
