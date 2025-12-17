import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_KEY, API_URL } from "@/config";
import type { Cart } from "./use-get-cart";
import { useSession } from "./use-session";

async function deleteCart(token: string): Promise<Cart> {
  const response = await fetch(`${API_URL}/api/v1/cart`, {
    method: "DELETE",
    headers: {
      "X-API-Key": API_KEY || "",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete cart");
  }

  return response.json() as Promise<Cart>;
}

export function useDeleteCart() {
  const queryClient = useQueryClient();
  const { session } = useSession();

  return useMutation({
    mutationFn: () => deleteCart(session?.accessToken ?? ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
