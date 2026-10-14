import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { api, ApiError } from '../api/client'
import type { User } from '../types'

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

interface Envelope<T> {
  success: boolean
  data: T
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  // loading = "todavia no sabemos si hay sesion". Evita redirigir a /login antes de preguntarle al back.
  const [loading, setLoading] = useState(true)

  // Al abrir la app se pregunta al back quien esta logueado. La sesion vive en cookies httpOnly,
  // que JavaScript no puede leer: la unica forma de saberlo es pedir /auth/me.
  useEffect(() => {
    api<Envelope<User>>('GET', '/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await api<Envelope<User>>('POST', '/auth/login', { email, password })
    setUser(res.data)
  }, [])

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      await api('POST', '/auth/register', { name, email, password })
      // El registro no abre sesion en el back: se hace login a continuacion.
      await login(email, password)
    },
    [login],
  )

  const logout = useCallback(async () => {
    try {
      await api('POST', '/auth/logout')
    } catch (error) {
      if (!(error instanceof ApiError)) throw error
    }
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
