"use client";

import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  PiggyBank,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/button";
import { useDeleteHistory } from "../hooks/use-delete-history";
import { useDeleteHistoryItem } from "../hooks/use-delete-history-item";
import type { TimeFilter } from "../hooks/use-get-history";
import { useGetHistory } from "../hooks/use-get-history";
import { DeleteHistoryModal } from "./delete-history-modal";
import { MonthView } from "./month-view";
import { TodayView } from "./today-view";
import { WeekView } from "./week-view";
import { YearView } from "./year-view";

const filterOptions: { value: TimeFilter; label: string }[] = [
  { value: "day", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
  { value: "all", label: "All Time" },
];

export function History() {
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>("all");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
        className="absolute top-6 left-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--color-dark-green)] bg-white text-[var(--color-dark-green)] transition-all hover:bg-[var(--color-cream)] active:scale-95"
      >
        <ArrowLeft size={20} />
      </Link>

      {/* Header */}
      <div className="mb-8 pt-12">
        <h1 className="mb-2 font-bold text-3xl text-[var(--foreground-100)]">
          <Clock className="mr-2 mb-1 inline size-8 text-[var(--color-yellow)]" />
          <span className="whitespace-nowrap"> Viewing History</span>
        </h1>
        <p className="text-[var(--foreground-100)]/70">
          Track all the products you've viewed
        </p>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[var(--foreground-100)]/70 text-sm sm:mb-0">
          <Calendar className="size-4" />
          <span>Filter by:</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedFilter(option.value)}
              type="button"
              className={`rounded-lg px-4 py-2 font-medium text-sm transition-colors ${
                selectedFilter === option.value
                  ? "bg-[var(--color-yellow)] text-[var(--foreground-100)]"
                  : "bg-white text-[var(--foreground-100)] shadow-sm hover:bg-[var(--color-yellow)]/30"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
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
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isDeleting}
            className="flex items-center gap-2 rounded-lg bg-[var(--color-orange)] px-4 py-2 font-medium text-[var(--color-cream)] text-sm transition-colors hover:bg-[var(--color-orange)]/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="size-4" />
            {isDeleting ? "Deleting..." : "Clear All History"}
          </Button>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteHistoryModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteHistory()}
        isDeleting={isDeleting}
      />

      {/* Main Content with Sidebar */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* History Items */}
        <div className="flex-1">
          {isLoading || !data ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 size-12 animate-spin rounded-full border-4 border-[var(--color-yellow)]/30 border-t-[var(--color-yellow)]" />
                <p className="text-[var(--foreground-100)]/70">
                  Loading items...
                </p>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-lg border-2 border-[var(--foreground-100)]/20 border-dashed bg-white shadow-md">
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
            <>
              {selectedFilter === "day" && (
                <TodayView
                  items={items}
                  onDeleteItem={deleteHistoryItem}
                  isDeletingItem={isDeletingItem}
                />
              )}
              {selectedFilter === "week" && (
                <WeekView
                  items={items}
                  onDeleteItem={deleteHistoryItem}
                  isDeletingItem={isDeletingItem}
                />
              )}
              {selectedFilter === "month" && (
                <MonthView
                  items={items}
                  onDeleteItem={deleteHistoryItem}
                  isDeletingItem={isDeletingItem}
                />
              )}
              {(selectedFilter === "year" || selectedFilter === "all") && (
                <YearView
                  items={items}
                  onDeleteItem={deleteHistoryItem}
                  isDeletingItem={isDeletingItem}
                />
              )}
            </>
          )}
        </div>

        {/* Summary Sidebar */}
        {items.length > 0 && (
          <div className="w-full shrink-0 lg:w-80">
            <div className="sticky top-4 rounded-lg border-2 border-[var(--color-yellow)]/30 bg-white p-6 shadow-lg">
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
              <div className="mb-6 flex items-center justify-between">
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
                    .map(([store, count]) => {
                      const displayName =
                        store.split(" ").slice(0, -1).join(" ") || store;
                      return (
                        <div
                          key={store}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-[var(--foreground-100)]/70">
                            {displayName}
                          </span>
                          <span className="rounded-full bg-[var(--color-yellow)]/30 px-2 py-0.5 text-[var(--foreground-100)] text-xs">
                            {count} {count === 1 ? "item" : "items"}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
