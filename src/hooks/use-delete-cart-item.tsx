import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_KEY, API_URL } from "@/config";
import type { Cart } from "./use-get-cart";
import { useSession } from "./use-session";

type DeleteCartItemParams = {
  itemId: number;
  token: string;
};

async function deleteCartItem({
  itemId,
  token,
}: DeleteCartItemParams): Promise<Cart> {
  const response = await fetch(`${API_URL}/api/v1/cart/items/${itemId}`, {
    method: "DELETE",
    headers: {
      "X-API-Key": API_KEY || "",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete item from cart");
  }

  return response.json() as Promise<Cart>;
}

export function useDeleteCartItem() {
  const queryClient = useQueryClient();
  const { session } = useSession();

  return useMutation({
    mutationFn: (itemId: number) =>
      deleteCartItem({ itemId, token: session?.accessToken ?? "" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
