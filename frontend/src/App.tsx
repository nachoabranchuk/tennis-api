import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { GuestRoute, PrivateRoute, RoleRoute } from './auth/guards'
import Layout from './components/Layout'
import AdminPage from './pages/AdminPage'
import ForbiddenPage from './pages/ForbiddenPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NewPlayerPage from './pages/NewPlayerPage'
import NotFoundPage from './pages/NotFoundPage'
import PlayersPage from './pages/PlayersPage'
import ProfilePage from './pages/ProfilePage'
import RegisterPage from './pages/RegisterPage'
import TournamentsPage from './pages/TournamentsPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            {/* ---- Rutas PUBLICAS: sin autenticacion ---- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/tournaments" element={<TournamentsPage />} />
            <Route path="/forbidden" element={<ForbiddenPage />} />

            {/* Login y registro: solo para quien NO tiene sesion */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* ---- Rutas PRIVADAS: cualquier usuario autenticado ---- */}
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/players/new" element={<NewPlayerPage />} />
            </Route>

            {/* ---- Rutas PRIVADAS PROTEGIDAS POR ROL: solo ADMIN ---- */}
            <Route element={<RoleRoute roles={['ADMIN']} />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
