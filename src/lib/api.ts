const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || response.statusText);
  }

  return response.json();
}

export const api = {
  get: (endpoint: string, options?: RequestInit) => apiFetch(endpoint, { ...options, method: 'GET' }),
  post: (endpoint: string, body: any, options?: RequestInit) =>
    apiFetch(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  patch: (endpoint: string, body: any, options?: RequestInit) =>
    apiFetch(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint: string, options?: RequestInit) => apiFetch(endpoint, { ...options, method: 'DELETE' }),
  upload: async (endpoint: string, formData: FormData, options?: RequestInit) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || response.statusText);
    }
    return response.json();
  },
};
