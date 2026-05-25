// El cliente HTTP que incluye el token automáticamente

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

type RequestOptions = RequestInit & {
  token?: string
}

export async function apiCall<T>(
  endpoint: string,
  options?: RequestOptions
): Promise<T> {
  const { token, ...fetchOptions } = options || {}
  
  const url = `${API_BASE_URL}${endpoint}`
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...fetchOptions.headers,
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    if (response.status === 401) {
      // Logout si no está autorizado
      console.error('Unauthorized')
    }
    throw new Error(`API Error: ${response.status}`)
  }

  return response.json() as Promise<T>
}