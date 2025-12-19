"use client";

import type { HistoryItem } from "../hooks/use-get-history";
import { ProductGrid } from "./product-grid";

interface TodayViewProps {
  readonly items: readonly HistoryItem[];
  readonly onDeleteItem: (id: number) => void;
  readonly isDeletingItem: boolean;
}

/**
 * View for "Today" period - shows products directly without dropdowns
 */
export function TodayView({
  items,
  onDeleteItem,
  isDeletingItem,
}: TodayViewProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border-2 border-[var(--color-yellow)]/30 bg-white p-4 shadow-md">
        <h3 className="mb-4 font-semibold text-[var(--foreground-100)] text-lg">
          Today&apos;s Purchases
        </h3>
        <ProductGrid
          items={items}
          onDeleteItem={onDeleteItem}
          isDeletingItem={isDeletingItem}
        />
      </div>
    </div>
  );
}
