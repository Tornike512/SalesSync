import { useQuery } from "@tanstack/react-query";
import { API_KEY, API_URL } from "@/config";

export type CategoryHierarchy = Record<string, string[]>;

async function getCategoriesHierarchy(): Promise<CategoryHierarchy> {
  const url = `${API_URL}/api/v1/products/categories/hierarchy`;
  const response = await fetch(url, {
    headers: {
      "X-API-Key": API_KEY || "",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch categories hierarchy");
  }

  const data = (await response.json()) as CategoryHierarchy;
  // Sort the top-level categories alphabetically
  const sorted: CategoryHierarchy = {};
  Object.keys(data)
    .sort((a, b) => a.localeCompare(b))
    .forEach((key) => {
      sorted[key] = data[key];
    });
  return sorted;
}

export function useGetCategories() {
  return useQuery({
    queryKey: ["categories-hierarchy"],
    queryFn: getCategoriesHierarchy,
  });
}
