import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import FormError from '../components/FormError'

// Convierte "" -> undefined para que el campo opcional no viaje (Zod en el back espera numero).
const num = (value: string) => (value.trim() === '' ? undefined : Number(value))

// Ruta PRIVADA: cualquier usuario autenticado puede cargar un jugador (POST /players).
export default function NewPlayerPage() {
  const navigate = useNavigate()
  const [f, setF] = useState({
    firstName: '',
    lastName: '',
    country: '',
    birthDate: '',
    hand: 'RIGHT',
    backhand: 'TWO_HANDED',
    heightCm: '',
    ranking: '',
    grandSlams: '',
    bio: '',
  })
  const [error, setError] = useState<unknown>(null)
  const [submitting, setSubmitting] = useState(false)

  const set = (field: keyof typeof f) => (e: { target: { value: string } }) =>
    setF({ ...f, [field]: e.target.value })

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await api('POST', '/players', {
        firstName: f.firstName,
        lastName: f.lastName,
        country: f.country,
        birthDate: f.birthDate,
        hand: f.hand,
        backhand: f.backhand,
        heightCm: num(f.heightCm),
        ranking: num(f.ranking),
        grandSlams: num(f.grandSlams),
        bio: f.bio || undefined,
      })
      navigate('/players')
    } catch (err) {
      setError(err)
      setSubmitting(false)
    }
  }

  return (
    <section className="narrow">
      <h1>Nuevo jugador</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="row">
          <label>
            Nombre
            <input value={f.firstName} onChange={set('firstName')} />
          </label>
          <label>
            Apellido
            <input value={f.lastName} onChange={set('lastName')} />
          </label>
        </div>
        <div className="row">
          <label>
            País (3 letras, ej: ARG)
            <input value={f.country} onChange={set('country')} maxLength={3} />
          </label>
          <label>
            Fecha de nacimiento
            <input type="date" value={f.birthDate} onChange={set('birthDate')} />
          </label>
        </div>
        <div className="row">
          <label>
            Mano
            <select value={f.hand} onChange={set('hand')}>
              <option value="RIGHT">Diestro</option>
              <option value="LEFT">Zurdo</option>
            </select>
          </label>
          <label>
            Revés
            <select value={f.backhand} onChange={set('backhand')}>
              <option value="TWO_HANDED">A dos manos</option>
              <option value="ONE_HANDED">A una mano</option>
            </select>
          </label>
        </div>
        <div className="row">
          <label>
            Altura (cm)
            <input type="number" value={f.heightCm} onChange={set('heightCm')} />
          </label>
          <label>
            Ranking
            <input type="number" value={f.ranking} onChange={set('ranking')} />
          </label>
          <label>
            Grand Slams
            <input type="number" value={f.grandSlams} onChange={set('grandSlams')} />
          </label>
        </div>
        <label>
          Bio
          <textarea rows={3} value={f.bio} onChange={set('bio')} />
        </label>
        {/* Los errores de validacion los devuelve Zod desde el back, campo por campo. */}
        <FormError error={error} />
        <button className="btn" disabled={submitting}>
          {submitting ? 'Guardando…' : 'Guardar jugador'}
        </button>
      </form>
    </section>
  )
}
