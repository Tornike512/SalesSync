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
    setSelectedCategory(null);
  };

  const hasActiveCategoryFilter =
    selectedCategory !== null || selectedSubcategory !== null;

  return (
    <div className="z-30 shrink-0 border-[var(--background-300)] border-b bg-white p-3 shadow-[var(--shadow-sm)] lg:p-4">
      <div className="mx-auto max-w-7xl">
        {/* Top row: Menu, Search, Icons, Auth */}
        <div className="relative mb-3 flex items-center gap-3 lg:mb-4">
          {/* Mobile Menu Button */}
          <Button
            onClick={open}
            variant="ghost"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[var(--foreground-200)] hover:bg-[var(--background-200)] hover:text-[var(--foreground-100)] lg:hidden"
            aria-label="Open categories menu"
          >
            <Menu size={22} />
          </Button>

          {/* Search Input - shown on md+ */}
          <div className="relative hidden flex-1 lg:block">
            <Search
              className="-translate-y-1/2 absolute top-1/2 left-4 text-[var(--foreground-300)]"
              size={18}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-xl border border-[var(--background-300)] bg-[var(--background-100)] py-3 pr-10 pl-11 text-[var(--foreground-100)] placeholder-[var(--foreground-300)] transition-all focus:border-[var(--accent-primary)] focus:bg-white focus:shadow-[var(--shadow-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary-soft)]"
            />
            {searchQuery && (
              <Button
                onClick={() => onSearchChange("")}
                className="-translate-y-1/2 absolute top-1/2 right-3 flex h-6 w-6 items-center justify-center rounded-full text-[var(--foreground-300)] transition-all hover:bg-[var(--background-200)] hover:text-[var(--foreground-100)]"
                aria-label="Clear search"
              >
                <X size={16} />
              </Button>
            )}
          </div>

          {/* Mobile Search Input */}
          <div className="relative flex-1 lg:hidden">
            <Search
              className="-translate-y-1/2 absolute top-1/2 left-3 text-[var(--foreground-300)]"
              size={16}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-xl border border-[var(--background-300)] bg-[var(--background-100)] py-2.5 pr-8 pl-9 text-[var(--foreground-100)] text-sm placeholder-[var(--foreground-300)] transition-all focus:border-[var(--accent-primary)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary-soft)]"
            />
            {searchQuery && (
              <Button
                onClick={() => onSearchChange("")}
                className="-translate-y-1/2 absolute top-1/2 right-2 flex h-5 w-5 items-center justify-center rounded-full text-[var(--foreground-300)] transition-all hover:bg-[var(--background-200)] hover:text-[var(--foreground-100)]"
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
              className="relative hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[var(--foreground-200)] transition-all hover:bg-[var(--background-200)] hover:text-[var(--foreground-100)] lg:flex"
            >
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="-top-1 -right-1 absolute flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent-coral)] px-1 font-semibold text-white text-xs">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </Link>
          )}

          {/* History Icon - only for authenticated users, hidden on mobile */}
          {status === "authenticated" && (
            <Link
              href="/history"
              className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[var(--foreground-200)] transition-all hover:bg-[var(--background-200)] hover:text-[var(--foreground-100)] lg:flex"
              aria-label="View History"
            >
              <Clock size={20} />
            </Link>
          )}

          {status === "unauthenticated" && (
            <Link
              href="/sign-in"
              className="flex h-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-primary)] px-4 font-medium text-sm text-white transition-all hover:bg-[var(--accent-primary-hover)] active:scale-[0.98]"
            >
              Sign In
            </Link>
          )}

          {status === "authenticated" && (
            <Button
              onClick={() => signOut()}
              variant="secondary"
              size="md"
              className="shrink-0 rounded-xl"
              aria-label="Log Out"
            >
              Log Out
            </Button>
          )}
        </div>

        <div className={`flex items-center justify-between gap-2 lg:mb-3`}>
          {/* Mobile Store Dropdown */}
          <div className="relative lg:hidden">
            <Button
              onClick={() => setIsStoreDropdownOpen(!isStoreDropdownOpen)}
              className="flex items-center gap-2 rounded-xl border border-[var(--background-300)] bg-white px-3 py-2 text-[var(--foreground-100)] text-sm transition-all hover:bg-[var(--background-200)]"
            >
              {selectedStore && (
                <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full bg-white shadow-sm">
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
              <span className="max-w-24 truncate font-medium">
                {selectedStore
                  ? stores.find((s) => s.filterValue === selectedStore)?.name
                  : "All Stores"}
              </span>
              <ChevronDown
                size={16}
                className={`text-[var(--foreground-300)] transition-transform ${isStoreDropdownOpen ? "rotate-180" : ""}`}
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
              className={`absolute left-0 z-50 mt-2 w-44 origin-top-left overflow-hidden rounded-xl border border-[var(--background-300)] bg-white shadow-[var(--shadow-lg)] transition-all duration-200 ${
                isStoreDropdownOpen
                  ? "scale-100 opacity-100"
                  : "pointer-events-none scale-95 opacity-0"
              }`}
            >
              <div className="py-1">
                <Button
                  onClick={() => {
                    onStoreChange(null);
                    setIsStoreDropdownOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-all ${
                    selectedStore === null
                      ? "bg-[var(--accent-primary-soft)] font-medium text-[var(--accent-primary)]"
                      : "text-[var(--foreground-100)] hover:bg-[var(--background-200)]"
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
                    className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-all ${
                      selectedStore === store.filterValue
                        ? "bg-[var(--accent-primary-soft)] font-medium text-[var(--accent-primary)]"
                        : "text-[var(--foreground-100)] hover:bg-[var(--background-200)]"
                    }`}
                  >
                    <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full bg-white shadow-sm">
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
              <span className="flex items-center gap-1.5 rounded-lg bg-[var(--accent-primary-soft)] px-2.5 py-1.5 text-[var(--accent-primary)] text-sm">
                <span className="max-w-20 truncate font-medium">
                  {selectedSubcategory || selectedCategory}
                </span>
                <Button
                  onClick={handleClearCategoryFilter}
                  className="flex items-center justify-center rounded-full p-0.5 transition-all hover:bg-[var(--accent-primary)]/10"
                  aria-label="Clear category filter"
                >
                  <X size={14} />
                </Button>
              </span>
            )}

            {/* Mobile Cart Icon */}
            {status === "authenticated" && (
              <Link
                href="/cart"
                className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[var(--foreground-200)] transition-all hover:bg-[var(--background-200)] hover:text-[var(--foreground-100)]"
              >
                <ShoppingCart size={18} />
                {cartItemCount > 0 && (
                  <span className="-top-1 -right-1 absolute flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent-coral)] px-1 font-semibold text-[10px] text-white">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
              </Link>
            )}

            {/* Mobile History Icon */}
            {status === "authenticated" && (
              <Link
                href="/history"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[var(--foreground-200)] transition-all hover:bg-[var(--background-200)] hover:text-[var(--foreground-100)]"
                aria-label="View History"
              >
                <Clock size={18} />
              </Link>
            )}
          </div>

          <div className="hidden rounded-lg bg-[var(--background-200)] px-3 py-2 lg:block">
            <p className="text-[var(--foreground-200)] text-xs">
              Data resets every 24 hours at 10:00 AM
            </p>
          </div>
        </div>

        {/* Mobile: Category filter on separate line when authenticated */}
        {hasActiveCategoryFilter && status === "authenticated" && (
          <div className="mt-2 flex items-center gap-2 lg:hidden">
            <span className="flex items-center gap-1.5 rounded-lg bg-[var(--accent-primary-soft)] px-2.5 py-1.5 text-[var(--accent-primary)] text-sm">
              <span className="max-w-32 truncate font-medium">
                {selectedSubcategory || selectedCategory}
              </span>
              <Button
                onClick={handleClearCategoryFilter}
                className="flex items-center justify-center rounded-full p-0.5 transition-all hover:bg-[var(--accent-primary)]/10"
                aria-label="Clear category filter"
              >
                <X size={14} />
              </Button>
            </span>
          </div>
        )}

        {/* Store Filter Buttons - hidden on mobile, use dropdown instead */}
        <div className="hidden flex-wrap gap-2 lg:flex">
          {/* All Stores Button */}
          <Button
            onClick={() => onStoreChange(null)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all ${
              selectedStore === null
                ? "bg-[var(--accent-primary)] font-medium text-white shadow-sm"
                : "bg-[var(--background-200)] text-[var(--foreground-200)] hover:bg-[var(--background-300)] hover:text-[var(--foreground-100)]"
            }`}
          >
            All Stores
          </Button>

          {/* Store Filter Buttons */}
          {stores.map((store) => (
            <Button
              key={store.id}
              onClick={() => onStoreChange(store.filterValue)}
              className={`flex items-center gap-2 rounded-full py-2 pr-4 pl-2 text-sm transition-all ${
                selectedStore === store.filterValue
                  ? "bg-[var(--accent-primary)] font-medium text-white shadow-sm"
                  : "bg-[var(--background-200)] text-[var(--foreground-200)] hover:bg-[var(--background-300)] hover:text-[var(--foreground-100)]"
              }`}
            >
              <div className="relative h-6 w-6 overflow-hidden rounded-full bg-white p-0.5 shadow-sm">
                <Image
                  src={store.logo}
                  alt={store.name}
                  fill
                  className="rounded-full object-contain"
                />
              </div>
              <span className="whitespace-nowrap">{store.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
