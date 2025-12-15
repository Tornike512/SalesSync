"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { type Product, useGetProducts } from "@/hooks/use-get-products";
import { useCategoryFilter } from "@/providers/category-filter-provider";
import agrohubLogo from "../../../public/images/agrohub.png";
import carrefourLogo from "../../../public/images/carrefour.webp";
import europroductLogo from "../../../public/images/europroduct.jpg";
import goodwillLogo from "../../../public/images/goodwill.jpg";
import ioliLogo from "../../../public/images/ioli.jpg";
import magnitiLogo from "../../../public/images/magniti.webp";
import nikoraLogo from "../../../public/images/nikora.png";
import sparLogo from "../../../public/images/spar.jpeg";
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

export function Products() {
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
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
            <div className="mb-4 text-[var(--color-dark-green)] text-sm">
              Showing {products.length} of {total} product
              {total !== 1 ? "s" : ""}
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
