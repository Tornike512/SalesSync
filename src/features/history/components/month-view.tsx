"use client";

import type { HistoryItem } from "../hooks/use-get-history";
import {
  formatDateKey,
  getDatesForPeriod,
  groupByDate,
} from "../utils/date-grouping";
import { DropdownSection } from "./dropdown-section";
import { ProductGrid } from "./product-grid";

interface MonthViewProps {
  readonly items: readonly HistoryItem[];
  readonly onDeleteItem: (id: number) => void;
  readonly isDeletingItem: boolean;
}

/**
 * View for "This Month" period - shows a dropdown for each day up to today
 */
export function MonthView({
  items,
  onDeleteItem,
  isDeletingItem,
}: MonthViewProps) {
  const dates = getDatesForPeriod("month");
  const groupedItems = groupByDate(items);

  return (
    <div className="space-y-4">
      {dates.map((dateKey) => {
        const dayItems = groupedItems.get(dateKey) ?? [];
        const title = formatDateKey(dateKey);

        return (
          <DropdownSection
            key={dateKey}
            title={title}
            itemCount={dayItems.length}
            defaultOpen={dayItems.length > 0}
          >
            {dayItems.length > 0 ? (
              <ProductGrid
                items={dayItems}
                onDeleteItem={onDeleteItem}
                isDeletingItem={isDeletingItem}
              />
            ) : (
              <p className="text-center text-[var(--foreground-100)]/60 text-sm">
                No items viewed on this day
              </p>
            )}
          </DropdownSection>
        );
      })}
    </div>
  );
}
