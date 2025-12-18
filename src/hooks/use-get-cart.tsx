import { useQuery } from "@tanstack/react-query";
import { API_KEY, API_URL } from "@/config";
import { useSession } from "./use-session";

export type CartItem = {
  id: number;
  product_id: number;
  product_name: string;
  product_image_url: string;
  current_price: number;
  original_price: number;
  discount_percent: number;
  store_name: string;
  quantity: number;
  subtotal: number;
  added_at: string;
  is_available: boolean;
};

export type Cart = {
  id: number;
  items: CartItem[];
  total_items: number;
  total_price: number;
  total_savings: number;
  created_at: string;
  updated_at: string;
};

async function getCart(token: string): Promise<Cart> {
  const response = await fetch(`${API_URL}/api/v1/cart`, {
    headers: {
      "X-API-Key": API_KEY || "",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch cart");
  }

  return response.json() as Promise<Cart>;
}

export function useGetCart() {
  const { session, status } = useSession();

  return useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(session?.accessToken ?? ""),
    enabled: status === "authenticated",
  });
}
