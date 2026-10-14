import { Link } from 'react-router-dom'

// Se muestra cuando hay sesion pero el rol no alcanza (equivale a un 403).
export default function ForbiddenPage() {
  return (
    <section className="narrow center">
      <h1>403</h1>
      <p>No tenés permisos para ver esta página.</p>
      <Link to="/">Volver al inicio</Link>
    </section>
  )
}
