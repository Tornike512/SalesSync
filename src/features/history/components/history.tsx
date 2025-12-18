"use client";

import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  PiggyBank,
  ShoppingBag,
  Trash2,
  TrendingDown,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/button";
import { useDeleteHistory } from "../hooks/use-delete-history";
import { useDeleteHistoryItem } from "../hooks/use-delete-history-item";
import type { TimeFilter } from "../hooks/use-get-history";
import { useGetHistory } from "../hooks/use-get-history";

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
  const { mutate: deleteHistory, isPending: isDeleting } = useDeleteHistory();
  const { mutate: deleteHistoryItem, isPending: isDeletingItem } =
    useDeleteHistoryItem();

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  const summary = useMemo(() => {
    const totalSpent = items.reduce(
      (acc, item) => acc + item.current_price * item.quantity,
      0,
    );
    const totalOriginal = items.reduce(
      (acc, item) => acc + item.original_price * item.quantity,
      0,
    );
    const totalSaved = totalOriginal - totalSpent;
    const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
    const avgDiscount =
      items.length > 0
        ? items.reduce((acc, item) => acc + item.discount_percent, 0) /
          items.length
        : 0;
    const storeBreakdown = items.reduce(
      (acc, item) => {
        acc[item.store_name] = (acc[item.store_name] || 0) + item.quantity;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalSpent,
      totalOriginal,
      totalSaved,
      totalQuantity,
      avgDiscount,
      storeBreakdown,
    };
  }, [items]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-[var(--color-cream)]">
        <div className="text-center">
          <div className="mx-auto mb-4 size-12 animate-spin rounded-full border-4 border-[var(--color-yellow)]/30 border-t-[var(--color-yellow)]" />
          <p className="text-[var(--foreground-100)]/70">
            Loading your history...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-[var(--color-cream)]">
        <div className="text-center">
          <p className="text-[var(--color-orange)]">Failed to load history</p>
          <p className="text-[var(--foreground-100)]/70 text-sm">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-7xl bg-[var(--color-cream)] px-4 py-8">
      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-6 left-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--foreground-100)] bg-[var(--color-cream)] text-[var(--foreground-100)] transition-all hover:bg-[var(--color-yellow)]/20 active:scale-95"
      >
        <ArrowLeft size={20} />
      </Link>

      {/* Header */}
      <div className="mb-8 pt-12">
        <h1 className="mb-2 font-bold text-3xl text-[var(--foreground-100)]">
          <Clock className="mr-2 mb-1 inline size-8 text-[var(--color-yellow)]" />
          Viewing History
        </h1>
        <p className="text-[var(--foreground-100)]/70">
          Track all the products you've viewed
        </p>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-[var(--foreground-100)]/70 text-sm">
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
                ? "bg-[var(--color-yellow)] text-[var(--foreground-100)]"
                : "bg-[var(--color-sage)] text-[var(--foreground-100)] hover:bg-[var(--color-yellow)]/30"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Total Count and Delete Button */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[var(--foreground-100)]/70 text-sm">
          {total === 0
            ? "No items"
            : `${total} ${total === 1 ? "item" : "items"}`}{" "}
          found
        </div>
        {total > 0 && (
          <Button
            type="button"
            onClick={() => deleteHistory()}
            disabled={isDeleting}
            className="flex items-center gap-2 rounded-lg bg-[var(--color-orange)] px-4 py-2 font-medium text-[var(--color-cream)] text-sm transition-colors hover:bg-[var(--color-orange)]/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="size-4" />
            {isDeleting ? "Deleting..." : "Clear All History"}
          </Button>
        )}
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* History Items */}
        <div className="flex-1">
          {items.length === 0 ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-lg border-2 border-[var(--foreground-100)]/20 border-dashed bg-[var(--color-sage)]">
              <div className="text-center">
                <Clock className="mx-auto mb-4 size-16 text-[var(--foreground-100)]/30" />
                <h3 className="mb-2 font-semibold text-[var(--foreground-100)] text-xl">
                  No History Yet
                </h3>
                <p className="text-[var(--foreground-100)]/70">
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
                    className={`group relative flex flex-col overflow-hidden rounded-lg border-2 bg-[var(--color-cream)] transition-shadow hover:shadow-lg ${
                      item.is_available
                        ? "border-[var(--color-yellow)]/30"
                        : "border-gray-300 opacity-75"
                    }`}
                  >
                    {/* Image Container */}
                    <div className="relative aspect-square w-full overflow-hidden bg-[var(--color-sage)]">
                      {/* Delete Item Button */}
                      <Button
                        type="button"
                        onClick={() => deleteHistoryItem(item.id)}
                        disabled={isDeletingItem}
                        className="absolute top-2 left-2 z-10 flex size-8 items-center justify-center rounded-full bg-[var(--foreground-100)]/50 text-[var(--color-cream)] opacity-0 transition-opacity hover:bg-[var(--color-orange)] disabled:cursor-not-allowed disabled:opacity-50 group-hover:opacity-100"
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
                      <div className="mb-2 font-medium text-[var(--foreground-100)]/60 text-xs uppercase">
                        {item.store_name}
                      </div>

                      {/* Product Name */}
                      <h3 className="mb-3 line-clamp-2 font-semibold text-[var(--foreground-100)] text-sm">
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
                          <div className="text-[var(--foreground-100)]/70 text-xs">
                            Qty: {item.quantity} (Total: ₾
                            {(item.current_price * item.quantity).toFixed(2)})
                          </div>
                        )}
                        {discountAmount > 0 && (
                          <div className="text-[var(--foreground-100)] text-xs">
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
          )}
        </div>

        {/* Summary Sidebar */}
        {items.length > 0 && (
          <div className="w-full shrink-0 lg:w-80">
            <div className="sticky top-4 rounded-lg border-2 border-[var(--color-yellow)]/30 bg-[var(--color-cream)] p-6 shadow-sm">
              <h2 className="mb-6 font-bold text-[var(--foreground-100)] text-xl">
                <ShoppingBag className="mr-2 mb-1 inline size-5 text-[var(--color-yellow)]" />
                Summary
              </h2>

              {/* Total Items */}
              <div className="mb-4 flex items-center justify-between border-[var(--color-yellow)]/30 border-b pb-4">
                <span className="text-[var(--foreground-100)]/70">
                  Total Items
                </span>
                <span className="font-semibold text-[var(--foreground-100)]">
                  {summary.totalQuantity}
                </span>
              </div>

              {/* Original Price */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="size-4 text-[var(--foreground-100)]/50" />
                  <span className="text-[var(--foreground-100)]/70">
                    Original Total
                  </span>
                </div>
                <span className="text-[var(--foreground-100)]/50 line-through">
                  ₾{summary.totalOriginal.toFixed(2)}
                </span>
              </div>

              {/* Amount Spent */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="size-4 text-[var(--foreground-100)]/70" />
                  <span className="text-[var(--foreground-100)]/70">
                    Amount Spent
                  </span>
                </div>
                <span className="font-bold text-[var(--foreground-100)] text-lg">
                  ₾{summary.totalSpent.toFixed(2)}
                </span>
              </div>

              {/* Amount Saved */}
              <div className="mb-6 flex items-center justify-between rounded-lg bg-[var(--color-sage)] p-3">
                <div className="flex items-center gap-2">
                  <PiggyBank className="size-5 text-[var(--foreground-100)]" />
                  <span className="font-medium text-[var(--foreground-100)]">
                    Total Saved
                  </span>
                </div>
                <span className="font-bold text-[var(--foreground-100)] text-xl">
                  ₾{summary.totalSaved.toFixed(2)}
                </span>
              </div>

              {/* Average Discount */}
              <div className="mb-6 flex items-center justify-between border-[var(--color-yellow)]/30 border-b pb-4">
                <span className="text-[var(--foreground-100)]/70">
                  Avg. Discount
                </span>
                <span className="font-semibold text-[var(--color-orange)]">
                  {summary.avgDiscount.toFixed(1)}%
                </span>
              </div>

              {/* Store Breakdown */}
              <div>
                <h3 className="mb-3 font-semibold text-[var(--foreground-100)] text-sm">
                  By Store
                </h3>
                <div className="space-y-2">
                  {Object.entries(summary.storeBreakdown)
                    .sort(([, a], [, b]) => b - a)
                    .map(([store, count]) => (
                      <div
                        key={store}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-[var(--foreground-100)]/70">
                          {store}
                        </span>
                        <span className="rounded-full bg-[var(--color-yellow)]/30 px-2 py-0.5 text-[var(--foreground-100)] text-xs">
                          {count} {count === 1 ? "item" : "items"}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
