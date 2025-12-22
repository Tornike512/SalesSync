"use client";

import type { HistoryItem } from "../hooks/use-get-history";
import {
  formatDateKey,
  formatMonthKey,
  groupByYear,
} from "../utils/date-grouping";
import { DropdownSection } from "./dropdown-section";
import { ProductGrid } from "./product-grid";

interface YearViewProps {
  readonly items: readonly HistoryItem[];
  readonly total: number;
  readonly onDeleteItem: (id: number) => void;
  readonly isDeletingItem: boolean;
}

/**
 * View for "This Year" and "All Time" periods - shows nested dropdowns
 * First level: Months, Second level: Days
 */
export function YearView({
  items,
  total,
  onDeleteItem,
  isDeletingItem,
}: YearViewProps) {
  const groupedByYear = groupByYear(items);
  const years = Array.from(groupedByYear.keys()).sort((a, b) => b - a);

  return (
    <div className="space-y-6">
      {years.map((year) => {
        const yearData = groupedByYear.get(year);
        if (!yearData) return null;

        const months = Array.from(yearData.keys()).sort((a, b) =>
          b.localeCompare(a),
        );
        const yearItemCount = months.reduce((acc, monthKey) => {
          const monthData = yearData.get(monthKey);
          if (!monthData) return acc;
          const days = Array.from(monthData.values());
          return acc + days.reduce((sum, dayItems) => sum + dayItems.length, 0);
        }, 0);

        return (
          <div key={year} className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="font-bold text-2xl text-[var(--foreground-100)]">
                {year}
              </h2>
              <span className="rounded-full bg-[var(--color-yellow)]/30 px-3 py-1 text-[var(--foreground-100)] text-sm">
                {yearItemCount} {yearItemCount === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="space-y-4">
              {months.map((monthKey) => {
                const monthData = yearData.get(monthKey);
                if (!monthData) return null;

                const days = Array.from(monthData.keys()).sort((a, b) =>
                  b.localeCompare(a),
                );
                const monthItemCount = days.reduce((acc, dateKey) => {
                  return acc + (monthData.get(dateKey)?.length ?? 0);
                }, 0);

                return (
                  <DropdownSection
                    key={monthKey}
                    title={formatMonthKey(monthKey)}
                    itemCount={monthItemCount}
                    defaultOpen={false}
                    level={1}
                  >
                    <div className="space-y-3">
                      {days.map((dateKey) => {
                        const dayItems = monthData.get(dateKey) ?? [];

                        return (
                          <DropdownSection
                            key={dateKey}
                            title={formatDateKey(dateKey)}
                            itemCount={dayItems.length}
                            defaultOpen={false}
                            level={2}
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
                  </DropdownSection>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
