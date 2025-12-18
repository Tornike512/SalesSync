import { useQuery } from "@tanstack/react-query";
import { API_KEY, API_URL } from "@/config";
import { useSession } from "./use-session";

export type HistoryItem = {
  id: number;
  product_id: number;
  product_name: string;
  product_image_url: string;
  current_price: number;
  original_price: number;
  discount_percent: number;
  store_name: string;
  viewed_at: string;
  is_available: boolean;
};

export type HistoryResponse = {
  total: number;
  items: HistoryItem[];
};

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
