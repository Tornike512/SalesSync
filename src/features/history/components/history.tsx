"use client";

import { Calendar, Clock, TrendingDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { type TimeFilter, useGetHistory } from "@/hooks/use-get-history";

const filterOptions: { value: TimeFilter; label: string }[] = [
  { value: "day", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
  { value: "all", label: "All Time" },
];

export function History() {
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>("all");
  const { data, isLoading, error } = useGetHistory(selectedFilter);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 size-12 animate-spin rounded-full border-4 border-foreground-100/20 border-t-foreground-100" />
          <p className="text-foreground-100/70">Loading your history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load history</p>
          <p className="text-foreground-100/70 text-sm">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-3xl text-foreground-100">
          <Clock className="mr-2 mb-1 inline size-8" />
          Viewing History
        </h1>
        <p className="text-foreground-100/70">
          Track all the products you've viewed
        </p>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-foreground-100/70 text-sm">
          <Calendar className="size-4" />
          <span>Filter by:</span>
        </div>
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelectedFilter(option.value)}
            type="button"
            className={`rounded-lg px-4 py-2 font-medium text-sm transition-colors ${
              selectedFilter === option.value
                ? "bg-foreground-100 text-background-100"
                : "bg-background-200 text-foreground-100 hover:bg-foreground-100/10"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Total Count */}
      <div className="mb-4 text-foreground-100/70 text-sm">
        {total === 0
          ? "No items"
          : `${total} ${total === 1 ? "item" : "items"}`}{" "}
        found
      </div>

      {/* History Items */}
      {items.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-lg border-2 border-foreground-100/20 border-dashed bg-background-200">
          <div className="text-center">
            <Clock className="mx-auto mb-4 size-16 text-foreground-100/30" />
            <h3 className="mb-2 font-semibold text-foreground-100 text-xl">
              No History Yet
            </h3>
            <p className="text-foreground-100/70">
              Products you view will appear here
            </p>
          </div>
        </div>
      ) : (
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
                className={`group relative flex flex-col overflow-hidden rounded-lg border bg-background-100 transition-shadow hover:shadow-lg ${
                  item.is_available
                    ? "border-foreground-100/10"
                    : "border-gray-300 opacity-75"
                }`}
              >
                {/* Image Container */}
                <div className="relative aspect-square w-full overflow-hidden bg-background-200">
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
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="rounded bg-red-500 px-3 py-1 font-bold text-sm text-white shadow-lg">
                        UNAVAILABLE
                      </span>
                    </div>
                  )}
                  {item.is_available && item.discount_percent > 0 && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-red-500 px-2 py-1 font-bold text-white text-xs shadow-lg">
                      <TrendingDown className="size-3" />
                      {item.discount_percent}%
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-4">
                  {/* Store Name */}
                  <div className="mb-2 font-medium text-foreground-100/60 text-xs uppercase">
                    {item.store_name}
                  </div>

                  {/* Product Name */}
                  <h3 className="mb-3 line-clamp-2 font-semibold text-foreground-100 text-sm">
                    {item.product_name}
                  </h3>

                  {/* Price Info */}
                  <div className="mt-auto mb-3">
                    <div className="mb-1 flex items-baseline gap-2">
                      <span className="font-bold text-foreground-100 text-xl">
                        ₾{item.current_price.toFixed(2)}
                      </span>
                      {item.original_price > item.current_price && (
                        <span className="text-foreground-100/50 text-sm line-through">
                          ₾{item.original_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {discountAmount > 0 && (
                      <div className="text-green-600 text-xs">
                        Save ₾{discountAmount.toFixed(2)}
                      </div>
                    )}
                  </div>

                  {/* Viewed Date */}
                  <div className="flex items-center gap-1 border-foreground-100/10 border-t pt-3 text-foreground-100/60 text-xs">
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
      )}
    </div>
  );
}
