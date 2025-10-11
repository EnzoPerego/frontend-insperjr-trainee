import { config } from '../config'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

function getAuthToken(): string | null {
  try {
    return localStorage.getItem('auth_token')
  } catch {
    return null
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${config.API_BASE_URL}${path}`
  const token = getAuthToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(url, { ...options, headers })
  if (!res.ok) {
    let detail: any = undefined
    try { detail = await res.json() } catch {}
    throw new Error(detail?.detail || `Erro ${res.status}`)
  }
  try {
    return await res.json() as T
  } catch {
    // "@"ts-expect-error allow empty
    return undefined as T
  }
}

export async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  const url = `${config.API_BASE_URL}${path}`
  const token = getAuthToken()
  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(url, { 
    method: 'POST', 
    body: formData, 
    headers 
  })
  if (!res.ok) {
    let detail: any = undefined
    try { detail = await res.json() } catch {}
    throw new Error(detail?.detail || `Erro ${res.status}`)
  }
  try {
    return await res.json() as T
  } catch {
    // "@"ts-expect-error allow empty
    return undefined as T
  }
}


