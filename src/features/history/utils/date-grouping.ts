/**
 * Gets local date string in YYYY-MM-DD format
 */
function getLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Groups history items by date key
 */
export function groupByDate<T extends { readonly viewed_at: string }>(
  items: readonly T[],
): Map<string, readonly T[]> {
  const grouped = new Map<string, T[]>();

  for (const item of items) {
    const date = new Date(item.viewed_at);
    const dateKey = getLocalDateKey(date);

    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)?.push(item);
  }

  return grouped as Map<string, readonly T[]>;
}

/**
 * Groups history items by month
 */
export function groupByMonth<T extends { readonly viewed_at: string }>(
  items: readonly T[],
): Map<string, Map<string, readonly T[]>> {
  const grouped = new Map<string, Map<string, T[]>>();

  for (const item of items) {
    const date = new Date(item.viewed_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; // YYYY-MM
    const dateKey = getLocalDateKey(date);

    if (!grouped.has(monthKey)) {
      grouped.set(monthKey, new Map());
    }

    const monthGroup = grouped.get(monthKey);
    if (monthGroup && !monthGroup.has(dateKey)) {
      monthGroup.set(dateKey, []);
    }
    monthGroup?.get(dateKey)?.push(item);
  }

  return grouped as Map<string, Map<string, readonly T[]>>;
}

/**
 * Groups history items by year and month
 */
export function groupByYear<T extends { readonly viewed_at: string }>(
  items: readonly T[],
): Map<number, Map<string, Map<string, readonly T[]>>> {
  const grouped = new Map<number, Map<string, Map<string, T[]>>>();

  for (const item of items) {
    const date = new Date(item.viewed_at);
    const year = date.getFullYear();
    const monthKey = `${year}-${String(date.getMonth() + 1).padStart(2, "0")}`; // YYYY-MM
    const dateKey = getLocalDateKey(date);

    if (!grouped.has(year)) {
      grouped.set(year, new Map());
    }

    const yearGroup = grouped.get(year);
    if (yearGroup && !yearGroup.has(monthKey)) {
      yearGroup.set(monthKey, new Map());
    }

    const monthGroup = yearGroup?.get(monthKey);
    if (monthGroup && !monthGroup.has(dateKey)) {
      monthGroup.set(dateKey, []);
    }
    monthGroup?.get(dateKey)?.push(item);
  }

  return grouped as Map<number, Map<string, Map<string, readonly T[]>>>;
}

/**
 * Gets an array of dates for a period
 */
export function getDatesForPeriod(period: "week" | "month"): readonly string[] {
  const dates: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = period === "week" ? 7 : today.getDate();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(getLocalDateKey(date));
  }

  return dates;
}

/**
 * Formats a date key (YYYY-MM-DD) to a readable string
 */
export function formatDateKey(dateKey: string): string {
  const date = new Date(dateKey);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Formats a month key (YYYY-MM) to a readable string
 */
export function formatMonthKey(monthKey: string): string {
  const [year, month] = monthKey.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
}

/**
 * Formats a date key to show day of week
 */
export function formatDayOfWeek(dateKey: string): string {
  const date = new Date(dateKey);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayDate = new Date(dateKey);
  dayDate.setHours(0, 0, 0, 0);

  if (dayDate.getTime() === today.getTime()) {
    return "Today";
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dayDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

/**
 * Checks if a date is today
 */
export function isToday(dateKey: string): boolean {
  const date = new Date(dateKey);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
