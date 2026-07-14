import { useState, useEffect, useRef } from 'react'
import { useTelegram } from './useTelegram'
import Landing from './components/Landing'
import Onboarding from './components/onboarding/Onboarding'
import MainApp from './components/app/MainApp'
import { loadState, saveState, DEFAULT_STATE, computeStreak } from './lib/storage'
import { registerUser, reportProgress, isAdminRoute } from './lib/users'
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
      reportProgress(telegram.user, { xp: state.xp, streak: state.streak, progress: state.progress })
    }
  }, [state.xp, state.streak, state.progress, state.onboarded, telegram?.user])

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
    setState((s) => ({ ...s, onboarded: true, profile: answers }))
    setScreen('app')
  }

  // Dars tugaganda: progress, XP, streak yangilanadi
  const completeLesson = (lessonIndex, reward) => {
    setState((s) => {
      const { streak, lastActive } = computeStreak(s.streak, s.lastActive)
      return {
        ...s,
        progress: Math.max(s.progress, lessonIndex + 1),
        xp: s.xp + reward,
        streak,
        lastActive,
      }
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
          onReset={resetAll}
        />
      )}
    </div>
  )
}
