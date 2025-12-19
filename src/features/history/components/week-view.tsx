"use client";

import type { HistoryItem } from "../hooks/use-get-history";
import {
  formatDayOfWeek,
  getDatesForPeriod,
  groupByDate,
} from "../utils/date-grouping";
import { DropdownSection } from "./dropdown-section";
import { ProductGrid } from "./product-grid";

interface WeekViewProps {
  readonly items: readonly HistoryItem[];
  readonly onDeleteItem: (id: number) => void;
  readonly isDeletingItem: boolean;
}

/**
 * View for "This Week" period - shows 7 dropdowns (one per day)
 */
export function WeekView({
  items,
  onDeleteItem,
  isDeletingItem,
}: WeekViewProps) {
  const dates = getDatesForPeriod("week");
  const groupedItems = groupByDate(items);

  return (
    <div className="space-y-4">
      {dates.map((dateKey) => {
        const dayItems = groupedItems.get(dateKey) ?? [];
        const title = formatDayOfWeek(dateKey);

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
