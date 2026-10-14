import { useCallback, useEffect, useState } from 'react'
import { api } from './client'
import type { ListResponse } from '../types'

// Hook para los listados. El back lista con el metodo QUERY y los filtros viajan en el body.
export function useList<T>(path: string, body: Record<string, unknown>) {
  const [items, setItems] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  // El body se serializa para usarlo como dependencia estable (un objeto nuevo en cada render
  // dispararia el efecto infinitamente).
  const key = JSON.stringify(body)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api<ListResponse<T>>('QUERY', path, JSON.parse(key))
      setItems(res.data)
      setTotal(res.meta.total)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [path, key])

  useEffect(() => {
    // Pequeña espera para no pedir en cada tecla mientras se escribe en el buscador.
    const timer = setTimeout(load, 250)
    return () => clearTimeout(timer)
  }, [load])

  return { items, total, loading, error, reload: load }
}
