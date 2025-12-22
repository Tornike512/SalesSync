"use client";
import {
  ArrowDown01,
  ArrowDown10,
  ChevronDown,
  type LucideIcon,
  Minus,
  Percent,
  PiggyBank,
  Plus,
} from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { useAddCartItem } from "@/hooks/use-add-cart-item";
import { useGetCart } from "@/hooks/use-get-cart";
import {
  type Product,
  type SortOption,
  useGetProducts,
} from "@/hooks/use-get-products";
import { useSession } from "@/hooks/use-session";
import { useCategoryFilter } from "@/providers/category-filter-provider";

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
import { FilterBar } from "../filter-bar";

const storeLogos: Record<string, StaticImageData> = {
  agrohub: agrohubLogo,
  carrefour: carrefourLogo,
  europroduct: europroductLogo,
  goodwill: goodwillLogo,
  gvirila: gvirilaLogo,
  ioli: ioliLogo,
  magniti: magnitiLogo,
  nikora: nikoraLogo,
  oneprice: onePriceLogo,
  orinabiji: oriNabijiLogo,
  spar: sparLogo,
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

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function Products() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedCategory, selectedSubcategory, setSelectedCategory } =
    useCategoryFilter();

  // Initialize state from URL params
  const [selectedStore, setSelectedStore] = useState<string | null>(
    searchParams.get("store"),
  );
  const [selectedSort, setSelectedSort] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "discount_percent_desc",
  );
  // Search query is not synced with URL
  const [searchQuery, setSearchQuery] = useState("");

  // Track previous category to detect category changes
  const prevCategoryRef = useRef<string | null>(null);

  // Function to update URL params
  const updateURLParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }

      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );

  // Handle store change
  const handleStoreChange = useCallback(
    (store: string | null) => {
      setSelectedStore(store);
      updateURLParams({ store });
    },
    [updateURLParams],
  );

  // Handle sort change
  const handleSortChange = useCallback(
    (sort: SortOption) => {
      setSelectedSort(sort);
      updateURLParams({ sort });
    },
    [updateURLParams],
  );

  // Handle search change (not synced to URL)
  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (query) {
        setSelectedCategory(null);
      }
    },
    [setSelectedCategory],
  );

  // Clear search input when category changes
  useEffect(() => {
    const currentCategory = selectedCategory || selectedSubcategory;
    const prevCategory = prevCategoryRef.current;

    // Only clear if category actually changed and there's a search query
    if (currentCategory !== prevCategory && currentCategory && searchQuery) {
      setSearchQuery("");
      updateURLParams({ search: null });
    }

    prevCategoryRef.current = currentCategory;
  }, [selectedCategory, selectedSubcategory, searchQuery, updateURLParams]);

  // Sync state with URL params when they change externally (e.g., browser back/forward)
  useEffect(() => {
    const store = searchParams.get("store");
    const sort = searchParams.get("sort") as SortOption;

    setSelectedStore(store);
    setSelectedSort(sort || "discount_percent_desc");
  }, [searchParams.get]); // Use toString() to avoid multiple triggers

  const debouncedSearch = useDebounce(searchQuery, 300);

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
    subcategory: selectedSubcategory,
    sort: selectedSort,
    search: debouncedSearch || null,
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
    <div className="flex h-[100svh] flex-col bg-[var(--color-cream)] md:h-screen">
      <FilterBar
        selectedStore={selectedStore}
        onStoreChange={handleStoreChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* Product Grid - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-6">
          {error && <div className="text-red-500">Failed to load products</div>}

          {!error && (
            <>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-[var(--color-dark-green)] text-sm">
                  Showing {products.length} of {total} product
                  {total !== 1 ? "s" : ""}
                </div>
                <SortDropdown
                  selectedSort={selectedSort}
                  onSortChange={handleSortChange}
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
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { data: cart } = useGetCart();
  const { mutate: addToCart, isPending } = useAddCartItem();
  const { status } = useSession();
  const router = useRouter();

  const cartItem = cart?.items.find((item) => item.product_id === product.id);
  const cartQuantity = cartItem?.quantity ?? 0;

  const getStoreLogo = (storeName: string | undefined) => {
    if (!storeName) return null;
    const name = storeName.toLowerCase();
    if (storeLogos[name]) return storeLogos[name];

    // Remove spaces and special characters for matching (e.g., "Ori Nabiji" -> "orinabiji")
    const normalizedName = name.replace(/[\s-]/g, "");
    if (storeLogos[normalizedName]) return storeLogos[normalizedName];

    // Handle cases like "Carrefour Vekua" -> "carrefour"
    const firstWord = name.split(" ")[0];
    return storeLogos[firstWord] ?? null;
  };

  const storeLogo = getStoreLogo(product.store_name);

  const handleAddToCart = () => {
    if (status !== "authenticated") {
      router.push("/sign-in");
      return;
    }

    addToCart(
      { product_id: product.id, quantity },
      {
        onSuccess: () => {
          toast.success(
            `Added ${quantity} item${quantity > 1 ? "s" : ""} to cart`,
          );
          setQuantity(1);
        },
        onError: () => {
          toast.error("Failed to add item to cart");
        },
      },
    );
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg bg-[var(--color-sage)] shadow-md transition-shadow hover:shadow-xl">
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

      {/* Cart Quantity Badge */}
      {cartQuantity > 0 && (
        <div className="absolute top-2 left-3 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-orange)] font-bold text-white text-xs shadow-md">
          {cartQuantity}
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-white">
        {product.image_url !== null ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--color-dark-green)] opacity-50">
            No Image
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 line-clamp-2 font-semibold text-[var(--color-dark-green)] text-base">
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="mt-auto mb-2 flex items-baseline gap-2">
          <span className="font-bold text-2xl text-[var(--color-orange)]">
            ₾{(product.current_price ?? 0).toFixed(2)}
          </span>
          <span className="text-[var(--color-dark-green)] text-sm line-through opacity-60">
            ₾{(product.original_price ?? 0).toFixed(2)}
          </span>
        </div>

        {/* Discount Badge */}
        <div className="mb-3">
          <span className="rounded-full bg-[var(--color-orange)] px-3 py-1 font-bold text-white text-xs">
            {product.discount_percent ?? 0}% OFF
          </span>
        </div>

        {/* Quantity Controls & Cart */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quantity Selector */}
          <div className="flex items-center gap-1">
            <Button
              onClick={decrementQuantity}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-yellow)] text-[var(--color-dark-green)] transition-all hover:bg-[var(--color-yellow)]/80 active:scale-95"
            >
              <Minus size={14} />
            </Button>
            <span className="min-w-[1.5rem] text-center font-bold text-[var(--color-dark-green)] text-lg">
              {quantity}
            </span>
            <Button
              onClick={incrementQuantity}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-yellow)] text-[var(--color-dark-green)] transition-all hover:bg-[var(--color-yellow)]/80 active:scale-95"
            >
              <Plus size={14} />
            </Button>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={isPending}
            className="flex-1 whitespace-nowrap rounded-full bg-[var(--color-yellow)] px-3 py-2 font-semibold text-[var(--color-dark-green)] text-sm shadow-md transition-all hover:bg-[var(--color-yellow)]/80 active:scale-95 disabled:opacity-50"
          >
            Add to cart
          </Button>
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
