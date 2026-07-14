import { auth } from "./auth"

function isServer(): boolean {
  return typeof window === "undefined"
}

async function getAuthToken(): Promise<string | null> {
  if (!isServer()) return null
  try {
    const session = await auth()
    return session?.user?.id ?? null
  } catch {
    return null
  }
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(
  url: string,
  method: string,
  body?: unknown,
  options?: { headers?: Record<string, string>; cache?: RequestCache; next?: NextFetchRequestConfig }
): Promise<T> {
  const token = await getAuthToken()

  const headers: Record<string, string> = {
    ...(body && !(body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
    ...options?.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    cache: options?.cache,
    next: options?.next,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An error occurred" }))
    throw new ApiError(error.message || "An error occurred", response.status)
  }

  return response.json() as Promise<T>
}

export const api = {
  get<T>(url: string, options?: { headers?: Record<string, string>; cache?: RequestCache; next?: NextFetchRequestConfig }): Promise<T> {
    return request<T>(url, "GET", undefined, options)
  },
  post<T>(url: string, body?: unknown, options?: { headers?: Record<string, string>; cache?: RequestCache; next?: NextFetchRequestConfig }): Promise<T> {
    return request<T>(url, "POST", body, options)
  },
  put<T>(url: string, body?: unknown, options?: { headers?: Record<string, string>; cache?: RequestCache; next?: NextFetchRequestConfig }): Promise<T> {
    return request<T>(url, "PUT", body, options)
  },
  patch<T>(url: string, body?: unknown, options?: { headers?: Record<string, string>; cache?: RequestCache; next?: NextFetchRequestConfig }): Promise<T> {
    return request<T>(url, "PATCH", body, options)
  },
  delete<T>(url: string, options?: { headers?: Record<string, string>; cache?: RequestCache; next?: NextFetchRequestConfig }): Promise<T> {
    return request<T>(url, "DELETE", undefined, options)
  },
}

export async function fetcher<T>(url: string): Promise<T> {
  return api.get<T>(url)
}
