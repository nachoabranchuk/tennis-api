import { useState } from 'react'
import { useList } from '../api/useList'
import FormError from '../components/FormError'
import type { Player } from '../types'

export default function PlayersPage() {
  const [search, setSearch] = useState('')
  const [hand, setHand] = useState('')

  const body: Record<string, unknown> = { limit: 50, sortBy: 'lastName', sortOrder: 'asc' }
  if (search.trim()) body.search = search.trim()
  if (hand) body.hand = hand

  const { items, total, loading, error } = useList<Player>('/players', body)

  return (
    <section>
      <h1>Jugadores</h1>
      <div className="filters">
        <input placeholder="Buscar por nombre…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={hand} onChange={(e) => setHand(e.target.value)}>
          <option value="">Cualquier mano</option>
          <option value="RIGHT">Diestros</option>
          <option value="LEFT">Zurdos</option>
        </select>
      </div>

      <FormError error={error} />
      {loading && <p className="muted">Cargando…</p>}
      {!loading && !error && <p className="muted">{total} resultado(s)</p>}

      <div className="grid">
        {items.map((p) => (
          <article key={p._id} className="card">
            <h3>
              {p.firstName} {p.lastName}
            </h3>
            <p className="muted">
              {p.country} · {p.hand === 'LEFT' ? 'Zurdo' : 'Diestro'} ·{' '}
              {p.backhand === 'ONE_HANDED' ? 'Revés a una mano' : 'Revés a dos manos'}
            </p>
            <p>
              Nacimiento: {p.birthDate.slice(0, 10)}
              {p.ranking !== undefined && <> · Ranking #{p.ranking}</>}
              {p.grandSlams !== undefined && <> · {p.grandSlams} Grand Slams</>}
            </p>
            {!p.active && <span className="badge">Retirado</span>}
          </article>
        ))}
      </div>
    </section>
  )
}
