import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_KEY, API_URL } from "@/config";
import { useSession } from "@/hooks/use-session";
import type { HistoryResponse } from "./use-get-history";

export interface AddHistoryItem {
  readonly product_id: number;
  readonly quantity: number;
}

async function addToHistory(
  token: string,
  items: readonly AddHistoryItem[],
): Promise<HistoryResponse> {
  const response = await fetch(`${API_URL}/api/v1/history`, {
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
