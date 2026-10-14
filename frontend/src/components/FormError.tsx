import { ApiError } from '../api/client'

// Muestra el mensaje general y, si el back mando errores de Zod por campo, tambien el detalle.
export default function FormError({ error }: { error: unknown }) {
  if (!error) return null
  const message = error instanceof ApiError ? error.message : 'Ocurrio un error inesperado'
  const details = error instanceof ApiError ? error.details : undefined

  return (
    <div className="alert" role="alert">
      <strong>{message}</strong>
      {details && (
        <ul>
          {Object.entries(details).map(([field, msgs]) => (
            <li key={field}>
              <code>{field}</code>: {msgs.join(', ')}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
