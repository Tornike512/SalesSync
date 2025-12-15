"use client";

import {
  ArrowDown01,
  ArrowDown10,
  ChevronDown,
  type LucideIcon,
  Percent,
  PiggyBank,
} from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  type Product,
  type SortOption,
  useGetProducts,
} from "@/hooks/use-get-products";
import { useCategoryFilter } from "@/providers/category-filter-provider";
import agrohubLogo from "../../../public/images/agrohub.png";
import carrefourLogo from "../../../public/images/carrefour.webp";
import europroductLogo from "../../../public/images/europroduct.jpg";
import goodwillLogo from "../../../public/images/goodwill.jpg";
import ioliLogo from "../../../public/images/ioli.jpg";
import magnitiLogo from "../../../public/images/magniti.webp";
import nikoraLogo from "../../../public/images/nikora.png";
import sparLogo from "../../../public/images/spar.jpeg";
import { Button } from "../button";
import { FilterBar } from "../filter-bar";

const storeLogos: Record<string, StaticImageData> = {
  agrohub: agrohubLogo,
  europroduct: europroductLogo,
  goodwill: goodwillLogo,
  ioli: ioliLogo,
  magniti: magnitiLogo,
  nikora: nikoraLogo,
  spar: sparLogo,
  carrefour: carrefourLogo,
};

const sortOptions: { value: SortOption; label: string; icon: LucideIcon }[] = [
  { value: "price_asc", label: "Price: Low to High", icon: ArrowDown01 },
  { value: "price_desc", label: "Price: High to Low", icon: ArrowDown10 },
  {
    value: "discount_percent_desc",
    label: "Discount: High to Low",
    icon: Percent,
  },
  {
    value: "discount_percent_asc",
    label: "Discount: Low to High",
    icon: Percent,
  },
  {
    value: "discount_amount_desc",
    label: "Savings: High to Low",
    icon: PiggyBank,
  },
  {
    value: "discount_amount_asc",
    label: "Savings: Low to High",
    icon: PiggyBank,
  },
];

export function Products() {
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<SortOption>("price_asc");
  const { selectedCategory } = useCategoryFilter();

  const {
    data,
    isLoading,
    isFetching,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetProducts({
    store_name: selectedStore,
    category: selectedCategory,
    sort: selectedSort,
  });

  const showCenterSpinner = isLoading || (isFetching && !isFetchingNextPage);

  const loaderRef = useRef<HTMLDivElement>(null);

  const products = data?.pages.flatMap((page) => page.products) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(loader);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <FilterBar
        selectedStore={selectedStore}
        onStoreChange={setSelectedStore}
      />

      {/* Product Grid */}
      <div className="mx-auto max-w-7xl p-6">
        {error && <div className="text-red-500">Failed to load products</div>}

        {!error && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[var(--color-dark-green)] text-sm">
                Showing {products.length} of {total} product
                {total !== 1 ? "s" : ""}
              </div>
              <SortDropdown
                selectedSort={selectedSort}
                onSortChange={setSelectedSort}
              />
            </div>

            <div className="relative min-h-[400px]">
              {showCenterSpinner && (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-cream)]/80">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-sage)] border-t-[var(--color-yellow)]" />
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product, index) => (
                  <ProductCard
                    key={`${product.id}-${index}`}
                    product={product}
                  />
                ))}
              </div>
            </div>

            {/* Infinite scroll loader */}
            <div ref={loaderRef} className="flex justify-center py-8">
              {isFetchingNextPage && (
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-sage)] border-t-[var(--color-yellow)]" />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const getStoreLogo = (storeName: string | undefined) => {
    if (!storeName) return null;
    const name = storeName.toLowerCase();
    if (storeLogos[name]) return storeLogos[name];
    // Handle cases like "Carrefour Vekua" -> "carrefour"
    const firstWord = name.split(" ")[0];
    return storeLogos[firstWord] ?? null;
  };

  const storeLogo = getStoreLogo(product.store_name);

  return (
    <div className="relative overflow-hidden rounded-lg bg-[var(--color-sage)] shadow-md transition-shadow hover:shadow-xl">
      {/* Store Logo Badge */}
      {storeLogo && (
        <div className="absolute top-2 right-3 h-10 w-10 overflow-hidden rounded-full bg-white shadow-md">
          <Image
            src={storeLogo}
            alt="Store"
            fill
            className="z-11 rounded-full object-contain shadow-md"
          />
        </div>
      )}
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-white">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="mb-2 line-clamp-2 font-semibold text-[var(--color-dark-green)] text-base">
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="mb-2 flex items-baseline gap-2">
          <span className="font-bold text-2xl text-[var(--color-orange)]">
            ₾{(product.current_price ?? 0).toFixed(2)}
          </span>
          <span className="text-[var(--color-dark-green)] text-sm line-through opacity-60">
            ₾{(product.original_price ?? 0).toFixed(2)}
          </span>
        </div>

        {/* Discount Badge */}
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-[var(--color-orange)] px-3 py-1 font-bold text-white text-xs">
            {product.discount_percent ?? 0}% OFF
          </span>
        </div>
      </div>
    </div>
  );
}

function SortDropdown({
  selectedSort,
  onSortChange,
}: {
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = sortOptions.find((opt) => opt.value === selectedSort);
  const SelectedIcon = selectedOption?.icon ?? ArrowDown01;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border-2 border-[var(--color-dark-green)] bg-white px-3 py-2 font-medium text-[var(--color-dark-green)] text-sm transition-colors hover:bg-[var(--color-sage)]"
      >
        <SelectedIcon size={16} />
        <span>{selectedOption?.label}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-lg border-2 border-[var(--color-dark-green)] bg-white shadow-lg">
          {sortOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = option.value === selectedSort;

            return (
              <Button
                key={option.value}
                onClick={() => {
                  onSortChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                  isSelected
                    ? "bg-[var(--color-sage)] font-semibold text-[var(--color-dark-green)]"
                    : "text-[var(--color-dark-green)] hover:bg-[var(--color-cream)]"
                }`}
              >
                <Icon size={18} />
                <span>{option.label}</span>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
