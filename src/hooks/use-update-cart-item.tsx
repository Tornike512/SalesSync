import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_KEY, API_URL } from "@/config";
import type { Cart } from "./use-get-cart";
import { useSession } from "./use-session";

type UpdateCartItemParams = {
  itemId: number;
  quantity: number;
  token: string;
};

async function updateCartItem({
  itemId,
  quantity,
  token,
}: UpdateCartItemParams): Promise<Cart> {
  const response = await fetch(`${API_URL}/api/v1/cart/items/${itemId}`, {
    method: "PUT",
    headers: {
      "X-API-Key": API_KEY || "",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) {
    throw new Error("Failed to update cart item");
  }

  return response.json() as Promise<Cart>;
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const { session } = useSession();

  return useMutation({
    mutationFn: (params: { itemId: number; quantity: number }) =>
      updateCartItem({ ...params, token: session?.accessToken ?? "" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
