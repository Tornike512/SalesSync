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
  { value: "day", label: "Last 24 Hours" },
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
      storeBreakdown,
    };
  }, [items]);

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-[var(--background-100)]">
        <div className="text-center">
          <p className="text-[var(--accent-coral)]">Failed to load history</p>
          <p className="text-[var(--foreground-200)] text-sm">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[var(--background-100)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start gap-4">
          <Link
            href="/"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[var(--foreground-200)] transition-all hover:bg-[var(--background-200)] hover:text-[var(--foreground-100)]"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="mb-1 font-bold font-display text-2xl text-[var(--foreground-100)] lg:text-3xl">
              Viewing History
            </h1>
            <p className="text-[var(--foreground-200)] text-sm">
              Track all the products you've viewed
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mb-6 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[var(--foreground-200)] text-sm">
            <Calendar className="size-4" />
            <span>Filter by:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedFilter(option.value)}
                type="button"
                className={`rounded-full px-4 py-2 font-medium text-sm transition-all ${
                  selectedFilter === option.value
                    ? "bg-[var(--accent-primary)] text-white shadow-sm"
                    : "bg-white text-[var(--foreground-200)] shadow-[var(--shadow-sm)] hover:bg-[var(--background-200)] hover:text-[var(--foreground-100)]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Total Count and Delete Button */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[var(--foreground-200)] text-sm">
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
              variant="danger"
              size="md"
              className="rounded-xl"
            >
              <Trash2 className="size-4" />
              {isDeleting ? "Deleting..." : "Clear All"}
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
                  <div className="mx-auto mb-4 size-10 animate-spin rounded-full border-3 border-[var(--background-300)] border-t-[var(--accent-primary)]" />
                  <p className="text-[var(--foreground-200)] text-sm">
                    Loading items...
                  </p>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-[var(--background-300)] border-dashed bg-white shadow-[var(--shadow-sm)]">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--background-200)]">
                    <Clock className="size-8 text-[var(--foreground-300)]" />
                  </div>
                  <h3 className="mb-1 font-semibold text-[var(--foreground-100)]">
                    No History Yet
                  </h3>
                  <p className="text-[var(--foreground-200)] text-sm">
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
                    total={total}
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
              <div className="sticky top-4 rounded-xl border border-[var(--background-300)] bg-white p-6 shadow-[var(--shadow-sm)]">
                <h2 className="mb-6 flex items-center gap-2 font-display font-semibold text-[var(--foreground-100)] text-lg">
                  <ShoppingBag className="size-5 text-[var(--accent-primary)]" />
                  Summary
                </h2>

                {/* Total Items */}
                <div className="mb-4 flex items-center justify-between border-[var(--background-300)] border-b pb-4">
                  <span className="text-[var(--foreground-200)] text-sm">
                    Total Items
                  </span>
                  <span className="font-semibold text-[var(--foreground-100)]">
                    {total}
                  </span>
                </div>

                {/* Original Price */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="size-4 text-[var(--foreground-300)]" />
                    <span className="text-[var(--foreground-200)] text-sm">
                      Original Total
                    </span>
                  </div>
                  <span className="text-[var(--foreground-300)] text-sm line-through">
                    ₾{summary.totalOriginal.toFixed(2)}
                  </span>
                </div>

                {/* Amount Spent */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="size-4 text-[var(--foreground-200)]" />
                    <span className="text-[var(--foreground-200)] text-sm">
                      Amount Spent
                    </span>
                  </div>
                  <span className="font-bold font-display text-[var(--foreground-100)] text-lg">
                    ₾{summary.totalSpent.toFixed(2)}
                  </span>
                </div>

                {/* Amount Saved */}
                <div className="mb-4 flex items-center justify-between border-[var(--background-300)] border-b pb-4">
                  <div className="flex items-center gap-2">
                    <PiggyBank className="size-5 text-[var(--accent-sage)]" />
                    <span className="font-medium text-[var(--foreground-100)] text-sm">
                      Total Saved
                    </span>
                  </div>
                  <span className="font-bold font-display text-[var(--accent-sage)] text-lg">
                    ₾{summary.totalSaved.toFixed(2)}
                  </span>
                </div>

                {/* Average Discount */}
                <div className="mb-4 flex items-center justify-between border-[var(--background-300)] border-b pb-4">
                  <span className="text-[var(--foreground-200)] text-sm">
                    Avg. Discount
                  </span>
                  <span className="rounded-full bg-[var(--accent-coral-soft)] px-2.5 py-0.5 font-semibold text-[var(--accent-coral)] text-sm">
                    {(data?.average_discount_percent ?? 0).toFixed(1)}%
                  </span>
                </div>

                {/* Store Breakdown */}
                <div>
                  <h3 className="mb-3 font-medium text-[var(--foreground-100)] text-sm">
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
                            <span className="text-[var(--foreground-200)]">
                              {displayName}
                            </span>
                            <span className="rounded-full bg-[var(--accent-primary-soft)] px-2 py-0.5 text-[var(--accent-primary)] text-xs">
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
    </div>
  );
}
