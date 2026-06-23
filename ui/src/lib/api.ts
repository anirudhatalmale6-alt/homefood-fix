/** Base URL for homefood-server (no trailing slash). */
export const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '')

export type ApiSuccess<T> = { success: true; message?: string; data?: T }
export type ApiErrorBody = {
  success: false
  code: string
  message: string
  details?: unknown
  statusCode?: number
}

export class ApiHttpError extends Error {
  readonly status: number
  readonly code: string
  readonly details?: unknown

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message)
    this.status = status
    this.code = code
    this.details = details
  }
}

export async function apiJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`
  const headers = new Headers(init.headers)
  if (init.body && typeof init.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const res = await fetch(url, {
    ...init,
    headers,
    credentials: 'include',
  })

  const text = await res.text()
  let json: unknown
  try {
    json = text ? JSON.parse(text) : {}
  } catch {
    throw new ApiHttpError(res.status, 'PARSE_ERROR', 'Invalid JSON from server')
  }

  if (!res.ok) {
    const err = json as ApiErrorBody
    throw new ApiHttpError(
      res.status,
      err.code || 'REQUEST_FAILED',
      err.message || res.statusText,
      err.details,
    )
  }

  return json as T
}
