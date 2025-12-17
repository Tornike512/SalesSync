import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/config";
import type { Cart } from "./use-get-cart";

type AddCartItemParams = {
  product_id: number;
  quantity: number;
};

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

async function addCartItem(params: AddCartItemParams): Promise<Cart> {
  const token = getCookie("access_token");

  const response = await fetch(`${API_URL}/api/v1/cart/items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error("Failed to add item to cart");
  }

  return response.json() as Promise<Cart>;
}

export function useAddCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
