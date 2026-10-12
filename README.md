# Tennis API

API REST de **tenistas** y **torneos**. Express 5 + TypeScript, MongoDB con Mongoose, validación con Zod y auth con JWT en cookies `httpOnly`.

## Setup

```bash
npm install
cp .env.example .env   # completar MONGODB_URI, JWT_SECRET y JWT_REFRESH_SECRET
npm run seed           # opcional: datos de ejemplo
npm run dev
```

## Estructura

```
src/
  config/        conexión a Mongo
  models/        Player, Tournament, User (Mongoose)
  schemas/       schemas de Zod (fuente de verdad de lo que entra por HTTP)
  middlewares/   validateBody (genérico) y authMiddleware
  controllers/   lógica de cada recurso
  routes/        método + path -> controller
  seed.ts        datos de ejemplo
```

## Endpoints (`/api/v1`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| QUERY | `/players` | Lista con filtros, orden y paginación (filtros en el body) |
| GET | `/players/:id` | Detalle |
| POST | `/players` | Crear |
| PUT | `/players/:id` | Actualizar (al menos un campo) |
| DELETE | `/players/:id` | Eliminar |
| QUERY | `/tournaments` | Igual que players |
| GET/POST/PUT/DELETE | `/tournaments[/:id]` | CRUD |
| POST | `/auth/register`, `/auth/login`, `/auth/logout` | Auth |

### Ejemplos

```jsonc
// POST /players
{
  "firstName": "Gabriela",
  "lastName": "Sabatini",
  "country": "arg",            // se normaliza a "ARG"
  "birthDate": "1970-05-16",
  "hand": "RIGHT",             // RIGHT | LEFT
  "backhand": "TWO_HANDED",    // ONE_HANDED | TWO_HANDED
  "heightCm": 175
}

// QUERY /players
{ "country": "ESP", "hand": "LEFT", "sortBy": "lastName", "sortOrder": "asc", "page": 1, "limit": 10 }

// POST /tournaments
{ "name": "Rio Open", "category": "ATP_500", "surface": "CLAY", "city": "Río de Janeiro", "country": "BRA", "year": 2026 }
```

Si el body no pasa Zod, responde `400` con `{ success: false, error: { message, details } }` indicando qué campo falló.
Los duplicados (jugador repetido, mismo torneo y año) responden `409`.
