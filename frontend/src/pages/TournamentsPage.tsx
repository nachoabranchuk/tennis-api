import { useState } from 'react'
import { useList } from '../api/useList'
import FormError from '../components/FormError'
import type { Tournament } from '../types'

const CATEGORY_LABEL: Record<Tournament['category'], string> = {
  GRAND_SLAM: 'Grand Slam',
  MASTERS_1000: 'Masters 1000',
  ATP_500: 'ATP 500',
  ATP_250: 'ATP 250',
}

const SURFACE_LABEL: Record<Tournament['surface'], string> = {
  HARD: 'Cemento',
  CLAY: 'Polvo de ladrillo',
  GRASS: 'Césped',
  CARPET: 'Carpeta',
}

export default function TournamentsPage() {
  const [surface, setSurface] = useState('')

  const body: Record<string, unknown> = { limit: 50, sortBy: 'name', sortOrder: 'asc' }
  if (surface) body.surface = surface

  const { items, total, loading, error } = useList<Tournament>('/tournaments', body)

  return (
    <section>
      <h1>Torneos</h1>
      <div className="filters">
        <select value={surface} onChange={(e) => setSurface(e.target.value)}>
          <option value="">Cualquier superficie</option>
          {Object.entries(SURFACE_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <FormError error={error} />
      {loading && <p className="muted">Cargando…</p>}
      {!loading && !error && <p className="muted">{total} resultado(s)</p>}

      <div className="grid">
        {items.map((t) => (
          <article key={t._id} className="card">
            <h3>
              {t.name} {t.year}
            </h3>
            <p className="muted">
              {CATEGORY_LABEL[t.category]} · {SURFACE_LABEL[t.surface]}
            </p>
            <p>
              {t.city}, {t.country}
              {t.indoor && ' · Cubierta'}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
