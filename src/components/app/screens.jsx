import { LIBRARY, COURSES } from '../../data/courses'
import { SearchIcon, BookmarkIcon, FlameIcon, FreezeIcon, ClockIcon, CapIcon, SparkLogo } from '../icons'
import OptIcon from '../onboarding/OptIcon'

/* ---------- Library ---------- */
export function Library() {
  return (
    <main className="lib">
      <header className="lib__top">
        <h1>Kutubxona</h1>
        <button className="lib__search" aria-label="Qidirish"><SearchIcon /></button>
      </header>
      <div className="lib__scroll">
        {LIBRARY.map((cat) => (
          <section className="lib__cat" key={cat.category}>
            <h2>{cat.category}</h2>
            <div className="lib__grid">
              {cat.courses.map((c) => (
                <button className="course" key={c.title}>
                  <span
                    className={`course__cover ${c.image ? 'course__cover--img' : ''}`}
                    style={{ background: c.tint }}
                  >
                    {c.image && '🌱'}
                  </span>
                  <b>{c.title}</b>
                  <small>{c.lessons} dars</small>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}

/* ---------- Insights ---------- */
export function Insights() {
  return (
    <main className="ins">
      <header className="ins__top"><h1>Tahlil</h1></header>
      <div className="ins__empty">
        <span className="ins__icon"><BookmarkIcon /></span>
        <b>Hali saqlangan g‘oyalar yo‘q</b>
        <p>Dars davomida ma’lumot slaydlaridagi saqlash belgisini bosib, keyin qaytadigan g‘oyalarni belgilab qo‘y.</p>
      </div>
    </main>
  )
}

/* ---------- You ---------- */
export function You({ telegram, stats: st = { xp: 0, streak: 0 }, progress = 0, onReset }) {
  const name = telegram?.user?.first_name || 'Foydalanuvchi'
  const stats = [
    { icon: <FlameIcon />, value: String(st.streak), label: 'Joriy streak', color: '#f5842a' },
    { icon: <FreezeIcon />, value: '1', label: 'Streak muzlatishlar', color: '#4a90e2' },
    { icon: <ClockIcon />, value: `${progress * 5} daq`, label: 'O‘rganilgan vaqt', color: '#9a8e84' },
    { icon: <CapIcon />, value: String(progress), label: 'Tugatilgan darslar', color: '#37d67a' },
  ]
  return (
    <main className="you">
      <div className="you__scroll">
        <header className="you__head">
          <span className="you__avatar"><SparkLogo /></span>
          <div>
            <b>{name}</b>
            <small>Yangi Ovoz · {st.xp} XP</small>
          </div>
        </header>

        <h2 className="you__h2">Statistikang</h2>
        <div className="you__stats">
          {stats.map((s) => (
            <div className="ycard" key={s.label}>
              <span className="ycard__icon" style={{ color: s.color }}>{s.icon}</span>
              <b>{s.value}</b>
              <small>{s.label}</small>
            </div>
          ))}
        </div>

        <h2 className="you__h2">Kurslarim</h2>
        <div className="you__courses">
          {COURSES.map((c) => (
            <div className={`ycourse ${c.current ? 'ycourse--on' : ''}`} key={c.title}>
              <span className="ycourse__icon" style={{ color: c.color }}><OptIcon name={c.icon} /></span>
              <div className="ycourse__text">
                <b>{c.title}</b>
                <div className="ycourse__bar"><div style={{ width: `${(c.done / c.total) * 100}%` }} /></div>
              </div>
              <small>{c.done}/{c.total}</small>
            </div>
          ))}
        </div>

        <div className="premium">
          <b>Premium’ga o‘ting</b>
          <p>Cheksiz mashq, shaxsiy AI feedback va tezroq o‘sish bilan ko‘nikmalaringni yuksaltiring.</p>
          <button className="btn-primary">✨ Premium’ga o‘tish</button>
        </div>

        {onReset && (
          <button className="you__reset" onClick={onReset}>Progressni tozalash</button>
        )}
      </div>
    </main>
  )
}
