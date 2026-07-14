import { useState, useMemo, useEffect, useRef } from 'react'
import { fetchUsers, adminBroadcast, adminUserAction, fetchBroadcasts } from '../lib/users'
import { SparkLogo, SearchIcon, CloseIcon } from './icons'

const COUNTRY = {
  uz: '🇺🇿 O‘zbekiston', ru: '🇷🇺 Rossiya', kk: '🇰🇿 Qozog‘iston', ky: '🇰🇬 Qirg‘iziston',
  tg: '🇹🇯 Tojikiston', tk: '🇹🇲 Turkmaniston', tr: '🇹🇷 Turkiya', en: '🌍 —', ar: '🇸🇦 —',
}
const AVA = ['#f5842a', '#4a90e2', '#a06bff', '#37d67a', '#ff5c8a', '#f0b400']

const country = (c) => (!c ? '—' : COUNTRY[c.toLowerCase()] || c.toUpperCase())
const fmtDate = (ts) => (!ts ? '—' : new Date(ts).toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric' }))
const isActive = (ls) => Date.now() - (ls || 0) < 7 * 86400000
const initials = (u) => (`${u.first_name || ''} ${u.last_name || ''}`.trim()[0] || '?').toUpperCase()
const avaColor = (id) => AVA[Math.abs(String(id).split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % AVA.length]
const fullName = (u) => `${u.first_name || ''} ${u.last_name || ''}`.trim() || '—'

function relTime(ts) {
  if (!ts) return '—'
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60) return 'hozirgina'
  if (s < 3600) return `${Math.floor(s / 60)} daqiqa oldin`
  if (s < 86400) return `${Math.floor(s / 3600)} soat oldin`
  return `${Math.floor(s / 86400)} kun oldin`
}
const inPeriod = (ts, p) => {
  if (p === 'all') return true
  const d = Date.now() - ts
  if (p === 'today') return new Date(ts).toDateString() === new Date().toDateString()
  if (p === 'week') return d < 7 * 86400000
  if (p === 'month') return d < 30 * 86400000
  return true
}

export default function Admin() {
  const [key, setKey] = useState('')
  const [authed, setAuthed] = useState(false)
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [updated, setUpdated] = useState(null)

  const [query, setQuery] = useState('')
  const [statusF, setStatusF] = useState('all')
  const [periodF, setPeriodF] = useState('all')
  const [sort, setSort] = useState({ col: 'joined', dir: 'desc' })

  const [selected, setSelected] = useState(null)
  const [bcast, setBcast] = useState(false)
  const [page, setPage] = useState(1)
  const keyRef = useRef('')

  const load = async (silent) => {
    if (!silent) setLoading(true)
    setError('')
    try {
      const list = await fetchUsers(keyRef.current)
      setUsers(list)
      setUpdated(Date.now())
      setAuthed(true)
    } catch (err) {
      if (!silent) setError(err.message)
    } finally {
      if (!silent) setLoading(false)
    }
  }

  const login = async (e) => {
    e?.preventDefault?.()
    keyRef.current = key
    await load(false)
  }

  // Avtomatik yangilanish (5s)
  useEffect(() => {
    if (!authed) return
    const t = setInterval(() => load(true), 5000)
    return () => clearInterval(t)
  }, [authed])

  // Filtr o'zgarsa birinchi sahifaga qaytamiz
  useEffect(() => { setPage(1) }, [query, statusF, periodF, sort])

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter((u) => isActive(u.lastSeen)).length,
    today: users.filter((u) => new Date(u.joined).toDateString() === new Date().toDateString()).length,
    countries: new Set(users.map((u) => u.language_code).filter(Boolean)).size,
  }), [users])

  const growth = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const out = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today); d.setDate(d.getDate() - i)
      const n = new Date(d); n.setDate(d.getDate() + 1)
      out.push({ d, count: users.filter((u) => u.joined >= d.getTime() && u.joined < n.getTime()).length })
    }
    return out
  }, [users])

  const rows = useMemo(() => {
    let r = users.filter((u) => {
      if (statusF === 'active' && !isActive(u.lastSeen)) return false
      if (statusF === 'inactive' && isActive(u.lastSeen)) return false
      if (statusF === 'blocked' && !u.blocked) return false
      if (!inPeriod(u.joined, periodF)) return false
      const q = query.trim().toLowerCase()
      if (q && !`${u.first_name} ${u.last_name} ${u.username} ${u.id}`.toLowerCase().includes(q)) return false
      return true
    })
    const { col, dir } = sort
    const s = dir === 'asc' ? 1 : -1
    r = [...r].sort((a, b) => {
      let av, bv
      if (col === 'name') { av = fullName(a).toLowerCase(); bv = fullName(b).toLowerCase() }
      else { av = a[col] ?? 0; bv = b[col] ?? 0 }
      return av < bv ? -s : av > bv ? s : 0
    })
    return r
  }, [users, query, statusF, periodF, sort])

  const toggleSort = (col) =>
    setSort((s) => ({ col, dir: s.col === col && s.dir === 'desc' ? 'asc' : 'desc' }))
  const arrow = (col) => (sort.col === col ? (sort.dir === 'desc' ? ' ↓' : ' ↑') : '')

  const doAction = async (id, action) => {
    if (action === 'delete' && !confirm('Foydalanuvchi o‘chirilsinmi?')) return
    try {
      await adminUserAction(keyRef.current, id, action)
      setSelected(null)
      load(true)
    } catch (e) {
      alert(e.message)
    }
  }

  /* ---- Login ---- */
  if (!authed) {
    return (
      <div className="admin-login">
        <form className="admin-login__box" onSubmit={login}>
          <span className="admin-login__logo"><SparkLogo /></span>
          <h1>Sabo Admin</h1>
          <p>Boshqaruv paneliga kirish</p>
          <input type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Admin parol" autoFocus />
          {error && <span className="admin-login__err">{error}</span>}
          <button type="submit" disabled={loading || !key}>{loading ? 'Tekshirilmoqda...' : 'Kirish'}</button>
        </form>
      </div>
    )
  }

  const maxG = Math.max(1, ...growth.map((g) => g.count))
  const PAGE = 20
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE))
  const curPage = Math.min(page, totalPages)
  const pageRows = rows.slice((curPage - 1) * PAGE, curPage * PAGE)
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
          <span className="admin__updated">Yangilangan: {updated ? new Date(updated).toLocaleTimeString('uz-UZ') : '—'}</span>
          <button className="admin__btn" onClick={() => setBcast(true)}>📣 Ommaviy xabar</button>
          <button className="admin__btn admin__btn--ghost" onClick={() => setAuthed(false)}>Chiqish</button>
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

      {/* O'sish grafigi */}
      <div className="agraph">
        <div className="agraph__head"><b>O‘sish (so‘nggi 14 kun)</b></div>
        <div className="agraph__bars">
          {growth.map((g, i) => (
            <div className="agraph__col" key={i} title={`${g.d.toLocaleDateString('uz-UZ')}: ${g.count}`}>
              <div className="agraph__bar" style={{ height: `${(g.count / maxG) * 100}%` }}>
                {g.count > 0 && <span>{g.count}</span>}
              </div>
              <small>{g.d.getDate()}</small>
            </div>
          ))}
        </div>
      </div>

      {/* Filtrlar */}
      <div className="admin__filters">
        <div className="admin__search">
          <SearchIcon />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ism, username yoki ID..." />
        </div>
        <select value={statusF} onChange={(e) => setStatusF(e.target.value)}>
          <option value="all">Barcha holat</option>
          <option value="active">Faol</option>
          <option value="inactive">Nofaol</option>
          <option value="blocked">Bloklangan</option>
        </select>
        <select value={periodF} onChange={(e) => setPeriodF(e.target.value)}>
          <option value="all">Barcha davr</option>
          <option value="today">Bugun</option>
          <option value="week">Bu hafta</option>
          <option value="month">Bu oy</option>
        </select>
      </div>

      <div className="admin__table-wrap">
        <table className="admin__table">
          <thead>
            <tr>
              <th>#</th>
              <th className="sortable" onClick={() => toggleSort('name')}>Foydalanuvchi{arrow('name')}</th>
              <th>Username</th>
              <th>Telegram ID</th>
              <th>Davlat</th>
              <th className="sortable" onClick={() => toggleSort('xp')}>XP{arrow('xp')}</th>
              <th className="sortable" onClick={() => toggleSort('streak')}>Streak{arrow('streak')}</th>
              <th className="sortable" onClick={() => toggleSort('joined')}>Qo‘shilgan{arrow('joined')}</th>
              <th>Holat</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan="9" className="admin__empty">Foydalanuvchi topilmadi</td></tr>}
            {pageRows.map((u, i) => (
              <tr key={u.id} onClick={() => setSelected(u)} className="admin__row">
                <td className="admin__muted">{(curPage - 1) * PAGE + i + 1}</td>
                <td>
                  <div className="admin__user">
                    <span className="admin__ava" style={{ background: avaColor(u.id) }}>{initials(u)}</span>
                    <span>{fullName(u)}</span>
                  </div>
                </td>
                <td>{u.username ? `@${u.username}` : '—'}</td>
                <td className="admin__mono">{u.id}</td>
                <td>{country(u.language_code)}</td>
                <td>{u.xp || 0}</td>
                <td>🔥 {u.streak || 0}</td>
                <td className="admin__muted">{fmtDate(u.joined)}</td>
                <td>
                  {u.blocked
                    ? <span className="badge badge--blocked">Bloklangan</span>
                    : <span className={`badge badge--${isActive(u.lastSeen) ? 'active' : 'inactive'}`}>{isActive(u.lastSeen) ? 'Faol' : 'Nofaol'}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="admin__pager">
          <button disabled={curPage <= 1} onClick={() => setPage(curPage - 1)}>← Oldingi</button>
          <span>{curPage} / {totalPages}</span>
          <button disabled={curPage >= totalPages} onClick={() => setPage(curPage + 1)}>Keyingi →</button>
        </div>
      )}

      {selected && <DetailModal u={selected} onClose={() => setSelected(null)} onAction={doAction} />}
      {bcast && <BroadcastModal keyVal={keyRef.current} onClose={() => setBcast(false)} />}
    </div>
  )
}

/* ---- Foydalanuvchi tafsiloti ---- */
function DetailModal({ u, onClose, onAction }) {
  const rows = [
    ['Telegram ID', u.id],
    ['Username', u.username ? `@${u.username}` : '—'],
    ['Til', u.language_code || '—'],
    ['Davlat', country(u.language_code)],
    ['XP', u.xp || 0],
    ['Streak', `🔥 ${u.streak || 0}`],
    ['Tugatilgan darslar', u.progress || 0],
    ['Qo‘shilgan', fmtDate(u.joined)],
    ['Oxirgi faollik', relTime(u.lastSeen)],
    ['Holat', u.blocked ? 'Bloklangan' : isActive(u.lastSeen) ? 'Faol' : 'Nofaol'],
  ]
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__box" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose}><CloseIcon /></button>
        <div className="modal__head">
          <span className="admin__ava admin__ava--lg" style={{ background: avaColor(u.id) }}>{initials(u)}</span>
          <div>
            <b>{fullName(u)}</b>
            <small>{u.username ? `@${u.username}` : u.id}</small>
          </div>
        </div>
        <div className="modal__rows">
          {rows.map(([k, v]) => (
            <div className="modal__row" key={k}><span>{k}</span><b>{v}</b></div>
          ))}
        </div>
        <div className="modal__actions">
          {u.blocked
            ? <button className="mbtn mbtn--ok" onClick={() => onAction(u.id, 'unblock')}>Blokdan chiqarish</button>
            : <button className="mbtn mbtn--warn" onClick={() => onAction(u.id, 'block')}>Bloklash</button>}
          <button className="mbtn mbtn--danger" onClick={() => onAction(u.id, 'delete')}>O‘chirish</button>
        </div>
      </div>
    </div>
  )
}

/* ---- Ommaviy xabar (broadcast+) ---- */
function BroadcastModal({ keyVal, onClose }) {
  const [text, setText] = useState('')
  const [segment, setSegment] = useState('all')
  const [btnText, setBtnText] = useState('')
  const [btnUrl, setBtnUrl] = useState('')
  const [image, setImage] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [showHist, setShowHist] = useState(false)

  useEffect(() => {
    fetchBroadcasts(keyVal).then(setHistory).catch(() => {})
  }, [keyVal])

  const send = async () => {
    if (!text.trim() && !image.trim()) return
    setSending(true)
    setResult(null)
    try {
      const payload = { text, segment }
      if (btnText.trim() && btnUrl.trim()) payload.button = { text: btnText.trim(), url: btnUrl.trim() }
      if (image.trim()) payload.image = image.trim()
      const r = await adminBroadcast(keyVal, payload)
      setResult(r)
      fetchBroadcasts(keyVal).then(setHistory).catch(() => {})
    } catch (e) {
      setResult({ error: e.message })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__box" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose}><CloseIcon /></button>
        <h2 className="modal__title">📣 Ommaviy xabar</h2>

        <div className="bc__tabs">
          <button className={!showHist ? 'on' : ''} onClick={() => setShowHist(false)}>Yangi</button>
          <button className={showHist ? 'on' : ''} onClick={() => setShowHist(true)}>Tarix ({history.length})</button>
        </div>

        {showHist ? (
          <div className="bc__history">
            {history.length === 0 && <p className="modal__hint">Hali xabar yuborilmagan.</p>}
            {history.map((h, i) => (
              <div className="bc__hist" key={i}>
                <div className="bc__hist-top">
                  <span>{new Date(h.at).toLocaleString('uz-UZ')}</span>
                  <span className="bc__hist-stat">✅ {h.sent}/{h.total}</span>
                </div>
                <p>{h.text || '(rasm)'}</p>
                <small>{h.segment === 'active' ? 'Faol' : 'Barcha'}{h.hasImage ? ' · 🖼' : ''}{h.hasButton ? ' · 🔘' : ''}</small>
              </div>
            ))}
          </div>
        ) : (
          <>
            <label className="bc__label">Segment</label>
            <select className="bc__select" value={segment} onChange={(e) => setSegment(e.target.value)}>
              <option value="all">Barcha foydalanuvchilar</option>
              <option value="active">Faqat faol (7 kun)</option>
            </select>

            <label className="bc__label">Xabar matni (HTML: &lt;b&gt;, &lt;i&gt;)</label>
            <textarea className="modal__textarea" value={text} onChange={(e) => setText(e.target.value)} placeholder="Xabar matni..." rows={4} />

            <label className="bc__label">Rasm URL (ixtiyoriy)</label>
            <input className="bc__input" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://.../rasm.jpg" />

            <label className="bc__label">Tugma (ixtiyoriy)</label>
            <div className="bc__row">
              <input className="bc__input" value={btnText} onChange={(e) => setBtnText(e.target.value)} placeholder="Tugma matni" />
              <input className="bc__input" value={btnUrl} onChange={(e) => setBtnUrl(e.target.value)} placeholder="https://..." />
            </div>

            {result && (
              result.error
                ? <div className="modal__result err">Xato: {result.error}</div>
                : <div className="modal__result ok">✅ Yuborildi: {result.sent} / {result.total} (xato: {result.failed})</div>
            )}
            <button className="btn-primary" onClick={send} disabled={sending || (!text.trim() && !image.trim())}>
              {sending ? 'Yuborilmoqda...' : 'Yuborish'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
