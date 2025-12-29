"use client";

import {
  ChevronDown,
  Clock,
  Menu,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
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
  const { selectedCategory, selectedSubcategory, setSelectedCategory } =
    useCategoryFilter();
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);

  const cartItemCount = cart?.total_items ?? 0;

  const handleClearCategoryFilter = () => {
    // Only call setSelectedCategory - it already clears subcategory and updates URL
    setSelectedCategory(null);
  };

  const hasActiveCategoryFilter =
    selectedCategory !== null || selectedSubcategory !== null;

  return (
    <div className="z-30 shrink-0 border-[var(--color-dark-green)] border-b-2 bg-[var(--color-yellow)] p-2 shadow-[4px_5px_12px_rgba(24,58,29,0.15)] lg:p-4">
      <div className="mx-auto max-w-7xl">
        {/* Top row: Menu, Category Filter, Icons, Auth */}
        <div className="relative mb-2 flex items-center gap-2 lg:mb-4 lg:gap-3">
          {/* Mobile Menu Button */}
          <Button
            onClick={open}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-[var(--color-dark-green)] bg-[var(--color-cream)] text-[var(--color-dark-green)] shadow-md transition-all hover:bg-amber-100 active:scale-95 lg:hidden"
            aria-label="Open categories menu"
          >
            <Menu size={20} />
          </Button>

          {/* Search Input - shown on md+ */}
          <div className="relative hidden flex-1 lg:block">
            <Search
              className="-translate-y-1/2 absolute top-1/2 left-3 text-[var(--color-dark-green)] opacity-60"
              size={18}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-lg border-2 border-[var(--color-dark-green)]/30 bg-[var(--color-cream)] py-2.5 pr-10 pl-10 text-[var(--color-dark-green)] text-lg placeholder-[var(--color-dark-green)]/40 shadow-inner transition-all focus:border-[var(--color-dark-green)] focus:bg-white focus:shadow-md focus:outline-none lg:text-base"
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

          {/* Mobile Search Input */}
          <div className="relative flex-1 lg:hidden">
            <Search
              className="-translate-y-1/2 absolute top-1/2 left-2.5 text-[var(--color-dark-green)] opacity-60"
              size={16}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-lg border-2 border-[var(--color-dark-green)]/30 bg-[var(--color-cream)] py-2 pr-8 pl-8 text-[var(--color-dark-green)] text-lg placeholder-[var(--color-dark-green)]/40 shadow-inner transition-all focus:border-[var(--color-dark-green)] focus:bg-white focus:shadow-md focus:outline-none"
            />
            {searchQuery && (
              <Button
                onClick={() => onSearchChange("")}
                className="-translate-y-1/2 absolute top-1/2 right-2 flex h-5 w-5 items-center justify-center rounded-full text-[var(--color-dark-green)] opacity-60 transition-all hover:bg-[var(--color-dark-green)]/10 hover:opacity-100 active:scale-95"
                aria-label="Clear search"
              >
                <X size={14} />
              </Button>
            )}
          </div>

          {/* Cart Icon - only for authenticated users, hidden on mobile */}
          {status === "authenticated" && (
            <Link
              href="/cart"
              className="relative hidden h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-[var(--color-dark-green)] bg-[var(--color-cream)] text-[var(--color-dark-green)] shadow-md transition-all hover:bg-amber-100 active:scale-95 lg:flex lg:h-10 lg:w-10"
            >
              <ShoppingCart size={18} className="lg:h-5 lg:w-5" />
              {cartItemCount > 0 && (
                <span className="-top-2 -right-2 absolute flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-orange)] px-1 font-bold text-white text-xs">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </Link>
          )}

          {/* History Icon - only for authenticated users, hidden on mobile */}
          {status === "authenticated" && (
            <Link
              href="/history"
              className="hidden h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-[var(--color-dark-green)] bg-[var(--color-cream)] text-[var(--color-dark-green)] shadow-md transition-all hover:bg-amber-100 active:scale-95 lg:flex lg:h-10 lg:w-10"
              aria-label="View History"
            >
              <Clock size={18} className="lg:h-5 lg:w-5" />
            </Link>
          )}

          {status === "unauthenticated" && (
            <Link
              href="/sign-in"
              className="flex h-9 shrink-0 items-center justify-center rounded-lg border-2 border-[var(--color-dark-green)] bg-[var(--color-dark-green)] px-3 font-medium text-[var(--color-cream)] text-xs shadow-md transition-all hover:bg-[var(--color-dark-green)]/90 active:scale-95 lg:h-10 lg:px-4 lg:text-sm"
            >
              Sign In
            </Link>
          )}

          {status === "authenticated" && (
            <Button
              onClick={() => signOut()}
              className="flex h-9 shrink-0 items-center justify-center rounded-lg border-2 border-[var(--color-dark-green)] bg-[var(--color-cream)] px-3 font-medium text-[var(--color-dark-green)] text-xs shadow-md transition-all hover:bg-amber-100 active:scale-95 lg:h-10 lg:px-4 lg:text-sm"
              aria-label="Log Out"
            >
              Log Out
            </Button>
          )}
        </div>

        <div
          className={`flex items-center justify-between gap-1.5 lg:mb-2 lg:gap-2 ${hasActiveCategoryFilter && status !== "authenticated" ? "" : ""}`}
        >
          {/* Mobile Store Dropdown */}
          <div className="relative lg:hidden">
            <Button
              onClick={() => setIsStoreDropdownOpen(!isStoreDropdownOpen)}
              className="flex items-center gap-1.5 rounded-lg border-2 border-[var(--color-dark-green)] bg-[var(--color-cream)] px-2.5 py-1.5 font-medium text-[var(--color-dark-green)] text-xs shadow-md transition-all hover:bg-amber-100 active:scale-95"
            >
              {selectedStore && (
                <div className="relative h-4 w-4 shrink-0 overflow-hidden rounded-full bg-white">
                  <Image
                    src={
                      stores.find((s) => s.filterValue === selectedStore)
                        ?.logo ?? ""
                    }
                    alt=""
                    fill
                    className="rounded-full object-contain"
                  />
                </div>
              )}
              <span className="max-w-24 truncate">
                {selectedStore
                  ? stores.find((s) => s.filterValue === selectedStore)?.name
                  : "All Stores"}
              </span>
              <ChevronDown
                size={14}
                className={`transition-transform ${isStoreDropdownOpen ? "rotate-180" : ""}`}
              />
            </Button>

            {/* Backdrop to close dropdown */}
            <button
              type="button"
              aria-label="Close store dropdown"
              className={`fixed inset-0 z-40 transition-opacity duration-200 ${
                isStoreDropdownOpen
                  ? "opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
              onClick={() => setIsStoreDropdownOpen(false)}
            />
            {/* Dropdown Menu */}
            <div
              className={`absolute left-0 z-50 mt-1 w-40 origin-top-left overflow-hidden rounded-lg border-2 border-[var(--color-dark-green)] bg-[var(--color-cream)] shadow-lg transition-all duration-200 ${
                isStoreDropdownOpen
                  ? "scale-100 opacity-100"
                  : "pointer-events-none scale-95 opacity-0"
              }`}
            >
              <div>
                <Button
                  onClick={() => {
                    onStoreChange(null);
                    setIsStoreDropdownOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-all ${
                    selectedStore === null
                      ? "bg-[var(--color-dark-green)] text-[var(--color-cream)]"
                      : "text-[var(--color-dark-green)] hover:bg-[var(--color-dark-green)]/10"
                  }`}
                >
                  All Stores
                </Button>
                {stores.map((store) => (
                  <Button
                    key={store.id}
                    onClick={() => {
                      onStoreChange(store.filterValue);
                      setIsStoreDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-all ${
                      selectedStore === store.filterValue
                        ? "bg-[var(--color-dark-green)] text-[var(--color-cream)]"
                        : "text-[var(--color-dark-green)] hover:bg-[var(--color-dark-green)]/10"
                    }`}
                  >
                    <div className="relative h-4 w-4 shrink-0 overflow-hidden rounded-full bg-white">
                      <Image
                        src={store.logo}
                        alt={store.name}
                        fill
                        className="rounded-full object-contain"
                      />
                    </div>
                    <span className="truncate">{store.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Right side content for mobile */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Filter by Store text and category badge - only shown when category is selected AND user is NOT authenticated */}
            {hasActiveCategoryFilter && status !== "authenticated" && (
              <>
                <h2 className="font-semibold text-[var(--color-dark-green)] text-xs">
                  Filter by
                </h2>
                <span className="flex items-center gap-1 rounded-md bg-[var(--color-dark-green)] px-2 py-1 font-medium text-[var(--color-cream)] text-xs">
                  <span className="max-w-20 truncate">
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
              </>
            )}

            {/* Mobile Cart Icon */}
            {status === "authenticated" && (
              <Link
                href="/cart"
                className="relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-[var(--color-dark-green)] bg-[var(--color-cream)] text-[var(--color-dark-green)] shadow-md transition-all hover:bg-amber-100 active:scale-95"
              >
                <ShoppingCart size={16} />
                {cartItemCount > 0 && (
                  <span className="-top-1.5 -right-1.5 absolute flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-orange)] px-0.5 font-bold text-[10px] text-white">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
              </Link>
            )}

            {/* Mobile History Icon */}
            {status === "authenticated" && (
              <Link
                href="/history"
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-[var(--color-dark-green)] bg-[var(--color-cream)] text-[var(--color-dark-green)] shadow-md transition-all hover:bg-amber-100 active:scale-95"
                aria-label="View History"
              >
                <Clock size={16} />
              </Link>
            )}
          </div>

          <div className="hidden rounded-lg bg-[var(--color-dark-green)]/10 px-3 py-1.5 text-center lg:block">
            <p className="text-[var(--color-dark-green)] text-xs">
              Data resets every 24 hours at 10:00 AM
            </p>
          </div>
        </div>

        {/* Mobile: Category filter on separate line when authenticated */}
        {hasActiveCategoryFilter && status === "authenticated" && (
          <div className="mt-2 flex items-center gap-2 lg:hidden">
            <h2 className="font-semibold text-[var(--color-dark-green)] text-xs">
              Filter by
            </h2>
            <span className="flex items-center gap-1 rounded-md bg-[var(--color-dark-green)] px-2 py-1 font-medium text-[var(--color-cream)] text-xs">
              <span className="max-w-32 truncate">
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
          </div>
        )}
        {/* Store Filter Buttons - hidden on mobile, use dropdown instead */}
        <div className="hidden flex-wrap gap-2 lg:flex">
          {/* All Stores Button */}
          <Button
            onClick={() => onStoreChange(null)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 font-medium text-sm outline-none transition-all focus:outline-none ${
              selectedStore === null
                ? "bg-[var(--color-dark-green)] text-[var(--color-cream)]"
                : "bg-[var(--color-cream)] text-[var(--color-dark-green)] opacity-70 hover:opacity-100"
            }`}
          >
            All Stores
          </Button>

          {/* Store Filter Buttons */}
          {stores.map((store) => (
            <Button
              key={store.id}
              onClick={() => onStoreChange(store.filterValue)}
              className={`flex items-center gap-2 rounded-full p-2 outline-none transition-all focus:outline-none ${
                selectedStore === store.filterValue
                  ? "bg-[var(--color-dark-green)] text-[var(--color-cream)]"
                  : "bg-[var(--color-cream)] text-[var(--color-dark-green)] opacity-70 hover:opacity-100"
              }`}
            >
              <div className="relative h-6 w-6 overflow-hidden rounded-full bg-white p-0.5">
                <Image
                  src={store.logo}
                  alt={store.name}
                  fill
                  className="rounded-full object-contain"
                />
              </div>
              <span className="whitespace-nowrap font-medium text-sm">
                {store.name}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
