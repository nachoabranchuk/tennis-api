import { useState } from 'react'
import { api } from '../api/client'
import { useList } from '../api/useList'
import FormError from '../components/FormError'
import type { Player, Tournament } from '../types'

const ALL = { limit: 100, sortBy: 'createdAt', sortOrder: 'desc' }

// Ruta PRIVADA PROTEGIDA POR ROL: <RoleRoute roles={['ADMIN']}> solo deja pasar a administradores.
// Las acciones (PUT / DELETE) tambien estan protegidas en el back: si alguien saltea el front,
// el back responde 403 igual.
export default function AdminPage() {
  const players = useList<Player>('/players', ALL)
  const tournaments = useList<Tournament>('/tournaments', ALL)
  const [rankings, setRankings] = useState<Record<string, string>>({})
  const [error, setError] = useState<unknown>(null)

  async function run(action: () => Promise<unknown>, reload: () => Promise<void>) {
    setError(null)
    try {
      await action()
      await reload()
    } catch (err) {
      setError(err)
    }
  }

  function saveRanking(p: Player) {
    const value = Number(rankings[p._id])
    return run(() => api('PUT', `/players/${p._id}`, { ranking: value }), players.reload)
  }

  function removePlayer(p: Player) {
    if (!window.confirm(`¿Eliminar a ${p.firstName} ${p.lastName}?`)) return
    return run(() => api('DELETE', `/players/${p._id}`), players.reload)
  }

  function removeTournament(t: Tournament) {
    if (!window.confirm(`¿Eliminar ${t.name} ${t.year}?`)) return
    return run(() => api('DELETE', `/tournaments/${t._id}`), tournaments.reload)
  }

  return (
    <section>
      <h1>Panel de administración</h1>
      <FormError error={error} />

      <h2>Jugadores ({players.total})</h2>
      <table>
        <thead>
          <tr>
            <th>Jugador</th>
            <th>País</th>
            <th>Ranking</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {players.items.map((p) => (
            <tr key={p._id}>
              <td>
                {p.firstName} {p.lastName}
              </td>
              <td>{p.country}</td>
              <td>
                <input
                  className="small"
                  type="number"
                  placeholder={p.ranking?.toString() ?? '—'}
                  value={rankings[p._id] ?? ''}
                  onChange={(e) => setRankings({ ...rankings, [p._id]: e.target.value })}
                />
                <button
                  className="btn btn-ghost"
                  disabled={!rankings[p._id]}
                  onClick={() => saveRanking(p)}
                >
                  Guardar
                </button>
              </td>
              <td>
                <button className="btn btn-danger" onClick={() => removePlayer(p)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Torneos ({tournaments.total})</h2>
      <table>
        <thead>
          <tr>
            <th>Torneo</th>
            <th>Categoría</th>
            <th>Año</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {tournaments.items.map((t) => (
            <tr key={t._id}>
              <td>{t.name}</td>
              <td>{t.category}</td>
              <td>{t.year}</td>
              <td>
                <button className="btn btn-danger" onClick={() => removeTournament(t)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
