"use client";

import Image from "next/image";
import { type Product, useGetProducts } from "@/hooks/use-get-products";
import { FilterBar } from "../filter-bar";

export function Products() {
  const { data, isLoading, error } = useGetProducts();

  const products = data?.products ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <FilterBar />

      {/* Product Grid */}
      <div className="mx-auto max-w-7xl p-6">
        {isLoading && (
          <div className="text-[var(--color-dark-green)]">Loading...</div>
        )}

        {error && <div className="text-red-500">Failed to load products</div>}

        {!isLoading && !error && (
          <>
            <div className="mb-4 text-[var(--color-dark-green)] text-sm">
              Showing {products.length} of {total} product
              {total !== 1 ? "s" : ""}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="overflow-hidden rounded-lg bg-[var(--color-sage)] shadow-md transition-shadow hover:shadow-xl">
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
            ₾{product.current_price.toFixed(2)}
          </span>
          <span className="text-[var(--color-dark-green)] text-sm line-through opacity-60">
            ₾{product.original_price.toFixed(2)}
          </span>
        </div>

        {/* Discount Badge */}
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-[var(--color-orange)] px-3 py-1 font-bold text-white text-xs">
            {product.discount_percent}% OFF
          </span>
        </div>
      </div>
    </div>
  );
}
