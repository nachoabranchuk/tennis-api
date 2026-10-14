// Los tres tipos de ruta que pide la consigna:
//   Publica                -> no lleva guard.
//   Privada                -> <PrivateRoute>: exige usuario autenticado.
//   Privada protegida rol  -> <RoleRoute roles={[...]}>: exige autenticado Y ademas el rol.
// Se usan como "layout routes" de React Router: envuelven rutas hijas y renderizan <Outlet />.
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { Role } from '../types'
import { useAuth } from './AuthContext'

export function PrivateRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <p className="center muted">Cargando sesion…</p>

  // Sin sesion -> al login, recordando a donde queria ir para volver despues.
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />

  return <Outlet />
}

export function RoleRoute({ roles }: { roles: Role[] }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <p className="center muted">Cargando sesion…</p>

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />

  // Autenticado pero sin el rol -> 403 (equivale al 403 del back).
  if (!roles.includes(user.role)) return <Navigate to="/forbidden" replace />

  return <Outlet />
}

// Para /login y /register: si ya hay sesion no tiene sentido mostrarlos.
// Al loguearse, vuelve a la pagina que el usuario queria visitar (state.from) o a /profile.
export function GuestRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <p className="center muted">Cargando sesion…</p>
  if (user) {
    const from = (location.state as { from?: string } | null)?.from ?? '/profile'
    return <Navigate to={from} replace />
  }

  return <Outlet />
}
