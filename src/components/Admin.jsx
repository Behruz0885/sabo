import { useState, useMemo } from 'react'
import { fetchUsers } from '../lib/users'
import { SparkLogo, SearchIcon } from './icons'

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
const AVA_COLORS = ['#f5842a', '#4a90e2', '#a06bff', '#37d67a', '#ff5c8a', '#f0b400']

const country = (c) => (!c ? '—' : COUNTRY[c.toLowerCase()] || c.toUpperCase())
const fmtDate = (ts) =>
  !ts ? '—' : new Date(ts).toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric' })
const isActive = (ls) => Date.now() - (ls || 0) < 7 * 86400000
const isToday = (ts) => new Date(ts).toDateString() === new Date().toDateString()
const initials = (u) => (`${u.first_name || ''} ${u.last_name || ''}`.trim()[0] || '?').toUpperCase()
const avaColor = (id) => AVA_COLORS[Math.abs(String(id).split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % AVA_COLORS.length]

export default function Admin() {
  const [key, setKey] = useState('')
  const [users, setUsers] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')

  const load = async (e) => {
    e?.preventDefault?.()
    setError('')
    setLoading(true)
    try {
      setUsers(await fetchUsers(key))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUsers(null)
    setKey('')
    setQuery('')
  }

  const stats = useMemo(() => {
    if (!users) return null
    return {
      total: users.length,
      active: users.filter((u) => isActive(u.lastSeen)).length,
      today: users.filter((u) => isToday(u.joined)).length,
      countries: new Set(users.map((u) => u.language_code).filter(Boolean)).size,
    }
  }, [users])

  const filtered = useMemo(() => {
    if (!users) return []
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) =>
      `${u.first_name} ${u.last_name} ${u.username} ${u.id}`.toLowerCase().includes(q)
    )
  }, [users, query])

  /* ---- Login ---- */
  if (users === null) {
    return (
      <div className="admin-login">
        <form className="admin-login__box" onSubmit={load}>
          <span className="admin-login__logo"><SparkLogo /></span>
          <h1>Sabo Admin</h1>
          <p>Boshqaruv paneliga kirish</p>
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

  /* ---- Dashboard ---- */
  const cards = [
    { label: 'Jami foydalanuvchi', value: stats.total, color: '#f5842a' },
    { label: 'Faol (7 kun)', value: stats.active, color: '#37d67a' },
    { label: 'Bugun qo‘shilgan', value: stats.today, color: '#4a90e2' },
    { label: 'Davlatlar', value: stats.countries, color: '#a06bff' },
  ]

  return (
    <div className="admin">
      <header className="admin__bar">
        <div className="admin__brand">
          <span className="admin__logo"><SparkLogo /></span>
          <b>Sabo Admin</b>
        </div>
        <div className="admin__bar-actions">
          <button className="admin__btn" onClick={load}>↻ Yangilash</button>
          <button className="admin__btn admin__btn--ghost" onClick={logout}>Chiqish</button>
        </div>
      </header>

      <div className="admin__stats">
        {cards.map((c) => (
          <div className="astat" key={c.label}>
            <span className="astat__dot" style={{ background: c.color }} />
            <b className="astat__value">{c.value}</b>
            <span className="astat__label">{c.label}</span>
          </div>
        ))}
      </div>

      <div className="admin__search">
        <SearchIcon />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ism, username yoki ID bo‘yicha qidirish..."
        />
      </div>

      <div className="admin__table-wrap">
        <table className="admin__table">
          <thead>
            <tr>
              <th>#</th>
              <th>Foydalanuvchi</th>
              <th>Username</th>
              <th>Telegram ID</th>
              <th>Davlat</th>
              <th>Qo‘shilgan</th>
              <th>Holat</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan="7" className="admin__empty">Foydalanuvchi topilmadi</td></tr>
            )}
            {filtered.map((u, i) => (
              <tr key={u.id}>
                <td className="admin__muted">{i + 1}</td>
                <td>
                  <div className="admin__user">
                    <span className="admin__ava" style={{ background: avaColor(u.id) }}>{initials(u)}</span>
                    <span>{`${u.first_name || ''} ${u.last_name || ''}`.trim() || '—'}</span>
                  </div>
                </td>
                <td>{u.username ? `@${u.username}` : '—'}</td>
                <td className="admin__mono">{u.id}</td>
                <td>{country(u.language_code)}</td>
                <td className="admin__muted">{fmtDate(u.joined)}</td>
                <td>
                  <span className={`badge badge--${isActive(u.lastSeen) ? 'active' : 'inactive'}`}>
                    {isActive(u.lastSeen) ? 'Faol' : 'Nofaol'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
