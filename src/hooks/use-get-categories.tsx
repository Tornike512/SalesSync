import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/config";

export type CategoryHierarchy = Record<string, string[]>;

async function getCategoriesHierarchy(): Promise<CategoryHierarchy> {
  const url = `${API_URL}/api/v1/products/categories/hierarchy`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch categories hierarchy");
  }

  return response.json() as Promise<CategoryHierarchy>;
}

export function useGetCategories() {
  return useQuery({
    queryKey: ["categories-hierarchy"],
    queryFn: getCategoriesHierarchy,
  });
}
