import { libraryByCategory, COURSES } from '../../data/content'
import { SearchIcon, BookmarkIcon, FlameIcon, FreezeIcon, ClockIcon, CapIcon, SparkLogo } from '../icons'
import OptIcon from '../onboarding/OptIcon'

const BOT_USERNAME = import.meta.env.VITE_BOT_USERNAME || ''

/* ---------- Library ---------- */
export function Library({ onOpenCourse, currentId }) {
  const groups = libraryByCategory()
  return (
    <main className="lib">
      <header className="lib__top">
        <h1>Kutubxona</h1>
        <button className="lib__search" aria-label="Qidirish"><SearchIcon /></button>
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

/* ---------- Insights (saqlangan) ---------- */
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

/* ---------- You ---------- */
export function You({ telegram, stats: st = { xp: 0, streak: 0 }, progressByCourse = {}, onReset }) {
  const name = telegram?.user?.first_name || 'Foydalanuvchi'
  const totalDone = Object.values(progressByCourse).reduce((a, b) => a + b, 0)
  const stats = [
    { icon: <FlameIcon />, value: String(st.streak), label: 'Joriy streak', color: '#f5842a' },
    { icon: <FreezeIcon />, value: '1', label: 'Streak muzlatishlar', color: '#4a90e2' },
    { icon: <ClockIcon />, value: `${totalDone * 5} daq`, label: 'O‘rganilgan vaqt', color: '#9a8e84' },
    { icon: <CapIcon />, value: String(totalDone), label: 'Tugatilgan darslar', color: '#37d67a' },
  ]

  const invite = () => {
    telegram?.haptic?.('medium')
    const id = telegram?.user?.id || ''
    const link = BOT_USERNAME ? `https://t.me/${BOT_USERNAME}?start=ref${id}` : 'https://t.me/'
    const text = 'Sabo — AI muloqot murabbiyi bilan ijtimoiy ishonchni oshir! 🚀'
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`
    if (telegram?.tg?.openTelegramLink) telegram.tg.openTelegramLink(shareUrl)
    else window.open(shareUrl, '_blank')
  }

  return (
    <main className="you">
      <div className="you__scroll">
        <header className="you__head">
          <span className="you__avatar"><SparkLogo /></span>
          <div><b>{name}</b><small>Yangi Ovoz · {st.xp} XP</small></div>
        </header>

        <h2 className="you__h2">Statistikang</h2>
        <div className="you__stats">
          {stats.map((s) => (
            <div className="ycard" key={s.label}>
              <span className="ycard__icon" style={{ color: s.color }}>{s.icon}</span>
              <b>{s.value}</b><small>{s.label}</small>
            </div>
          ))}
        </div>

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

        {onReset && <button className="you__reset" onClick={onReset}>Progressni tozalash</button>}
      </div>
    </main>
  )
}
