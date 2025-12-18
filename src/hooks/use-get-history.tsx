import { useQuery } from "@tanstack/react-query";
import { API_KEY, API_URL } from "@/config";
import { useSession } from "./use-session";

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

export type TimeFilter = "day" | "week" | "month" | "year" | "all";

async function getHistory(
  token: string,
  filter: TimeFilter,
): Promise<HistoryResponse> {
  const response = await fetch(`${API_URL}/api/v1/history?filter=${filter}`, {
    headers: {
      "X-API-Key": API_KEY || "",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch history");
  }

  return response.json() as Promise<HistoryResponse>;
}

export function useGetHistory(filter: TimeFilter = "all") {
  const { session, status } = useSession();

  return useQuery({
    queryKey: ["history", filter],
    queryFn: () => getHistory(session?.accessToken ?? "", filter),
    enabled: status === "authenticated",
  });
}
