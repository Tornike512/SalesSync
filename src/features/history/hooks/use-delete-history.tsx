import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_KEY, API_URL } from "@/config";
import { useSession } from "@/hooks/use-session";

async function deleteHistory(token: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/v1/history`, {
    method: "DELETE",
    headers: {
      "X-API-Key": API_KEY || "",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete history");
  }
}

/**
 * Deletes the entire viewing history for the current user.
 *
 * @returns Mutation for deleting all history items
 */
export function useDeleteHistory() {
  const { session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteHistory(session?.accessToken ?? ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}
