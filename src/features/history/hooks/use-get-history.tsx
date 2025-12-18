import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_KEY, API_URL } from "@/config";
import { useSession } from "@/hooks/use-session";

export interface HistoryItem {
  readonly id: number;
  readonly product_id: number;
  readonly product_name: string;
  readonly product_image_url: string;
  readonly current_price: number;
  readonly original_price: number;
  readonly discount_percent: number;
  readonly store_name: string;
  readonly viewed_at: string;
  readonly is_available: boolean;
  readonly quantity: number;
}

export interface HistoryResponse {
  readonly total: number;
  readonly items: readonly HistoryItem[];
}

export interface AddHistoryItem {
  readonly product_id: number;
  readonly quantity: number;
}

export type TimeFilter = "day" | "week" | "month" | "year" | "all";

async function getHistory(
  token: string,
  filter: TimeFilter,
): Promise<HistoryResponse> {
  const response = await fetch(
    `${API_URL}/api/v1/auth/history?filter=${filter}`,
    {
      headers: {
        "X-API-Key": API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch history");
  }

  return response.json() as Promise<HistoryResponse>;
}

/**
 * Fetches the current user's product view history.
 *
 * @param filter - Time filter for history:
 *   - `day`: Products viewed in the last 24 hours
 *   - `week`: Products viewed in the last 7 days
 *   - `month`: Products viewed in the last 30 days
 *   - `year`: Products viewed in the last 365 days
 *   - `all`: All viewed products (default)
 *
 * @returns Query result with history items ordered by most recent first
 */
export function useGetHistory(filter: TimeFilter = "all") {
  const { session, status } = useSession();

  return useQuery({
    queryKey: ["history", filter],
    queryFn: () => getHistory(session?.accessToken ?? "", filter),
    enabled: status === "authenticated",
  });
}

async function addToHistory(
  token: string,
  items: readonly AddHistoryItem[],
): Promise<HistoryResponse> {
  const response = await fetch(`${API_URL}/api/v1/auth/history`, {
    method: "POST",
    headers: {
      "X-API-Key": API_KEY || "",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items }),
  });

  if (!response.ok) {
    throw new Error("Failed to add to history");
  }

  return response.json() as Promise<HistoryResponse>;
}

/**
 * Adds products to the current user's view history.
 *
 * @returns Mutation for adding product IDs to history
 */
export function useAddHistory() {
  const { session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: readonly AddHistoryItem[]) =>
      addToHistory(session?.accessToken ?? "", items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}

async function deleteHistory(token: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/v1/auth/history`, {
    method: "DELETE",
    headers: {
      "X-API-Key": API_KEY || "",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete history");
  }
}

/**
 * Deletes the entire viewing history for the current user.
 *
 * @returns Mutation for deleting all history items
 */
export function useDeleteHistory() {
  const { session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteHistory(session?.accessToken ?? ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}

async function deleteHistoryItem(
  token: string,
  historyId: number,
): Promise<void> {
  const response = await fetch(`${API_URL}/api/v1/auth/history/${historyId}`, {
    method: "DELETE",
    headers: {
      "X-API-Key": API_KEY || "",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete history item");
  }
}

/**
 * Deletes a specific item from the viewing history.
 *
 * @returns Mutation for deleting a single history item by ID
 */
export function useDeleteHistoryItem() {
  const { session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (historyId: number) =>
      deleteHistoryItem(session?.accessToken ?? "", historyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}
