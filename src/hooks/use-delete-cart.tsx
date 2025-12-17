import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/config";
import type { Cart } from "./use-get-cart";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

async function deleteCart(): Promise<Cart> {
  const token = getCookie("access_token");

  const response = await fetch(`${API_URL}/api/v1/cart`, {
    method: "DELETE",
    headers: {
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

  return useMutation({
    mutationFn: deleteCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
