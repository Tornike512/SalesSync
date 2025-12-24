"use client";

import { Clock, Menu, Search, ShoppingCart, X } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useGetCart } from "@/hooks/use-get-cart";
import { useCategoryFilter } from "@/providers/category-filter-provider";
import { useMobileSidebar } from "@/providers/mobile-sidebar-provider";
import { useSession } from "@/providers/session-provider";
import agrohubLogo from "../../../public/images/agrohub.png";
import carrefourLogo from "../../../public/images/carrefour.webp";
import europroductLogo from "../../../public/images/europroduct.jpg";
import gvirilaLogo from "../../../public/images/Gvirila.jpg";
import goodwillLogo from "../../../public/images/goodwill.jpg";
import ioliLogo from "../../../public/images/ioli.jpg";
import magnitiLogo from "../../../public/images/magniti.webp";
import nikoraLogo from "../../../public/images/nikora.png";
import onePriceLogo from "../../../public/images/one-price.png";
import oriNabijiLogo from "../../../public/images/ori-nabiji.webp";
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
  {
    id: "nikora",
    name: "Nikora",
    filterValue: "nikora",
    logo: nikoraLogo,
  },
  {
    id: "agrohub",
    name: "Agrohub",
    filterValue: "agrohub",
    logo: agrohubLogo,
  },
  {
    id: "carrefour",
    name: "Carrefour",
    filterValue: "carrefour",
    logo: carrefourLogo,
  },
  {
    id: "oneprice",
    name: "One Price",
    filterValue: "oneprice",
    logo: onePriceLogo,
  },
  {
    id: "gvirila",
    name: "Gvirila",
    filterValue: "gvirila",
    logo: gvirilaLogo,
  },
  {
    id: "orinabiji",
    name: "Ori Nabiji",
    filterValue: "ori nabiji",
    logo: oriNabijiLogo,
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
  const { status, signOut } = useSession();
  const { data: cart } = useGetCart();
  const {
    selectedCategory,
    selectedSubcategory,
    setSelectedCategory,
    setSelectedSubcategory,
  } = useCategoryFilter();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const cartItemCount = cart?.total_items ?? 0;

  const handleClearCategoryFilter = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  const hasActiveCategoryFilter = selectedCategory !== null;

  return (
    <div className="z-30 shrink-0 border-[var(--color-dark-green)] border-b-2 bg-[var(--color-yellow)] p-2 shadow-[4px_5px_12px_rgba(24,58,29,0.15)] sm:p-4">
      <div className="mx-auto max-w-7xl">
        {/* Top row: Menu, Category Filter, Icons, Auth */}
        <div className="relative mb-2 flex items-center gap-2 sm:mb-4 sm:gap-3">
          {/* Mobile Menu Button */}
          <Button
            onClick={open}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-[var(--color-dark-green)] bg-[var(--color-cream)] text-[var(--color-dark-green)] shadow-md transition-all hover:bg-amber-100 active:scale-95 md:hidden"
            aria-label="Open categories menu"
          >
            <Menu size={20} />
          </Button>

          {/* Search Input - shown on md+ */}
          <div className="relative hidden flex-1 md:block">
            <Search
              className="-translate-y-1/2 absolute top-1/2 left-3 text-[var(--color-dark-green)] opacity-60"
              size={18}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-lg border-2 border-[var(--color-dark-green)]/30 bg-[var(--color-cream)] py-2.5 pr-10 pl-10 text-[var(--color-dark-green)] placeholder-[var(--color-dark-green)]/40 shadow-inner transition-all focus:border-[var(--color-dark-green)] focus:bg-white focus:shadow-md focus:outline-none sm:text-base"
            />
            {searchQuery && (
              <Button
                onClick={() => onSearchChange("")}
                className="-translate-y-1/2 absolute top-1/2 right-3 flex h-5 w-5 items-center justify-center rounded-full text-[var(--color-dark-green)] opacity-60 transition-all hover:bg-[var(--color-dark-green)]/10 hover:opacity-100 active:scale-95"
                aria-label="Clear search"
              >
                <X size={16} />
              </Button>
            )}
          </div>

          {/* Spacer to push icons to the right on mobile */}
          <div className="flex-1 md:hidden" />

          {/* Mobile Search Icon Button */}
          <Button
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-[var(--color-dark-green)] shadow-md transition-all active:scale-95 md:hidden ${
              isMobileSearchOpen
                ? "bg-[var(--color-dark-green)] text-[var(--color-cream)]"
                : "bg-[var(--color-cream)] text-[var(--color-dark-green)] hover:bg-amber-100"
            }`}
            aria-label={isMobileSearchOpen ? "Close search" : "Open search"}
          >
            {isMobileSearchOpen ? <X size={18} /> : <Search size={18} />}
          </Button>

          {/* Cart Icon - only for authenticated users */}
          {status === "authenticated" && (
            <Link
              href="/cart"
              className="relative flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-[var(--color-dark-green)] bg-[var(--color-cream)] text-[var(--color-dark-green)] shadow-md transition-all hover:bg-amber-100 active:scale-95 sm:h-10 sm:w-10"
            >
              <ShoppingCart size={18} className="sm:h-5 sm:w-5" />
              {cartItemCount > 0 && (
                <span className="-top-2 -right-2 absolute flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-orange)] px-1 font-bold text-white text-xs">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </Link>
          )}

          {/* History Icon - only for authenticated users */}
          {status === "authenticated" && (
            <Link
              href="/history"
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-[var(--color-dark-green)] bg-[var(--color-cream)] text-[var(--color-dark-green)] shadow-md transition-all hover:bg-amber-100 active:scale-95 sm:h-10 sm:w-10"
              aria-label="View History"
            >
              <Clock size={18} className="sm:h-5 sm:w-5" />
            </Link>
          )}

          {status === "unauthenticated" && (
            <Link
              href="/sign-in"
              className="flex h-9 shrink-0 items-center justify-center rounded-lg border-2 border-[var(--color-dark-green)] bg-[var(--color-dark-green)] px-3 font-medium text-[var(--color-cream)] text-xs shadow-md transition-all hover:bg-[var(--color-dark-green)]/90 active:scale-95 sm:h-10 sm:px-4 sm:text-sm"
            >
              Sign In
            </Link>
          )}

          {status === "authenticated" && (
            <Button
              onClick={() => signOut()}
              className="flex h-9 shrink-0 items-center justify-center rounded-lg border-2 border-[var(--color-dark-green)] bg-[var(--color-cream)] px-3 font-medium text-[var(--color-dark-green)] text-xs shadow-md transition-all hover:bg-amber-100 active:scale-95 sm:h-10 sm:px-4 sm:text-sm"
              aria-label="Log Out"
            >
              Log Out
            </Button>
          )}
        </div>

        {/* Mobile Search Input - shown when search icon is clicked */}
        {isMobileSearchOpen && (
          <div className="relative mb-2 block md:hidden">
            <Search
              className="-translate-y-1/2 absolute top-1/2 left-2.5 text-[var(--color-dark-green)] opacity-60"
              size={16}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-lg border-2 border-[var(--color-dark-green)]/30 bg-[var(--color-cream)] py-2 pr-9 pl-9 text-[var(--color-dark-green)] text-sm placeholder-[var(--color-dark-green)]/40 shadow-inner transition-all focus:border-[var(--color-dark-green)] focus:bg-white focus:shadow-md focus:outline-none"
            />
            {searchQuery && (
              <Button
                onClick={() => onSearchChange("")}
                className="-translate-y-1/2 absolute top-1/2 right-3 flex h-5 w-5 items-center justify-center rounded-full text-[var(--color-dark-green)] opacity-60 transition-all hover:bg-[var(--color-dark-green)]/10 hover:opacity-100 active:scale-95"
                aria-label="Clear search"
              >
                <X size={16} />
              </Button>
            )}
          </div>
        )}

        <div className="mb-2 flex flex-col items-start justify-between gap-1.5 sm:mb-3 sm:flex-row sm:items-center sm:gap-2">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-[var(--color-dark-green)] text-xs sm:text-lg">
              Filter by Store
            </h2>
            {selectedStore && (
              <span className="rounded-md bg-[var(--color-dark-green)] px-2 py-1 font-medium text-[var(--color-cream)] text-xs sm:hidden">
                {stores.find((s) => s.filterValue === selectedStore)?.name}
              </span>
            )}
            {hasActiveCategoryFilter && (
              <span className="flex items-center gap-1 rounded-md bg-[var(--color-dark-green)] px-2 py-1 font-medium text-[var(--color-cream)] text-xs sm:hidden">
                <span className="max-w-24 truncate">
                  {selectedSubcategory || selectedCategory}
                </span>
                <Button
                  onClick={handleClearCategoryFilter}
                  className="flex items-center justify-center transition-all hover:opacity-70 active:scale-95"
                  aria-label="Clear category filter"
                >
                  <X size={12} />
                </Button>
              </span>
            )}
          </div>
          <div className="hidden rounded-lg bg-[var(--color-dark-green)]/10 px-3 py-1.5 text-center sm:block">
            <p className="text-[var(--color-dark-green)] text-xs">
              Data resets every 24 hours at 10:00 AM
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {/* All Stores Button */}
          <Button
            onClick={() => onStoreChange(null)}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 font-medium text-xs outline-none transition-all focus:outline-none sm:gap-2 sm:px-4 sm:py-2 sm:text-sm ${
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
              className={`flex items-center gap-1.5 rounded-full p-1.5 outline-none transition-all focus:outline-none sm:gap-2 sm:p-2 ${
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
