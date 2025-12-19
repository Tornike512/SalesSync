"use client";

import { Clock, Trash2, TrendingDown } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/button";
import type { HistoryItem } from "../hooks/use-get-history";

interface ProductGridProps {
  readonly items: readonly HistoryItem[];
  readonly onDeleteItem: (id: number) => void;
  readonly isDeletingItem: boolean;
}

export function ProductGrid({
  items,
  onDeleteItem,
  isDeletingItem,
}: ProductGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => {
        const discountAmount = item.original_price - item.current_price;
        const viewedDate = new Date(item.viewed_at);
        const formattedDate = viewedDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        const formattedTime = viewedDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div
            key={`${item.id}-${item.viewed_at}`}
            className={`group relative flex flex-col overflow-hidden rounded-lg border-2 bg-white shadow-md transition-shadow hover:shadow-xl ${
              item.is_available
                ? "border-[var(--color-yellow)]/30"
                : "border-gray-300 opacity-75"
            }`}
          >
            {/* Image Container */}
            <div className="relative aspect-square w-full overflow-hidden bg-white">
              {/* Delete Item Button */}
              <Button
                type="button"
                onClick={() => onDeleteItem(item.id)}
                disabled={isDeletingItem}
                className="absolute top-2 left-2 z-10 flex size-8 items-center justify-center rounded-full bg-[var(--foreground-100)]/50 text-[var(--color-cream)] transition-opacity hover:bg-[var(--color-orange)] disabled:cursor-not-allowed disabled:opacity-50"
                title="Remove from history"
              >
                <Trash2 className="size-4" />
              </Button>
              <Image
                src={item.product_image_url}
                alt={item.product_name}
                fill
                className={`object-cover transition-transform group-hover:scale-105 ${
                  !item.is_available ? "grayscale" : ""
                }`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
              {!item.is_available && (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--foreground-100)]/50">
                  <span className="rounded bg-[var(--color-orange)] px-3 py-1 font-bold text-[var(--color-cream)] text-sm shadow-lg">
                    UNAVAILABLE
                  </span>
                </div>
              )}
              {item.is_available && item.discount_percent > 0 && (
                <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-[var(--color-orange)] px-2 py-1 font-bold text-[var(--color-cream)] text-xs shadow-lg">
                  <TrendingDown className="size-3" />
                  {item.discount_percent}%
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-4">
              {/* Store Name */}
              <div className="mb-2 font-semibold text-[var(--foreground-100)]/70 text-sm uppercase">
                {item.store_name.split(" ")[0]}
              </div>

              {/* Product Name */}
              <h3 className="mb-3 line-clamp-2 font-bold text-[var(--foreground-100)] text-base">
                {item.product_name}
              </h3>

              {/* Price Info */}
              <div className="mt-auto mb-3">
                <div className="mb-1 flex items-baseline gap-2">
                  <span className="font-bold text-[var(--foreground-100)] text-xl">
                    ₾{item.current_price.toFixed(2)}
                  </span>
                  {item.original_price > item.current_price && (
                    <span className="text-[var(--foreground-100)]/50 text-sm line-through">
                      ₾{item.original_price.toFixed(2)}
                    </span>
                  )}
                </div>
                {item.quantity > 1 && (
                  <div className="font-bold text-[var(--foreground-100)] text-sm">
                    Qty: {item.quantity} (Total: ₾
                    {(item.current_price * item.quantity).toFixed(2)})
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="font-semibold text-[var(--color-orange)] text-sm">
                    Save ₾{(discountAmount * item.quantity).toFixed(2)}
                  </div>
                )}
              </div>

              {/* Viewed Date */}
              <div className="flex items-center gap-1 border-[var(--color-yellow)]/30 border-t pt-3 text-[var(--foreground-100)]/60 text-xs">
                <Clock className="size-3" />
                <span>
                  {formattedDate} at {formattedTime}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
