const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  headers?: Record<string, string>;
  cache?: RequestCache;
  tags?: string[];
  server?: boolean;
};

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, cache, tags, server } = options;

  const cookieHeader: Record<string, string> = {};
  if (server) {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const cookieValue = cookieStore.toString();
    if (cookieValue) {
      cookieHeader['Cookie'] = cookieValue;
    }
  }

  const res = await fetch(`${API_URL}/api${path}`, {
    method,
    credentials: "include",
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...cookieHeader,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache,
    next: tags ? { tags } : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message ?? `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get: <T>(path: string, opts?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...opts, method: "GET" }),

  post: <T>(path: string, body: unknown, opts?: Omit<RequestOptions, "method">) =>
    request<T>(path, { ...opts, method: "POST", body }),

  put: <T>(path: string, body: unknown, opts?: Omit<RequestOptions, "method">) =>
    request<T>(path, { ...opts, method: "PUT", body }),

  delete: <T>(path: string, opts?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...opts, method: "DELETE" }),

  uploadFiles: async <T = { urls: string[] }>(path: string, files: File[]): Promise<T> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    const res = await fetch(`${API_URL}/api${path}`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message ?? `HTTP ${res.status}`);
    }

    return res.json();
  },
};
