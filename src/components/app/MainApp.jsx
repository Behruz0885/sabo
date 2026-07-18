import { useState } from 'react'
import { COURSES, getCourse, COURSE_SUBTITLE, lessonMinutes } from '../../data/content'
import { Library, Insights, You, Leaderboard, Settings } from './screens'
import Lesson from '../lesson/Lesson'
import AiChat from './AiChat'
import OptIcon from '../onboarding/OptIcon'
import {
  SparkLogo, BoltIcon, FlameIcon, FreezeIcon, ListIcon, ChevronIcon, BackIcon,
  PlayIcon, LockIcon, CheckMark, HomeIcon, LibraryIcon, InsightsIcon, YouIcon, PlusIcon, ClockIcon,
} from '../icons'

export default function MainApp({ telegram, state, onCompleteLesson, onSetCourse, onToggleSave, onReset }) {
  const { courseId, progressByCourse = {}, saved = [], xp, streak } = state
  const stats = { xp, streak }
  const course = getCourse(courseId)
  const progress = progressByCourse[courseId] || 0

  const [tab, setTab] = useState('home')
  const [activeLesson, setActiveLesson] = useState(null) // { courseId, index }
  const [detailId, setDetailId] = useState(null) // kurs sahifasi
  const [aiChatOpen, setAiChatOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [subScreen, setSubScreen] = useState(null) // 'settings' | 'leaderboard'
  const { haptic } = telegram

  const go = (t) => { haptic('light'); setTab(t) }
  const openAiChat = () => { haptic('medium'); setAiChatOpen(true) }

  const openLesson = (cid, index) => {
    const c = getCourse(cid)
    if (index >= c.lessons.length) return
    haptic('medium')
    setActiveLesson({ courseId: cid, index })
  }
  const completeLesson = (reward) => {
    onCompleteLesson(activeLesson.courseId, activeLesson.index, reward)
    setActiveLesson(null)
  }
  const openCourseDetail = (id) => { haptic('light'); setDetailId(id) }
  const startFromDetail = (id, index) => {
    onSetCourse(id)
    setDetailId(null)
    openLesson(id, index)
  }
  const chooseCourse = (id) => { onSetCourse(id); setDrawerOpen(false); setTab('home') }
  const openSettings = () => { haptic('light'); setSubScreen('settings') }
  const openLeaderboard = () => { haptic('light'); setSubScreen('leaderboard') }

  /* ---- To'liq ekranli qatlamlar ---- */
  if (activeLesson) {
    const c = getCourse(activeLesson.courseId)
    const lesson = c.lessons[activeLesson.index]
    return (
      <div className="main">
        <Lesson lesson={lesson} course={c} lessonIndex={activeLesson.index}
          saved={saved} onToggleSave={onToggleSave} telegram={telegram}
          onComplete={completeLesson} onClose={() => setActiveLesson(null)} />
      </div>
    )
  }
  if (aiChatOpen) return <div className="main"><AiChat telegram={telegram} state={state} onClose={() => setAiChatOpen(false)} /></div>
  if (subScreen === 'settings') return <div className="main"><Settings telegram={telegram} onReset={onReset} onBack={() => setSubScreen(null)} /></div>
  if (subScreen === 'leaderboard') return <div className="main"><Leaderboard telegram={telegram} xp={xp} onBack={() => setSubScreen(null)} /></div>
  if (detailId) {
    return (
      <div className="main">
        <CourseDetail course={getCourse(detailId)} progress={progressByCourse[detailId] || 0}
          onBack={() => setDetailId(null)} onOpenLesson={(i) => startFromDetail(detailId, i)} />
      </div>
    )
  }

  return (
    <div className="main">
      <div className="main__screen">
        {tab === 'home' && (
          <Home telegram={telegram} course={course} progress={progress} stats={stats}
            onOpenLesson={(i) => openLesson(courseId, i)} onOpenDrawer={() => { haptic('light'); setDrawerOpen(true) }} />
        )}
        {tab === 'library' && <Library onOpenCourse={openCourseDetail} currentId={courseId} onOpenSettings={openSettings} />}
        {tab === 'insights' && <Insights saved={saved} onRemove={onToggleSave} />}
        {tab === 'you' && (
          <You telegram={telegram} stats={stats} progressByCourse={progressByCourse}
            activeDays={state.activeDays || []} onReset={onReset}
            onOpenSettings={openSettings} onOpenLeaderboard={openLeaderboard} />
        )}
      </div>

      <TabBar tab={tab} go={go} onCenter={openAiChat} />
      <CourseDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}
        progressByCourse={progressByCourse} currentId={courseId} onChoose={chooseCourse} />
    </div>
  )
}

function statusFor(index, progress) {
  if (index < progress) return 'done'
  if (index === progress) return 'current'
  return 'locked'
}

function HexNode({ status, onClick }) {
  const clickable = status !== 'locked'
  return (
    <button className={`nhex nhex--${status} ${clickable ? 'is-clickable' : ''}`} onClick={clickable ? onClick : undefined}>
      <div className="nhex__face">
        {status === 'done' && <CheckMark />}
        {status === 'current' && <PlayIcon />}
        {status === 'locked' && <LockIcon />}
      </div>
    </button>
  )
}

function Home({ telegram, course, progress, stats, onOpenLesson, onOpenDrawer }) {
  const total = course.lessons.length
  return (
    <main className="home2">
      <header className="home2__top">
        <div className="home2__brand"><SparkLogo /><span>Sabo</span></div>
        <div className="home2__stats">
          <span className="hstat" style={{ color: '#f0b400' }}><BoltIcon /> {stats.xp}</span>
          <span className="hstat" style={{ color: '#f5842a' }}><FlameIcon /> {stats.streak}</span>
          <span className="hstat" style={{ color: '#a06bff' }}><FreezeIcon /> 1</span>
        </div>
      </header>
      <div className="home2__scroll">
        <div className="modcard">
          <div>
            <span className="modcard__label">{course.category}</span>
            <span className="modcard__title">{course.title}</span>
          </div>
          <div className="modcard__ring" style={{ background: `conic-gradient(var(--orange) ${(progress / total) * 100}%, #3a2e27 0)` }} />
        </div>
        <div className="npath">
          {course.lessons.map((l, i) => {
            const status = statusFor(i, progress)
            return (
              <div className={`npath__row ${i % 2 ? 'npath__row--r' : 'npath__row--l'}`} key={i}>
                <div className="npath__node">
                  {status === 'current' && <div className="npath__here">Siz shu yerdasiz</div>}
                  <HexNode status={status} onClick={() => onOpenLesson(i)} />
                </div>
                <p className={`npath__title ${status === 'locked' ? 'is-locked' : ''}`}>{l.title}</p>
                {i < total - 1 && <span className={`npath__dots ${i % 2 ? 'r' : 'l'}`} />}
              </div>
            )
          })}
        </div>
      </div>
      <div className="home2__cta">
        <button className="home2__list" onClick={onOpenDrawer} aria-label="Kurslar"><ListIcon /></button>
        <button className="home2__next" onClick={() => onOpenLesson(progress)}>
          {progress === 0 ? 'Boshlash' : progress >= total ? 'Yakunlangan' : 'Keyingi dars'} <ChevronIcon />
        </button>
      </div>
    </main>
  )
}

/* ---- Kurs sahifasi (detail) ---- */
function CourseDetail({ course, progress, onBack, onOpenLesson }) {
  const total = course.lessons.length
  const pct = Math.round((progress / total) * 100)
  return (
    <main className="cdetail">
      <div className="cdetail__hero" style={{ background: `linear-gradient(160deg, ${course.color}55, #1a120d)` }}>
        <button className="cdetail__back" onClick={onBack} aria-label="Orqaga"><BackIcon /></button>
        <span className="cdetail__heroicon" style={{ color: course.color }}><OptIcon name={course.icon} /></span>
      </div>
      <div className="cdetail__body">
        <h1 className="cdetail__title">{course.title}</h1>
        <p className="cdetail__sub">{COURSE_SUBTITLE[course.id] || course.category}</p>
        <div className="cdetail__bar"><div style={{ width: `${pct}%` }} /><span>{pct}%</span></div>
        <button className="btn-primary" onClick={() => onOpenLesson(Math.min(progress, total - 1))}>
          {progress === 0 ? 'Boshlash' : progress >= total ? 'Takrorlash' : 'Davom etish'}
        </button>

        <div className="ctimeline">
          {course.lessons.map((l, i) => {
            const status = statusFor(i, progress)
            const locked = status === 'locked'
            return (
              <button key={i} className={`titem titem--${status}`} disabled={locked} onClick={() => onOpenLesson(i)}>
                <span className="titem__marker">
                  {status === 'done' ? <CheckMark /> : status === 'current' ? '' : <LockIcon />}
                </span>
                <div className="titem__card">
                  <div className="titem__top">
                    <b>{l.title}</b>
                    <span className="titem__min"><ClockIcon /> {lessonMinutes(l)}M</span>
                  </div>
                  <p>{l.concepts[0]?.heading}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </main>
  )
}

function TabBar({ tab, go, onCenter }) {
  const items = [
    { id: 'home', label: 'Bosh', icon: <HomeIcon /> },
    { id: 'library', label: 'Kutubxona', icon: <LibraryIcon /> },
    { id: 'center' },
    { id: 'insights', label: 'Tahlil', icon: <InsightsIcon /> },
    { id: 'you', label: 'Siz', icon: <YouIcon /> },
  ]
  return (
    <nav className="tabbar2">
      {items.map((it) =>
        it.id === 'center' ? (
          <button key="center" className="tabbar2__center" onClick={onCenter} aria-label="AI murabbiy"><PlusIcon /></button>
        ) : (
          <button key={it.id} className={`tab2 ${tab === it.id ? 'tab2--on' : ''}`} onClick={() => go(it.id)}>
            {it.icon}<span>{it.label}</span>
          </button>
        )
      )}
    </nav>
  )
}

function CourseDrawer({ open, onClose, progressByCourse, currentId, onChoose }) {
  const current = COURSES.find((c) => c.id === currentId) || COURSES[0]
  const others = COURSES.filter((c) => c.id !== currentId)
  const done = (c) => progressByCourse[c.id] || 0
  return (
    <div className={`drawer ${open ? 'drawer--open' : ''}`} aria-hidden={!open}>
      <div className="drawer__backdrop" onClick={onClose} />
      <aside className="drawer__panel">
        <h3 className="drawer__label">JORIY KURS</h3>
        <div className="dcourse dcourse--current">
          <span className="dcourse__icon" style={{ color: current.color }}><OptIcon name={current.icon} /></span>
          <div className="dcourse__text">
            <b>{current.title}</b>
            <div className="dcourse__bar"><div style={{ width: `${(done(current) / current.lessons.length) * 100}%` }} /></div>
            <small>{current.lessons.length} darsdan {done(current)} tasi bajarildi</small>
          </div>
        </div>
        <h3 className="drawer__label">BOSHQA KURSLAR</h3>
        <div className="drawer__list">
          {others.map((c) => (
            <button className="dcourse" key={c.id} onClick={() => onChoose(c.id)}>
              <span className="dcourse__icon" style={{ color: c.color }}><OptIcon name={c.icon} /></span>
              <b>{c.title}</b>
              <small>{done(c)}/{c.lessons.length}</small>
            </button>
          ))}
        </div>
      </aside>
    </div>
  )
}
