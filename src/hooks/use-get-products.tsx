import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/config";

export type Product = {
  id: number;
  name: string;
  current_price: number;
  original_price: number;
  discount_percent: number;
  category: string;
  image_url: string;
  store_id: number;
  source_url: string;
  scraped_at: string;
};

export type ProductsResponse = {
  total: number;
  products: Product[];
};

export type GetProductsParams = {
  store_id?: number | null;
  store_name?: string | null;
  category?: string | null;
  min_discount?: number | null;
  sort?: "price_asc" | "price_desc" | null;
  limit?: number;
  offset?: number;
};

async function getProducts(
  params?: GetProductsParams,
): Promise<ProductsResponse> {
  const searchParams = new URLSearchParams();

  if (params?.store_id != null)
    searchParams.set("store_id", String(params.store_id));
  if (params?.store_name) searchParams.set("store_name", params.store_name);
  if (params?.category) searchParams.set("category", params.category);
  if (params?.min_discount != null)
    searchParams.set("min_discount", String(params.min_discount));
  if (params?.sort) searchParams.set("sort", params.sort);
  searchParams.set("limit", String(params?.limit ?? 16));
  searchParams.set("offset", String(params?.offset ?? 0));

  const url = `${API_URL}/api/v1/products?${searchParams.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json() as Promise<ProductsResponse>;
}

export function useGetProducts(params?: GetProductsParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });
}
