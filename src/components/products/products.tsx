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

  const [selectedStore, setSelectedStore] = useState<string | null>(
    searchParams.get("store"),
  );
  const [selectedSort, setSelectedSort] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "discount_percent_desc",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const prevCategoryRef = useRef<string | null>(null);

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

  const handleStoreChange = useCallback(
    (store: string | null) => {
      setSelectedStore(store);
      updateURLParams({ store });
    },
    [updateURLParams],
  );

  const handleSortChange = useCallback(
    (sort: SortOption) => {
      setSelectedSort(sort);
      updateURLParams({ sort });
    },
    [updateURLParams],
  );

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (query) {
        setSelectedCategory(null);
      }
    },
    [setSelectedCategory],
  );

  useEffect(() => {
    const currentCategory = selectedCategory || selectedSubcategory;
    const prevCategory = prevCategoryRef.current;

    if (currentCategory !== prevCategory && currentCategory && searchQuery) {
      setSearchQuery("");
      updateURLParams({ search: null });
    }

    prevCategoryRef.current = currentCategory;
  }, [selectedCategory, selectedSubcategory, searchQuery, updateURLParams]);

  useEffect(() => {
    const store = searchParams.get("store");
    const sort = searchParams.get("sort") as SortOption;

    setSelectedStore(store);
    setSelectedSort(sort || "discount_percent_desc");
  }, [searchParams]);

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
    <div className="flex h-[100svh] flex-col bg-[var(--background-100)] lg:h-screen">
      <FilterBar
        selectedStore={selectedStore}
        onStoreChange={handleStoreChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* Product Grid - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-4 lg:p-6">
          {error && (
            <div className="rounded-lg bg-[var(--accent-coral-soft)] p-4 text-[var(--accent-coral)]">
              Failed to load products
            </div>
          )}

          {!error && (
            <>
              <div className="mb-4 flex flex-col gap-3 lg:mb-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="text-[var(--foreground-200)] text-sm">
                  Showing{" "}
                  <span className="font-medium text-[var(--foreground-100)]">
                    {products.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-[var(--foreground-100)]">
                    {total}
                  </span>{" "}
                  product{total !== 1 ? "s" : ""}
                </div>
                <SortDropdown
                  selectedSort={selectedSort}
                  onSortChange={handleSortChange}
                />
              </div>

              <div className="relative min-h-[400px]">
                {showCenterSpinner && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--background-100)]/80 backdrop-blur-[1px]">
                    <div className="h-10 w-10 animate-spin rounded-full border-3 border-[var(--background-300)] border-t-[var(--accent-primary)]" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
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
                  <div className="h-8 w-8 animate-spin rounded-full border-3 border-[var(--background-300)] border-t-[var(--accent-primary)]" />
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

    const normalizedName = name.replace(/[\s-]/g, "");
    if (storeLogos[normalizedName]) return storeLogos[normalizedName];

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
    <div className="card-hover group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-[var(--shadow-sm)]">
      {/* Store Logo Badge */}
      {storeLogo && (
        <div className="absolute top-2 right-2 z-10 h-8 w-8 overflow-hidden rounded-full bg-white shadow-[var(--shadow-md)] lg:top-3 lg:right-3 lg:h-10 lg:w-10">
          <Image
            src={storeLogo}
            alt="Store"
            fill
            className="rounded-full object-contain p-0.5"
          />
        </div>
      )}

      {/* Cart Quantity Badge */}
      {cartQuantity > 0 && (
        <div className="absolute top-2 left-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent-primary)] font-semibold text-[10px] text-white shadow-[var(--shadow-sm)] lg:top-3 lg:left-3 lg:h-7 lg:w-7 lg:text-xs">
          {cartQuantity}
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-[var(--background-100)]">
        {product.image_url !== null ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--foreground-300)]">
            No Image
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-3 lg:p-4">
        <h3 className="mb-2 line-clamp-2 font-medium text-[var(--foreground-100)] text-xs lg:text-sm">
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="mt-auto mb-2 flex items-baseline gap-2 lg:mb-3">
          <span className="font-bold font-display text-[var(--foreground-100)] text-lg lg:text-2xl">
            ₾{(product.current_price ?? 0).toFixed(2)}
          </span>
          <span className="text-[11px] text-[var(--foreground-300)] line-through lg:text-sm">
            ₾{(product.original_price ?? 0).toFixed(2)}
          </span>
        </div>

        {/* Discount Badge */}
        <div className="mb-3 lg:mb-4">
          <span className="inline-flex items-center rounded-full bg-[var(--accent-coral-soft)] px-2 py-0.5 font-semibold text-[10px] text-[var(--accent-coral)] lg:px-2.5 lg:py-1 lg:text-xs">
            {product.discount_percent ?? 0}% OFF
          </span>
        </div>

        {/* Quantity Controls & Cart */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quantity Selector */}
          <div className="flex items-center gap-1 rounded-full bg-[var(--background-200)] p-0.5">
            <Button
              onClick={decrementQuantity}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[var(--foreground-200)] transition-all hover:bg-white hover:text-[var(--foreground-100)] active:scale-95 lg:h-8 lg:w-8"
            >
              <Minus size={14} />
            </Button>
            <span className="min-w-[1.5rem] text-center font-semibold text-[var(--foreground-100)] text-sm lg:min-w-[2rem] lg:text-base">
              {quantity}
            </span>
            <Button
              onClick={incrementQuantity}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[var(--foreground-200)] transition-all hover:bg-white hover:text-[var(--foreground-100)] active:scale-95 lg:h-8 lg:w-8"
            >
              <Plus size={14} />
            </Button>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={isPending}
            variant="primary"
            className="flex-1 whitespace-nowrap rounded-full px-3 py-2 font-semibold text-xs lg:text-sm"
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
        className="flex items-center gap-2 rounded-xl border border-[var(--background-300)] bg-white px-4 py-2.5 text-[var(--foreground-100)] text-sm transition-all hover:border-[var(--foreground-300)] hover:shadow-[var(--shadow-sm)]"
      >
        <SelectedIcon size={16} className="text-[var(--foreground-200)]" />
        <span className="font-medium">{selectedOption?.label}</span>
        <ChevronDown
          size={16}
          className={`text-[var(--foreground-300)] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </Button>

      <div
        className={`absolute right-0 z-50 mt-2 w-56 origin-top-right overflow-hidden rounded-xl border border-[var(--background-300)] bg-white shadow-[var(--shadow-lg)] transition-all duration-200 ${
          isOpen
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <div className="py-1">
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
                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-all ${
                  isSelected
                    ? "bg-[var(--accent-primary-soft)] font-medium text-[var(--accent-primary)]"
                    : "text-[var(--foreground-100)] hover:bg-[var(--background-200)]"
                }`}
              >
                <Icon
                  size={18}
                  className={
                    isSelected
                      ? "text-[var(--accent-primary)]"
                      : "text-[var(--foreground-300)]"
                  }
                />
                <span>{option.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
