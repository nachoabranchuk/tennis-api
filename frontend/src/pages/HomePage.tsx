import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <section>
      <h1>Tennis App</h1>
      <p className="lead">Jugadores y torneos del circuito. Esta pagina es publica: la ve cualquiera.</p>

      <div className="grid">
        <div className="card">
          <h3>Pública</h3>
          <p>Cualquiera puede consultar jugadores y torneos, sin iniciar sesión.</p>
          <Link to="/players">Ver jugadores →</Link>
        </div>
        <div className="card">
          <h3>Privada</h3>
          <p>Cargar un jugador nuevo o ver tu perfil requiere estar autenticado.</p>
          <Link to={user ? '/players/new' : '/login'}>{user ? 'Cargar jugador →' : 'Ingresar →'}</Link>
        </div>
        <div className="card">
          <h3>Privada por rol</h3>
          <p>El panel de administración solo está disponible para usuarios con rol ADMIN.</p>
          <Link to="/admin">Ir al panel →</Link>
        </div>
      </div>
    </section>
  )
}
