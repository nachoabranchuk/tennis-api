import { useAuth } from '../auth/AuthContext'

// Ruta PRIVADA: <PrivateRoute> garantiza que aca siempre hay un usuario.
export default function ProfilePage() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <section className="narrow">
      <h1>Mi perfil</h1>
      <div className="card">
        <p>
          <strong>Nombre:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Rol:</strong> <span className={`badge ${user.role === 'ADMIN' ? 'badge-admin' : ''}`}>{user.role}</span>
        </p>
      </div>
      <p className="muted">
        {user.role === 'ADMIN'
          ? 'Sos administrador: tenés acceso al panel de administración.'
          : 'Sos usuario común: no tenés acceso al panel de administración (probá entrar a /admin).'}
      </p>
    </section>
  )
}
