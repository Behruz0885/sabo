import { useState, useEffect, useRef } from 'react'
import { useTelegram } from './useTelegram'
import Landing from './components/Landing'
import Onboarding from './components/onboarding/Onboarding'
import MainApp from './components/app/MainApp'
import { loadState, saveState, DEFAULT_STATE, computeStreak } from './lib/storage'
import { registerUser, reportProgress, isAdminRoute } from './lib/users'
import { pickCourseId } from './data/content'
import Admin from './components/Admin'
import './App.css'

export default function App() {
  const telegram = useTelegram()
  const [screen, setScreen] = useState('loading')
  const [state, setState] = useState(DEFAULT_STATE)
  const loaded = useRef(false)
  const admin = isAdminRoute()

  // Telegram foydalanuvchisini backendga ro'yxatga olamiz
  useEffect(() => {
    if (telegram?.user) registerUser(telegram.user)
  }, [telegram?.user])

  // Progressni backendga sinxronlaymiz (admin panelda ko'rinishi uchun)
  useEffect(() => {
    if (loaded.current && telegram?.user && state.onboarded) {
      const total = Object.values(state.progressByCourse || {}).reduce((a, b) => a + b, 0)
      reportProgress(telegram.user, { xp: state.xp, streak: state.streak, progress: total })
    }
  }, [state.xp, state.streak, state.progressByCourse, state.onboarded, telegram?.user])

  // Boshlanishida saqlangan holatni yuklaymiz
  useEffect(() => {
    loadState().then((s) => {
      setState(s)
      setScreen(s.onboarded ? 'app' : 'welcome')
      loaded.current = true
    })
  }, [])

  // Har o'zgarishda saqlaymiz (yuklangandan keyin)
  useEffect(() => {
    if (loaded.current) saveState(state)
  }, [state])

  const finishOnboarding = (answers) => {
    setState((s) => ({ ...s, onboarded: true, profile: answers, courseId: pickCourseId(answers) }))
    setScreen('app')
  }

  // Dars tugaganda: kurs progressi, XP, streak yangilanadi
  const completeLesson = (courseId, lessonIndex, reward) => {
    setState((s) => {
      const { streak, lastActive } = computeStreak(s.streak, s.lastActive)
      const cur = s.progressByCourse?.[courseId] || 0
      const today = new Date().toISOString().slice(0, 10)
      const activeDays = s.activeDays?.includes(today) ? s.activeDays : [...(s.activeDays || []), today]
      return {
        ...s,
        progressByCourse: { ...s.progressByCourse, [courseId]: Math.max(cur, lessonIndex + 1) },
        activeDays,
        xp: s.xp + reward,
        streak,
        lastActive,
      }
    })
  }

  const setCourse = (courseId) => setState((s) => ({ ...s, courseId }))

  const toggleSave = (item) => {
    setState((s) => {
      const exists = s.saved?.some((x) => x.id === item.id)
      return { ...s, saved: exists ? s.saved.filter((x) => x.id !== item.id) : [item, ...(s.saved || [])] }
    })
  }

  const resetAll = () => {
    setState({ ...DEFAULT_STATE })
    setScreen('welcome')
  }

  if (admin) return <Admin />

  if (screen === 'loading') {
    return (
      <div className="app-frame">
        <div className="boot"><div className="transition__loader" /></div>
      </div>
    )
  }

  return (
    <div className="app-frame">
      {screen === 'welcome' && <Landing telegram={telegram} onStart={() => setScreen('onboarding')} />}

      {screen === 'onboarding' && (
        <Onboarding telegram={telegram} onFinish={finishOnboarding} onExit={() => setScreen('welcome')} />
      )}

      {screen === 'app' && (
        <MainApp
          telegram={telegram}
          state={state}
          onCompleteLesson={completeLesson}
          onSetCourse={setCourse}
          onToggleSave={toggleSave}
          onReset={resetAll}
        />
      )}
    </div>
  )
}
