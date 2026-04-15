import { API_URL } from "@/config";

type RequestConfig = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: Record<string, string>;
  token?: string | null;
};

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function request<T>(
  path: string,
  config: RequestConfig = {},
): Promise<T> {
  const { method = "GET", body, headers = {}, token } = config;

  const url = `${API_URL}${path}`;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (_e) {
      errorData = { message: response.statusText };
    }
    throw new ApiError(
      errorData.message || "API request failed",
      response.status,
      errorData,
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
