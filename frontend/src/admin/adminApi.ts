const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://api.mebel.com.uz';

export class AdminApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/api/admin${path}`, {
    credentials: 'include',
    headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
    ...init,
  });

  if (!response.ok) {
    throw new AdminApiError(response.status, `Admin API xatosi: ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

export const adminApi = {
  login: (username: string, password: string) =>
    request<{ username: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  logout: () => request<{ ok: boolean }>('/auth/logout', { method: 'POST' }),
  me: () => request<{ username: string }>('/auth/me'),
  get: <T>(path: string, params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return request<T>(`${path}${query}`);
  },
};

export function exportUrl(path: string, params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params).toString()}` : '';
  return `${API_BASE_URL}/api/admin${path}${query}`;
}
