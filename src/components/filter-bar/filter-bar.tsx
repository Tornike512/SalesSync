"use client";

import { Clock, Menu, Search, ShoppingCart, X } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useGetCart } from "@/hooks/use-get-cart";
import { useCategoryFilter } from "@/providers/category-filter-provider";
import { useMobileSidebar } from "@/providers/mobile-sidebar-provider";
import { useSession } from "@/providers/session-provider";
import agrohubLogo from "../../../public/images/agrohub.png";
import carrefourLogo from "../../../public/images/carrefour.webp";
import europroductLogo from "../../../public/images/europroduct.jpg";
import goodwillLogo from "../../../public/images/goodwill.jpg";
import ioliLogo from "../../../public/images/ioli.jpg";
import magnitiLogo from "../../../public/images/magniti.webp";
import nikoraLogo from "../../../public/images/nikora.png";
import onePriceLogo from "../../../public/images/one-price.png";
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

  const cartItemCount = cart?.total_items ?? 0;

  const handleClearCategoryFilter = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  const hasActiveCategoryFilter = selectedCategory !== null;

  return (
    <div className="z-30 shrink-0 border-[var(--color-dark-green)] border-b-2 bg-[var(--color-yellow)] p-3 shadow-[4px_5px_12px_rgba(24,58,29,0.15)] sm:p-4">
      <div className="mx-auto max-w-7xl">
        {/* Top row: Menu, Category Filter, Icons, Auth */}
        <div className="relative mb-3 flex items-center gap-3 sm:mb-4">
          {/* Mobile Menu Button */}
          <Button
            onClick={open}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-[var(--color-dark-green)] bg-[var(--color-cream)] text-[var(--color-dark-green)] shadow-md transition-all hover:bg-amber-100 active:scale-95 md:hidden"
            aria-label="Open categories menu"
          >
            <Menu size={22} />
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

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-[var(--color-dark-green)] bg-[var(--color-cream)] text-[var(--color-dark-green)] shadow-md transition-all hover:bg-amber-100 active:scale-95"
          >
            <ShoppingCart size={20} />
            {cartItemCount > 0 && (
              <span className="-top-2 -right-2 absolute flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-orange)] px-1 font-bold text-white text-xs">
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
          </Link>

          {/* History Icon */}
          <Link
            href="/history"
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-[var(--color-dark-green)] bg-[var(--color-cream)] text-[var(--color-dark-green)] shadow-md transition-all hover:bg-amber-100 active:scale-95"
            aria-label="View History"
          >
            <Clock size={20} />
          </Link>

          {status === "unauthenticated" && (
            <Link
              href="/sign-in"
              className="flex h-10 shrink-0 items-center justify-center rounded-lg border-2 border-[var(--color-dark-green)] bg-[var(--color-dark-green)] px-4 font-medium text-[var(--color-cream)] text-sm shadow-md transition-all hover:bg-[var(--color-dark-green)]/90 active:scale-95"
            >
              Sign In
            </Link>
          )}

          {status === "authenticated" && (
            <Button
              onClick={() => signOut()}
              className="flex h-10 shrink-0 items-center justify-center rounded-lg border-2 border-[var(--color-dark-green)] bg-[var(--color-cream)] px-4 font-medium text-[var(--color-dark-green)] text-sm shadow-md transition-all hover:bg-amber-100 active:scale-95"
              aria-label="Log Out"
            >
              Log Out
            </Button>
          )}
        </div>

        {/* Mobile Search Input - shown on small screens only */}
        <div className="relative mb-3 block md:hidden">
          <Search
            className="-translate-y-1/2 absolute top-1/2 left-3 text-[var(--color-dark-green)] opacity-60"
            size={18}
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border-2 border-[var(--color-dark-green)]/30 bg-[var(--color-cream)] py-2.5 pr-10 pl-10 text-[var(--color-dark-green)] text-sm placeholder-[var(--color-dark-green)]/40 shadow-inner transition-all focus:border-[var(--color-dark-green)] focus:bg-white focus:shadow-md focus:outline-none"
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

        <div className="mb-3 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-[var(--color-dark-green)] text-sm sm:text-lg">
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
          <div className="rounded-lg bg-[var(--color-dark-green)]/10 px-3 py-1.5 text-center">
            <p className="text-[var(--color-dark-green)] text-xs">
              Data resets every 24 hours at 10:00 AM
            </p>
          </div>
        </div>
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
