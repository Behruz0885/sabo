import { useState } from 'react'
import { COURSES, getCourse } from '../../data/content'
import { Library, Insights, You } from './screens'
import Lesson from '../lesson/Lesson'
import AiChat from './AiChat'
import OptIcon from '../onboarding/OptIcon'
import {
  SparkLogo, BoltIcon, FlameIcon, FreezeIcon, ListIcon, ChevronIcon,
  PlayIcon, LockIcon, CheckMark, HomeIcon, LibraryIcon, InsightsIcon, YouIcon, PlusIcon,
} from '../icons'

export default function MainApp({ telegram, state, onCompleteLesson, onSetCourse, onToggleSave, onReset }) {
  const { profile, courseId, progressByCourse = {}, saved = [], xp, streak } = state
  const stats = { xp, streak }
  const course = getCourse(courseId)
  const progress = progressByCourse[courseId] || 0

  const [tab, setTab] = useState('home')
  const [activeLesson, setActiveLesson] = useState(null)
  const [aiChatOpen, setAiChatOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { haptic } = telegram

  const go = (t) => { haptic('light'); setTab(t) }
  const openAiChat = () => { haptic('medium'); setAiChatOpen(true) }
  const openLesson = (index) => {
    if (index >= course.lessons.length) return
    haptic('medium')
    setActiveLesson(index)
  }
  const completeLesson = (reward) => {
    onCompleteLesson(courseId, activeLesson, reward)
    setActiveLesson(null)
  }
  const chooseCourse = (id) => {
    onSetCourse(id)
    setDrawerOpen(false)
    setTab('home')
  }

  if (activeLesson !== null) {
    const lesson = course.lessons[activeLesson]
    return (
      <div className="main">
        <Lesson
          lesson={lesson}
          course={course}
          lessonIndex={activeLesson}
          saved={saved}
          onToggleSave={onToggleSave}
          telegram={telegram}
          onComplete={completeLesson}
          onClose={() => setActiveLesson(null)}
        />
      </div>
    )
  }

  if (aiChatOpen) {
    return (
      <div className="main">
        <AiChat telegram={telegram} onClose={() => setAiChatOpen(false)} />
      </div>
    )
  }

  return (
    <div className="main">
      <div className="main__screen">
        {tab === 'home' && (
          <Home telegram={telegram} course={course} progress={progress} stats={stats}
            onOpenLesson={openLesson} onOpenDrawer={() => { haptic('light'); setDrawerOpen(true) }} />
        )}
        {tab === 'library' && <Library onOpenCourse={chooseCourse} currentId={courseId} />}
        {tab === 'insights' && <Insights saved={saved} onRemove={onToggleSave} />}
        {tab === 'you' && <You telegram={telegram} stats={stats} progressByCourse={progressByCourse} onReset={onReset} />}
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
