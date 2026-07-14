import { useState } from 'react'
import { libraryByCategory, COURSES } from '../../data/content'
import {
  SearchIcon, BookmarkIcon, FlameIcon, FreezeIcon, ClockIcon, CapIcon, SparkLogo,
  SettingsIcon, BackIcon, BoltIcon, ChevronRight,
} from '../icons'
import OptIcon from '../onboarding/OptIcon'

const BOT_USERNAME = import.meta.env.VITE_BOT_USERNAME || ''
const LEVEL_TITLES = ['Yangi ovoz', 'O‘rganuvchi', 'Ishongan', 'Mahoratli', 'Usta', 'Karizmatik']
const levelInfo = (xp) => {
  const level = Math.floor(xp / 100) + 1
  return { level, inLevel: xp % 100, title: LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)] }
}
const rankOf = (xp) => Math.max(1, 130000 - xp * 13)
const fmtNum = (n) => n.toLocaleString('en-US')

/* ================= Library ================= */
export function Library({ onOpenCourse, currentId, onOpenSettings }) {
  const groups = libraryByCategory()
  return (
    <main className="lib">
      <header className="lib__top">
        <h1>Kutubxona</h1>
        <div className="lib__actions">
          <button className="lib__ibtn" aria-label="Qidirish"><SearchIcon /></button>
          <button className="lib__ibtn" onClick={onOpenSettings} aria-label="Sozlamalar"><SettingsIcon /></button>
        </div>
      </header>
      <div className="lib__scroll">
        {groups.map((g) => (
          <section className="lib__cat" key={g.category}>
            <h2>{g.category}</h2>
            <div className="lib__grid">
              {g.courses.map((c) => (
                <button className={`course ${c.id === currentId ? 'course--on' : ''}`} key={c.id} onClick={() => onOpenCourse(c.id)}>
                  <span className="course__cover" style={{ background: `linear-gradient(140deg, ${c.color}44, #2a1d15)` }}>
                    <span style={{ color: c.color }}><OptIcon name={c.icon} /></span>
                  </span>
                  <b>{c.title}</b>
                  <small>{c.lessons.length} dars{c.id === currentId ? ' · joriy' : ''}</small>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}

/* ================= Insights ================= */
export function Insights({ saved = [], onRemove }) {
  return (
    <main className="ins">
      <header className="ins__top"><h1>Tahlil</h1></header>
      {saved.length === 0 ? (
        <div className="ins__empty">
          <span className="ins__icon"><BookmarkIcon /></span>
          <b>Hali saqlangan g‘oyalar yo‘q</b>
          <p>Dars davomida yoqqan maslahatni saqlash belgisini bosib, shu yerda saqlab qo‘y.</p>
        </div>
      ) : (
        <div className="ins__scroll">
          {saved.map((s) => (
            <div className="scard" key={s.id}>
              <div className="scard__head">
                <span className="scard__course">{s.course}</span>
                <button className="scard__del" onClick={() => onRemove(s)} aria-label="O‘chirish">✕</button>
              </div>
              <p className="scard__text">{s.text}</p>
              <small className="scard__lesson">📘 {s.lesson}</small>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

/* ================= You ================= */
export function You({ telegram, stats: st = { xp: 0, streak: 0 }, progressByCourse = {}, activeDays = [], onReset, onOpenSettings, onOpenLeaderboard }) {
  const name = telegram?.user?.first_name || 'Foydalanuvchi'
  const totalDone = Object.values(progressByCourse).reduce((a, b) => a + b, 0)
  const { level, inLevel, title } = levelInfo(st.xp)
  const statCards = [
    { icon: <FlameIcon />, value: String(st.streak), label: 'Joriy streak', color: '#f5842a' },
    { icon: <FreezeIcon />, value: '1', label: 'Streak muzlatishlar', color: '#4a90e2' },
    { icon: <ClockIcon />, value: `${totalDone * 5} daq`, label: 'O‘rganilgan vaqt', color: '#9a8e84' },
    { icon: <CapIcon />, value: String(totalDone), label: 'Tugatilgan darslar', color: '#37d67a' },
  ]

  const invite = () => {
    telegram?.haptic?.('medium')
    const id = telegram?.user?.id || ''
    const link = BOT_USERNAME ? `https://t.me/${BOT_USERNAME}?start=ref${id}` : 'https://t.me/'
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent('Sabo — AI muloqot murabbiyi! 🚀')}`
    telegram?.tg?.openTelegramLink ? telegram.tg.openTelegramLink(shareUrl) : window.open(shareUrl, '_blank')
  }

  return (
    <main className="you">
      <div className="you__scroll">
        <header className="you__head2">
          <div>
            <b>{name}</b>
            <small>Qo‘shildi: {new Date().toLocaleDateString('uz-UZ', { day: '2-digit', month: 'long', year: 'numeric' })}</small>
          </div>
          <button className="you__gear" onClick={onOpenSettings} aria-label="Sozlamalar"><SettingsIcon /></button>
        </header>

        {/* Level card */}
        <div className="levelcard">
          <div className="levelcard__badge">
            <div className="levelcard__hex">{level}</div>
          </div>
          <b className="levelcard__title">{title}</b>
          <span className="levelcard__xp">{inLevel} / 100 XP</span>
          <div className="levelcard__bar"><div style={{ width: `${inLevel}%` }} /></div>
          <button className="levelcard__foot" onClick={onOpenLeaderboard}>
            <span><BoltIcon /> <b>{st.xp}</b> Total XP</span>
            <span className="levelcard__rank">👑 #{fmtNum(rankOf(st.xp))} <ChevronRight /></span>
          </button>
        </div>

        <h2 className="you__h2">Statistikang</h2>
        <div className="you__stats">
          {statCards.map((s) => (
            <div className="ycard" key={s.label}>
              <span className="ycard__icon" style={{ color: s.color }}>{s.icon}</span>
              <b>{s.value}</b><small>{s.label}</small>
            </div>
          ))}
        </div>

        <h2 className="you__h2">Faollik tarixi</h2>
        <ActivityCalendar activeDays={activeDays} />

        <h2 className="you__h2">Kurslar</h2>
        <div className="you__courses">
          {COURSES.map((c) => {
            const done = progressByCourse[c.id] || 0
            return (
              <div className="ycourse" key={c.id}>
                <span className="ycourse__icon" style={{ color: c.color }}><OptIcon name={c.icon} /></span>
                <div className="ycourse__text">
                  <b>{c.title}</b>
                  <div className="ycourse__bar"><div style={{ width: `${(done / c.lessons.length) * 100}%` }} /></div>
                </div>
                <small>{done}/{c.lessons.length}</small>
              </div>
            )
          })}
        </div>

        <button className="invite" onClick={invite}>🎁 Do‘stni taklif qil</button>

        <div className="premium">
          <b>Premium’ga o‘ting</b>
          <p>Cheksiz mashq, shaxsiy AI feedback va tezroq o‘sish.</p>
          <button className="btn-primary">✨ Premium’ga o‘tish</button>
        </div>
      </div>
    </main>
  )
}

/* ---- Faollik kalendari ---- */
function ActivityCalendar({ activeDays }) {
  const [cur, setCur] = useState(new Date())
  const y = cur.getFullYear()
  const m = cur.getMonth()
  const first = new Date(y, m, 1).getDay()
  const days = new Date(y, m + 1, 0).getDate()
  const set = new Set(activeDays)
  const today = new Date().toISOString().slice(0, 10)
  const wd = ['Yak', 'Du', 'Se', 'Cho', 'Pay', 'Ju', 'Sha']
  const cells = []
  for (let i = 0; i < first; i++) cells.push(null)
  for (let d = 1; d <= days; d++) cells.push(d)
  const key = (d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  const activeCount = cells.filter((d) => d && set.has(key(d))).length

  return (
    <div className="cal">
      <div className="cal__top">
        <button onClick={() => setCur(new Date(y, m - 1, 1))}>‹</button>
        <div><b>{cur.toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' })}</b><small>{activeCount} faol kun</small></div>
        <button onClick={() => setCur(new Date(y, m + 1, 1))}>›</button>
      </div>
      <div className="cal__grid cal__wd">{wd.map((w) => <span key={w}>{w}</span>)}</div>
      <div className="cal__grid">
        {cells.map((d, i) => (
          <span key={i} className={`cal__day ${d && set.has(key(d)) ? 'is-active' : ''} ${d && key(d) === today ? 'is-today' : ''}`}>
            {d || ''}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ================= Leaderboard ================= */
const DEMO = [
  { name: 'Matt', level: 13, xp: 31450 },
  { name: 'Phil', level: 13, xp: 29800 },
  { name: 'El', level: 13, xp: 27900 },
  { name: 'Ptah', level: 13, xp: 26430 },
  { name: 'Gino', level: 12, xp: 23240 },
  { name: 'Jerry', level: 12, xp: 22350 },
  { name: 'Muaadh', level: 12, xp: 22250 },
]
const AVA = ['#f5842a', '#4a90e2', '#a06bff', '#37d67a', '#ff5c8a', '#f0b400']
const ini = (n) => (n || '?').slice(0, 2).toUpperCase()
const col = (n) => AVA[Math.abs(n.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % AVA.length]

export function Leaderboard({ telegram, xp, onBack }) {
  const name = telegram?.user?.first_name || 'Siz'
  const me = { name, level: levelInfo(xp).level, xp, me: true }
  const all = [...DEMO, me].sort((a, b) => b.xp - a.xp)
  const myRank = all.findIndex((u) => u.me) + 1
  const [first, second, third] = all
  const rest = all.slice(3)

  const Podium = ({ u, place }) => (
    <div className={`pod pod--${place}`}>
      <span className="pod__ava" style={{ background: col(u.name) }}>{ini(u.name)}<i>{place}</i></span>
      <b>{u.name}</b>
      <small>Level {u.level}</small>
      <span className="pod__xp"><BoltIcon /> {fmtNum(u.xp)}</span>
    </div>
  )

  return (
    <main className="board">
      <header className="board__top">
        <button className="onb__back" onClick={onBack}><BackIcon /></button>
        <h1>Reyting</h1>
        <span style={{ width: 38 }} />
      </header>
      <div className="board__podium">
        <Podium u={second} place={2} />
        <Podium u={first} place={1} />
        <Podium u={third} place={3} />
      </div>
      <div className="board__list">
        <span className="board__label">SENING O‘RNING</span>
        {all.map((u, i) => (
          <div className={`brow ${u.me ? 'brow--me' : ''}`} key={i}>
            <span className="brow__rank">#{i + 1}</span>
            <span className="brow__ava" style={{ background: col(u.name) }}>{ini(u.name)}</span>
            <div className="brow__text"><b>{u.name}</b><small>Level {u.level}</small></div>
            <span className="brow__xp"><BoltIcon /> {fmtNum(u.xp)}</span>
          </div>
        ))}
      </div>
    </main>
  )
}

/* ================= Settings ================= */
export function Settings({ telegram, onReset, onBack }) {
  const openLink = (url) => (telegram?.tg?.openLink ? telegram.tg.openLink(url) : window.open(url, '_blank'))
  const links = [
    { icon: '💬', label: 'Fikr bildirish', url: 'https://t.me/' },
    { icon: '❓', label: 'Yordam markazi', url: 'https://t.me/' },
    { icon: '✉️', label: 'Email support', url: 'mailto:support@sabo.app' },
    { icon: '⭐', label: 'Baho berish', url: 'https://t.me/' },
    { icon: '📄', label: 'Foydalanish shartlari', url: 'https://t.me/' },
    { icon: '🛡', label: 'Maxfiylik siyosati', url: 'https://t.me/' },
  ]
  return (
    <main className="settings2">
      <header className="board__top">
        <button className="onb__back" onClick={onBack}><BackIcon /></button>
        <h1>Sozlamalar</h1>
        <span style={{ width: 38 }} />
      </header>
      <div className="settings2__scroll">
        <h2 className="you__h2">Ilova</h2>
        <div className="setgrp">
          <div className="setrow"><span>🌗 Tungi rejim</span><span className="setrow__val">Yoniq</span></div>
          <div className="setrow"><span>🌐 Til</span><span className="setrow__val">O‘zbekcha ›</span></div>
        </div>
        <h2 className="you__h2">Yordam</h2>
        <div className="setgrp">
          {links.map((l) => (
            <button className="setrow setrow--btn" key={l.label} onClick={() => openLink(l.url)}>
              <span>{l.icon} {l.label}</span><ChevronRight />
            </button>
          ))}
        </div>
        <button className="setout" onClick={() => { if (confirm('Chiqasizmi? Progress saqlanadi.')) onReset?.() }}>Chiqish</button>
        <button className="setdel" onClick={() => { if (confirm('Hisob o‘chirilsinmi? Bu qaytarib bo‘lmaydi.')) onReset?.() }}>🗑 Hisobni o‘chirish</button>
      </div>
    </main>
  )
}
