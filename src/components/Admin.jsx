import { useState } from 'react'
import { fetchUsers } from '../lib/users'

const COUNTRY = {
  uz: '🇺🇿 O‘zbekiston',
  ru: '🇷🇺 Rossiya',
  kk: '🇰🇿 Qozog‘iston',
  ky: '🇰🇬 Qirg‘iziston',
  tg: '🇹🇯 Tojikiston',
  tk: '🇹🇲 Turkmaniston',
  tr: '🇹🇷 Turkiya',
  en: '🌍 —',
  ar: '🇸🇦 —',
}

function country(code) {
  if (!code) return '—'
  return COUNTRY[code.toLowerCase()] || code.toUpperCase()
}

function fmtDate(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric' })
}

function status(lastSeen) {
  const active = Date.now() - (lastSeen || 0) < 7 * 86400000
  return active
    ? { label: 'Faol', cls: 'active' }
    : { label: 'Nofaol', cls: 'inactive' }
}

export default function Admin() {
  const [key, setKey] = useState('')
  const [users, setUsers] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const login = async (e) => {
    e?.preventDefault()
    setError('')
    setLoading(true)
    try {
      const list = await fetchUsers(key)
      setUsers(list)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (users === null) {
    return (
      <div className="admin-login">
        <form className="admin-login__box" onSubmit={login}>
          <h1>Sabo — Admin</h1>
          <p>Kirish uchun parolni kiriting</p>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Admin parol"
            autoFocus
          />
          {error && <span className="admin-login__err">{error}</span>}
          <button type="submit" disabled={loading || !key}>
            {loading ? 'Tekshirilmoqda...' : 'Kirish'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="admin">
      <header className="admin__top">
        <h1>Foydalanuvchilar</h1>
        <div className="admin__actions">
          <span className="admin__count">Jami: {users.length}</span>
          <button onClick={login}>↻ Yangilash</button>
        </div>
      </header>

      <div className="admin__table-wrap">
        <table className="admin__table">
          <thead>
            <tr>
              <th>#</th>
              <th>Ism</th>
              <th>Username</th>
              <th>Telegram ID</th>
              <th>Davlat</th>
              <th>Qo‘shilgan</th>
              <th>Holat</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr><td colSpan="7" className="admin__empty">Hozircha foydalanuvchi yo‘q</td></tr>
            )}
            {users.map((u, i) => {
              const st = status(u.lastSeen)
              return (
                <tr key={u.id}>
                  <td>{i + 1}</td>
                  <td>{`${u.first_name || ''} ${u.last_name || ''}`.trim() || '—'}</td>
                  <td>{u.username ? `@${u.username}` : '—'}</td>
                  <td className="admin__mono">{u.id}</td>
                  <td>{country(u.language_code)}</td>
                  <td>{fmtDate(u.joined)}</td>
                  <td><span className={`badge badge--${st.cls}`}>{st.label}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
