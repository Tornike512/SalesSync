import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_KEY, API_URL } from "@/config";
import { useSession } from "@/hooks/use-session";

async function deleteHistoryItem(
  token: string,
  historyId: number,
): Promise<void> {
  const response = await fetch(`${API_URL}/api/v1/history/${historyId}`, {
    method: "DELETE",
    headers: {
      "X-API-Key": API_KEY || "",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete history item");
  }
}

/**
 * Deletes a specific item from the viewing history.
 *
 * @returns Mutation for deleting a single history item by ID
 */
export function useDeleteHistoryItem() {
  const { session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (historyId: number) =>
      deleteHistoryItem(session?.accessToken ?? "", historyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}
