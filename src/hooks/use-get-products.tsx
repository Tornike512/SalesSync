import { useInfiniteQuery } from "@tanstack/react-query";
import { API_KEY, API_URL } from "@/config";

export type Product = {
  id: number;
  name: string;
  current_price: number;
  original_price: number;
  discount_percent: number;
  category: string;
  image_url: string;
  store_id: number;
  store_name: string;
  source_url: string;
  scraped_at: string;
};

export type ProductsResponse = {
  total: number;
  products: Product[];
};

export type SortOption =
  | "price_asc"
  | "price_desc"
  | "discount_percent_asc"
  | "discount_percent_desc"
  | "discount_amount_asc"
  | "discount_amount_desc";

export type GetProductsParams = {
  store_id?: number | null;
  store_name?: string | null;
  category?: string | null;
  subcategory?: string | null;
  min_discount?: number | null;
  sort?: SortOption | null;
  search?: string | null;
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
  if (params?.subcategory) searchParams.set("subcategory", params.subcategory);
  if (params?.min_discount != null)
    searchParams.set("min_discount", String(params.min_discount));
  if (params?.sort) searchParams.set("sort", params.sort);
  if (params?.search) searchParams.set("search", params.search);
  searchParams.set("limit", String(params?.limit ?? 16));
  searchParams.set("offset", String(params?.offset ?? 0));

  const url = `${API_URL}/api/v1/products?${searchParams.toString()}`;
  const response = await fetch(url, {
    headers: {
      "X-API-Key": API_KEY || "",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json() as Promise<ProductsResponse>;
}

export function useGetProducts(params?: Omit<GetProductsParams, "offset">) {
  const limit = params?.limit ?? 16;

  return useInfiniteQuery({
    queryKey: ["products", params],
    queryFn: ({ pageParam = 0 }) =>
      getProducts({ ...params, limit, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.length * limit;
      return totalFetched < lastPage.total ? totalFetched : undefined;
    },
  });
}
