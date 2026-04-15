import { API_URL } from "@/config";

export type RequestConfig = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  headers?: Record<string, string>;
  token?: string | null;
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function parseJsonResponse(response: Response): Promise<unknown | null> {
  const rawBody = await response.text();
  if (!rawBody) {
    return null;
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    return null;
  }
}

export async function request<T>(
  path: string,
  config: RequestConfig = {},
): Promise<T> {
  const { method = "GET", body, headers = {}, token } = config;

  const url = `${API_URL}${path}`;
  const requestHeaders: Record<string, string> = { ...headers };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined && !requestHeaders["Content-Type"]) {
    requestHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await parseJsonResponse(response);
    const message =
      typeof errorData === "object" &&
      errorData !== null &&
      "message" in errorData &&
      typeof errorData.message === "string"
        ? errorData.message
        : response.statusText || "API request failed";

    throw new ApiError(message, response.status, errorData);
  }

  if (response.status === 204) {
    return {} as T;
  }

  const parsed = await parseJsonResponse(response);
  if (parsed === null) {
    return {} as T;
  }

  return parsed as T;
}
