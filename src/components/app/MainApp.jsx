import { useState } from 'react'
import { PATH_LESSONS, CURRENT_MODULE, COURSES } from '../../data/courses'
import { getLesson } from '../../data/lessons'
import { Library, Insights, You } from './screens'
import Lesson from '../lesson/Lesson'
import AiChat from './AiChat'
import OptIcon from '../onboarding/OptIcon'
import {
  SparkLogo,
  BoltIcon,
  FlameIcon,
  FreezeIcon,
  ListIcon,
  ChevronIcon,
  PlayIcon,
  LockIcon,
  CheckMark,
  HomeIcon,
  LibraryIcon,
  InsightsIcon,
  YouIcon,
  PlusIcon,
} from '../icons'

export default function MainApp({ telegram, state, onCompleteLesson, onReset }) {
  const { profile, progress, xp, streak } = state
  const stats = { xp, streak }
  const [tab, setTab] = useState('home')
  const [activeLesson, setActiveLesson] = useState(null) // dars indeksi yoki null
  const [aiChatOpen, setAiChatOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { haptic } = telegram

  const openAiChat = () => {
    haptic('medium')
    setAiChatOpen(true)
  }

  const go = (t) => {
    haptic('light')
    setTab(t)
  }

  const openLesson = (index) => {
    haptic('medium')
    setActiveLesson(index)
  }

  const completeLesson = (reward) => {
    onCompleteLesson(activeLesson, reward)
    setActiveLesson(null)
  }

  if (activeLesson !== null) {
    const l = PATH_LESSONS[activeLesson] || {}
    const lesson = getLesson(activeLesson, l.title)
    return (
      <div className="main">
        <Lesson
          lesson={lesson}
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
          <Home
            telegram={telegram}
            profile={profile}
            progress={progress}
            stats={stats}
            onOpenLesson={openLesson}
            onOpenDrawer={() => { haptic('light'); setDrawerOpen(true) }}
          />
        )}
        {tab === 'library' && <Library />}
        {tab === 'insights' && <Insights />}
        {tab === 'you' && <You telegram={telegram} stats={stats} progress={progress} onReset={onReset} />}
      </div>

      <TabBar tab={tab} go={go} onCenter={openAiChat} />

      <CourseDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} progress={progress} />
    </div>
  )
}

function CourseDrawer({ open, onClose, progress }) {
  const current = COURSES.find((c) => c.current) || COURSES[0]
  const others = COURSES.filter((c) => !c.current)
  return (
    <div className={`drawer ${open ? 'drawer--open' : ''}`} aria-hidden={!open}>
      <div className="drawer__backdrop" onClick={onClose} />
      <aside className="drawer__panel">
        <h3 className="drawer__label">JORIY KURS</h3>
        <div className="dcourse dcourse--current">
          <span className="dcourse__icon" style={{ color: current.color }}><OptIcon name={current.icon} /></span>
          <div className="dcourse__text">
            <b>{current.title}</b>
            <div className="dcourse__bar"><div style={{ width: `${(progress / current.total) * 100}%` }} /></div>
            <small>{current.total} darsdan {progress} tasi bajarildi</small>
          </div>
        </div>

        <h3 className="drawer__label">YANGI KURSLAR</h3>
        <div className="drawer__list">
          {others.map((c) => (
            <button className="dcourse" key={c.title}>
              <span className="dcourse__icon" style={{ color: c.color }}><OptIcon name={c.icon} /></span>
              <b>{c.title}</b>
              <small>{c.done}/{c.total}</small>
            </button>
          ))}
        </div>
      </aside>
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

function Home({ telegram, profile, progress, stats, onOpenLesson, onOpenDrawer }) {
  const { haptic } = telegram

  return (
    <main className="home2">
      <header className="home2__top">
        <div className="home2__brand">
          <SparkLogo />
          <span>Sabo</span>
        </div>
        <div className="home2__stats">
          <span className="hstat" style={{ color: '#f0b400' }}><BoltIcon /> {stats.xp}</span>
          <span className="hstat" style={{ color: '#f5842a' }}><FlameIcon /> {stats.streak}</span>
          <span className="hstat" style={{ color: '#a06bff' }}><FreezeIcon /> 1</span>
        </div>
      </header>

      <div className="home2__scroll">
        <div className="modcard">
          <div>
            <span className="modcard__label">{CURRENT_MODULE.label}</span>
            <span className="modcard__title">{CURRENT_MODULE.title}</span>
          </div>
          <div className="modcard__ring" style={{ background: `conic-gradient(var(--orange) ${(progress / PATH_LESSONS.length) * 100}%, #3a2e27 0)` }} />
        </div>

        <div className="npath">
          {PATH_LESSONS.map((l, i) => {
            const status = statusFor(i, progress)
            return (
              <div className={`npath__row ${i % 2 ? 'npath__row--r' : 'npath__row--l'}`} key={l.id}>
                <div className="npath__node">
                  {status === 'current' && <div className="npath__here">Siz shu yerdasiz</div>}
                  <HexNode status={status} onClick={() => onOpenLesson(i)} />
                </div>
                <p className={`npath__title ${status === 'locked' ? 'is-locked' : ''}`}>{l.title}</p>
                {i < PATH_LESSONS.length - 1 && <span className={`npath__dots ${i % 2 ? 'r' : 'l'}`} />}
              </div>
            )
          })}
        </div>
      </div>

      <div className="home2__cta">
        <button className="home2__list" onClick={onOpenDrawer} aria-label="Kurslar"><ListIcon /></button>
        <button className="home2__next" onClick={() => onOpenLesson(progress)}>
          {progress === 0 ? 'Boshlash' : 'Keyingi dars'} <ChevronIcon />
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
          <button key="center" className="tabbar2__center" onClick={onCenter} aria-label="Tezkor mashq">
            <PlusIcon />
          </button>
        ) : (
          <button key={it.id} className={`tab2 ${tab === it.id ? 'tab2--on' : ''}`} onClick={() => go(it.id)}>
            {it.icon}
            <span>{it.label}</span>
          </button>
        )
      )}
    </nav>
  )
}
