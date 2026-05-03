import { ApiResponse } from "@/types";

export class FetchError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "FetchError";
    this.status = status;
    this.data = data;
  }
}

export async function fetcher<T = unknown>(
  url: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(!(options?.body instanceof FormData) && {
        "Content-Type": "application/json",
      }),
      ...options?.headers,
    },
  });

  const data = (await res.json().catch(() => ({}))) as ApiResponse<T>;

  if (!res.ok || data.success === false) {
    throw new FetchError(
      data.error || `Error ${res.status}: ${res.statusText}`,
      res.status,
      data,
    );
  }

  return data;
}
