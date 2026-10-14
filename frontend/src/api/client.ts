// Cliente HTTP unico. Todos los pedidos van con credentials: 'include' para que el navegador
// mande y reciba las cookies httpOnly (accessToken / refreshToken) que pone el backend.
const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

export class ApiError extends Error {
  status: number
  details?: Record<string, string[]>

  constructor(status: number, message: string, details?: Record<string, string[]>) {
    super(message)
    this.status = status
    this.details = details
  }
}

// El back responde los errores en dos formatos: { error: "texto" } y
// { success: false, error: { message, details } }. Aca se unifican.
function parseError(status: number, body: unknown): ApiError {
  const error = (body as { error?: unknown } | null)?.error
  if (typeof error === 'string') return new ApiError(status, error)
  if (error && typeof error === 'object') {
    const { message, details } = error as { message?: string; details?: Record<string, string[]> }
    return new ApiError(status, message ?? 'Error inesperado', details)
  }
  return new ApiError(status, 'Error inesperado')
}

export async function api<T = unknown>(method: string, path: string, body?: unknown): Promise<T> {
  let res: Response
  try {
    res = await fetch(BASE_URL + path, {
      method,
      credentials: 'include',
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor. ¿Esta corriendo el backend?')
  }

  // 204 (por ejemplo en DELETE) no trae body.
  const text = await res.text()
  const json: unknown = text ? JSON.parse(text) : null

  if (!res.ok) throw parseError(res.status, json)
  return json as T
}
