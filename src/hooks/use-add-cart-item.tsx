import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/config";
import type { Cart } from "./use-get-cart";
import { useSession } from "./use-session";

type AddCartItemParams = {
  product_id: number;
  quantity: number;
  token: string;
};

async function addCartItem({
  token,
  ...params
}: AddCartItemParams): Promise<Cart> {
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
  const { session } = useSession();

  return useMutation({
    mutationFn: (params: Omit<AddCartItemParams, "token">) =>
      addCartItem({ ...params, token: session?.accessToken ?? "" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
