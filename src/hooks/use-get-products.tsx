import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

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
  return api.get<ProductsResponse>("/api/v1/products", {
    params: {
      store_id: params?.store_id,
      store_name: params?.store_name,
      category: params?.category,
      min_discount: params?.min_discount,
      sort: params?.sort,
      limit: params?.limit ?? 16,
      offset: params?.offset ?? 0,
    },
  });
}

export function useGetProducts(params?: GetProductsParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });
}
