const API_BASE = import.meta.env.VITE_DURAGRAPH_API_URL || 'http://localhost:8081'

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}/api/v1${endpoint}`
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new ApiError(
      response.status,
      response.statusText,
      error.message || `HTTP ${response.status}`
    )
  }

  return response.json()
}

export const api = {
  get: (url: string) => fetchWithAuth(url),
  post: (url: string, data: unknown) =>
    fetchWithAuth(url, { method: 'POST', body: JSON.stringify(data) }),
  patch: (url: string, data: unknown) =>
    fetchWithAuth(url, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (url: string) =>
    fetchWithAuth(url, { method: 'DELETE' }),
}