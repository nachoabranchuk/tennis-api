import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <NavLink to="/" className="brand">
        🎾 Tennis App
      </NavLink>

      <nav>
        {/* Publicas: siempre visibles */}
        <NavLink to="/players">Jugadores</NavLink>
        <NavLink to="/tournaments">Torneos</NavLink>

        {/* Privadas: solo con sesion */}
        {user && <NavLink to="/players/new">Nuevo jugador</NavLink>}
        {user && <NavLink to="/profile">Mi perfil</NavLink>}

        {/* Privada por rol: solo ADMIN */}
        {user?.role === 'ADMIN' && <NavLink to="/admin">Panel admin</NavLink>}
      </nav>

      <div className="session">
        {user ? (
          <>
            <span className={`badge ${user.role === 'ADMIN' ? 'badge-admin' : ''}`}>{user.role}</span>
            <span className="muted">{user.name}</span>
            <button className="btn btn-ghost" onClick={handleLogout}>
              Salir
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Ingresar</NavLink>
            <NavLink to="/register" className="btn">
              Registrarme
            </NavLink>
          </>
        )}
      </div>
    </header>
  )
}
