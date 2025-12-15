import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/config";

async function getCategories(): Promise<string[]> {
  const url = `${API_URL}/api/v1/products/categories`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json() as Promise<string[]>;
}

export function useGetCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
}
