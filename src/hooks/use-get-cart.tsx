import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/config";

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

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

async function getCart(): Promise<Cart> {
  const token = getCookie("access_token");

  const response = await fetch(`${API_URL}/api/v1/cart`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch cart");
  }

  return response.json() as Promise<Cart>;
}

export function useGetCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });
}
