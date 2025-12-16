"use client";

import { Menu, Search, X } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { useCategoryFilter } from "@/providers/category-filter-provider";
import { useMobileSidebar } from "@/providers/mobile-sidebar-provider";
import carrefourLogo from "../../../public/images/carrefour.webp";
import europroductLogo from "../../../public/images/europroduct.jpg";
import goodwillLogo from "../../../public/images/goodwill.jpg";
import ioliLogo from "../../../public/images/ioli.jpg";
import magnitiLogo from "../../../public/images/magniti.webp";
import sparLogo from "../../../public/images/spar.jpeg";
import { Button } from "../button";

interface Store {
  id: string;
  name: string;
  filterValue: string;
  logo: StaticImageData;
}

// Partial match, case-insensitive filtering
const stores: Store[] = [
  {
    id: "europroduct",
    name: "Europroduct",
    filterValue: "europroduct",
    logo: europroductLogo,
  },
  {
    id: "spar",
    name: "Spar",
    filterValue: "spar",
    logo: sparLogo,
  },
  {
    id: "goodwill",
    name: "Goodwill",
    filterValue: "goodwill",
    logo: goodwillLogo,
  },
  {
    id: "ioli",
    name: "Ioli",
    filterValue: "ioli",
    logo: ioliLogo,
  },
  {
    id: "magniti",
    name: "Magniti",
    filterValue: "magniti",
    logo: magnitiLogo,
  },
  // {
  //   id: "nikora",
  //   name: "Nikora",
  //   filterValue: "nikora",
  //   logo: nikoraLogo,
  // },
  // {
  //   id: "agrohub",
  //   name: "Agrohub",
  //   filterValue: "agrohub",
  //   logo: agrohubLogo,
  // },
  {
    id: "carrefour",
    name: "Carrefour",
    filterValue: "carrefour",
    logo: carrefourLogo,
  },
];

interface FilterBarProps {
  selectedStore: string | null;
  onStoreChange: (storeName: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function FilterBar({
  selectedStore,
  onStoreChange,
  searchQuery,
  onSearchChange,
}: FilterBarProps) {
  const { open } = useMobileSidebar();
  const {
    selectedCategory,
    selectedSubcategory,
    setSelectedCategory,
    setSelectedSubcategory,
  } = useCategoryFilter();

  const handleClearCategoryFilter = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  const hasActiveCategoryFilter = selectedCategory !== null;

  return (
    <div className="z-30 shrink-0 border-[var(--color-dark-green)] border-b-2 bg-[var(--color-yellow)] p-3 shadow-[4px_5px_12px_rgba(24,58,29,0.15)] sm:p-4">
      <div className="mx-auto max-w-7xl">
        {/* Search Input with Menu Button */}
        <div className="relative mb-3 flex items-center gap-3 sm:mb-4">
          {/* Mobile Menu Button */}
          <Button
            onClick={open}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-[var(--color-dark-green)] bg-[var(--color-cream)] text-[var(--color-dark-green)] shadow-md transition-all hover:bg-amber-100 active:scale-95 md:hidden"
            aria-label="Open categories menu"
          >
            <Menu size={22} />
          </Button>

          {/* Mobile Clear Category Filter Button */}
          <div
            className={`grid transition-all duration-300 ease-in-out md:hidden ${
              hasActiveCategoryFilter
                ? "grid-cols-[1fr] opacity-100"
                : "grid-cols-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <Button
                onClick={handleClearCategoryFilter}
                className="flex h-10 shrink-0 items-center gap-1.5 rounded-lg border-2 border-[var(--color-dark-green)] bg-[var(--color-dark-green)] px-3 text-[var(--color-cream)] text-xs shadow-md transition-all hover:bg-[var(--color-dark-green)]/90 active:scale-95"
                aria-label="Clear category filter"
              >
                <X size={14} />
                <span className="max-w-24 truncate">
                  {selectedSubcategory || selectedCategory}
                </span>
              </Button>
            </div>
          </div>

          <div className="relative flex-1">
            <Search
              className="-translate-y-1/2 absolute top-1/2 left-3 text-[var(--color-dark-green)] opacity-60"
              size={18}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-lg border-2 border-[var(--color-dark-green)]/30 bg-[var(--color-cream)] py-2.5 pr-4 pl-10 text-[var(--color-dark-green)] text-sm placeholder-[var(--color-dark-green)]/40 shadow-inner transition-all focus:border-[var(--color-dark-green)] focus:bg-white focus:shadow-md focus:outline-none sm:text-base"
            />
          </div>
        </div>

        <h2 className="mb-2 font-semibold text-[var(--color-dark-green)] text-sm sm:mb-3 sm:text-lg">
          Filter by Store
        </h2>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {/* All Stores Button */}
          <Button
            onClick={() => onStoreChange(null)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium text-xs outline-none transition-all focus:outline-none sm:gap-2 sm:px-4 sm:py-2 sm:text-sm ${
              selectedStore === null
                ? "bg-[var(--color-dark-green)] text-[var(--color-cream)]"
                : "bg-[var(--color-cream)] text-[var(--color-dark-green)] opacity-70 hover:opacity-100"
            }`}
          >
            All
            <span className="hidden sm:inline"> Stores</span>
          </Button>

          {/* Store Filter Buttons */}
          {stores.map((store) => (
            <Button
              key={store.id}
              onClick={() => onStoreChange(store.filterValue)}
              className={`flex items-center gap-1.5 rounded-full px-2 py-1.5 outline-none transition-all focus:outline-none sm:gap-2 sm:px-4 sm:py-2 ${
                selectedStore === store.filterValue
                  ? "bg-[var(--color-dark-green)] text-[var(--color-cream)]"
                  : "bg-[var(--color-cream)] text-[var(--color-dark-green)] opacity-70 hover:opacity-100"
              }`}
            >
              <div className="relative h-5 w-5 overflow-hidden rounded-full bg-white p-0.5 sm:h-6 sm:w-6">
                <Image
                  src={store.logo}
                  alt={store.name}
                  fill
                  className="rounded-full object-contain"
                />
              </div>
              <span className="hidden whitespace-nowrap font-medium text-sm sm:inline">
                {store.name}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
