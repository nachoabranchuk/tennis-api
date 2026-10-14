# Tennis App

Aplicación full stack de **jugadores** y **torneos** de tenis.

- **Backend** (`backend/`): Express 5 + TypeScript, MongoDB con Mongoose, validación con Zod, auth con JWT en cookies `httpOnly`.
- **Frontend** (`frontend/`): React + Vite + TypeScript + React Router.

## Puesta en marcha

Requisitos: Node 20+ y una base MongoDB (por ejemplo, un cluster gratuito de MongoDB Atlas).

```bash
# 1. Instalar todo (raíz + backend + frontend)
npm install
npm run install:all

# 2. Configurar el backend
cp backend/.env.example backend/.env   # completar MONGODB_URI, JWT_SECRET y JWT_REFRESH_SECRET

# 3. Cargar datos de ejemplo + usuario admin (opcional)
npm run seed --prefix backend

# 4. Levantar back y front juntos
npm run dev
```

- Backend: http://localhost:3000 · Frontend: http://localhost:5173
- También se pueden correr por separado: `npm run dev --prefix backend` y `npm run dev --prefix frontend`.
- En desarrollo, Vite reenvía `/api` al backend (proxy), así que no hay problemas de CORS y las cookies de sesión viajan solas.
- Para generar los secrets de JWT: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Usuarios de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| ADMIN | `admin@tennis.com` | `Admin1234` (lo crea `npm run seed`; se puede cambiar con `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`) |
| USER | el que se cree en `/register` | — |

Todo registro nuevo entra con rol `USER`. El rol `ADMIN` solo se asigna desde el seed, para que nadie pueda autoasignárselo.

## Tipos de ruta

| Tipo | Frontend (React Router) | Backend (Express) |
|------|-------------------------|-------------------|
| **Pública** (sin autenticación) | `/`, `/players`, `/tournaments`, `/login`, `/register` | `QUERY` y `GET` de `players` y `tournaments`, `/auth/register`, `/auth/login`, `/auth/logout`, `/health` |
| **Privada** (usuario autenticado) | `/profile`, `/players/new` — `<PrivateRoute>` | `POST /players`, `POST /tournaments`, `GET /auth/me` — `authMiddleware` |
| **Privada por rol** (solo `ADMIN`) | `/admin` — `<RoleRoute roles={['ADMIN']}>` | `PUT` y `DELETE` de `players` y `tournaments` — `authMiddleware` + `requireRole('ADMIN')` |

Respuestas del backend ante falta de permisos: **401** si no hay sesión válida, **403** si hay sesión pero el rol no alcanza. El frontend replica la lógica (redirige a `/login` o a `/forbidden`), pero la seguridad real está en el backend: aunque alguien salte el front, la API sigue respondiendo 401/403.

### Cómo funciona la sesión
1. `POST /auth/login` guarda `accessToken` (15 min) y `refreshToken` (7 días) en cookies `httpOnly`; JavaScript no puede leerlas.
2. Al abrir la app, el front llama a `GET /auth/me` para saber quién está logueado (`AuthContext`).
3. Si el access token venció, el backend lo renueva con el refresh token de forma transparente.
4. `POST /auth/logout` borra las cookies.

## API (`/api/v1`)

| Método | Ruta | Acceso |
|--------|------|--------|
| `QUERY` | `/players`, `/tournaments` | Pública — filtros, orden y paginación en el body |
| `GET` | `/players/:id`, `/tournaments/:id` | Pública |
| `POST` | `/players`, `/tournaments` | Privada |
| `PUT` | `/players/:id`, `/tournaments/:id` | ADMIN |
| `DELETE` | `/players/:id`, `/tournaments/:id` | ADMIN |
| `POST` | `/auth/register`, `/auth/login`, `/auth/logout` | Pública |
| `GET` | `/auth/me` | Privada |

El listado usa el método `QUERY` (filtros en el body JSON), por ejemplo:

```jsonc
// QUERY /api/v1/players
{ "hand": "LEFT", "search": "rafa", "sortBy": "lastName", "sortOrder": "asc", "page": 1, "limit": 10 }
```

Todo body pasa por un schema de Zod (`backend/src/schemas`) antes de llegar al controller. Si no es válido responde `400` con el detalle por campo; los duplicados responden `409`.

## Estructura

```
backend/
  src/
    config/        conexión a Mongo
    models/        Player, Tournament, User (Mongoose)
    schemas/       schemas de Zod
    middlewares/   validateBody, authMiddleware, requireRole
    controllers/   lógica de cada recurso
    routes/        método + path -> controller
    seed.ts        datos de ejemplo + admin
frontend/
  src/
    api/           cliente HTTP (fetch con cookies) y hook de listados
    auth/          AuthContext y guards (PrivateRoute, RoleRoute, GuestRoute)
    components/    Layout, Navbar, FormError
    pages/         Home, Players, Tournaments, Login, Register, Profile, NewPlayer, Admin, 403, 404
```

## Despliegue (referencia)
En producción el front y el back suelen estar en dominios distintos: en el front se define `VITE_API_URL` con la URL del back (`https://.../api/v1`) y en el back `CORS_ORIGIN` con la URL del front. Con dominios distintos las cookies necesitan `sameSite: "none"` + `secure`.
