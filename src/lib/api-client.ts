/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import { API_KEY, API_URL } from "@/config";
import { logger } from "@/utils/logger";

type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  cookie?: string;
  params?: Record<string, string | number | boolean | undefined | null>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function buildUrlWithParams(
  url: string,
  params?: RequestOptions["params"],
): string {
  if (!params) return url;
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null,
    ),
  );
  if (Object.keys(filteredParams).length === 0) return url;
  const queryString = new URLSearchParams(
    filteredParams as Record<string, string>,
  ).toString();
  return `${url}?${queryString}`;
}

// Create a separate function for getting server-side cookies that can be imported where needed
export function getServerCookies() {
  if (typeof window !== "undefined") return "";

  // Dynamic import next/headers only on server-side
  return import("next/headers").then(async ({ cookies }) => {
    try {
      const cookieStore = await cookies();
      return cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");
    } catch (error) {
      logger.error("Failed to get server cookies:", error);
      return "";
    }
  });
}

async function fetchApi<T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    headers = {},
    body,
    cookie,
    params,
    cache = "no-store",
    next,
  } = options;

  // Get cookies from the request when running on server
  let cookieHeader = cookie;
  if (typeof window === "undefined" && !cookie) {
    cookieHeader = await getServerCookies();
  }

  const fullUrl = buildUrlWithParams(`${API_URL}${url}`, params);

  // Build headers with API key authentication
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...headers,
  };

  // Add API key header if available (only available server-side for security)
  if (API_KEY) {
    requestHeaders["X-API-Key"] = API_KEY;
  }

  // Add cookies if available
  if (cookieHeader) {
    requestHeaders.Cookie = cookieHeader;
  }

  try {
    const response = await fetch(fullUrl, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
      cache,
      next,
    });

    // Handle authentication errors
    if (response.status === 403) {
      logger.error("Authentication failed: Invalid or missing API key");
      throw new ApiError(
        "Authentication failed. Please check your API key configuration.",
        403,
      );
    }

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      logger.warn(
        `Rate limit exceeded. Retry after: ${retryAfter || "unknown"}`,
      );
      throw new ApiError(
        `Too many requests. Please try again ${retryAfter ? `in ${retryAfter} seconds` : "later"}.`,
        429,
        { retryAfter },
      );
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message =
        typeof errorData === "object" &&
        errorData !== null &&
        "message" in errorData &&
        typeof (errorData as { message?: unknown }).message === "string"
          ? (errorData as { message: string }).message
          : response.statusText;

      logger.error(`API Error (${response.status}):`, message);
      throw new ApiError(message, response.status, errorData);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    // Re-throw ApiError as is
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      logger.error("Network error:", error);
      throw new ApiError(
        "Network error. Please check your internet connection.",
        0,
      );
    }

    // Handle other errors
    logger.error("Unexpected API error:", error);
    throw error;
  }
}

export const api = {
  get<T>(url: string, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: "GET" });
  },
  post<T>(url: string, body?: any, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: "POST", body });
  },
  put<T>(url: string, body?: any, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: "PUT", body });
  },
  patch<T>(url: string, body?: any, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: "PATCH", body });
  },
  delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: "DELETE" });
  },
};
