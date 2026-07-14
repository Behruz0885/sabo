import { useEffect, useState } from 'react'

/**
 * Telegram Mini App (WebApp) SDK bilan ishlash uchun hook.
 * Telegram ichida ochilganda real ma'lumot, brauzerda ochilganda
 * xavfsiz "fallback" qiymatlar qaytaradi.
 */
export function useTelegram() {
  const [tg, setTg] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const webApp = window?.Telegram?.WebApp
    if (!webApp) return

    // Telegram'ga ilova tayyor ekanini bildiramiz
    webApp.ready()
    webApp.expand()

    setTg(webApp)
    setUser(webApp.initDataUnsafe?.user ?? null)
  }, [])

  const haptic = (type = 'light') => {
    try {
      tg?.HapticFeedback?.impactOccurred(type)
    } catch {
      /* brauzerda mavjud emas */
    }
  }

  return { tg, user, haptic, isTelegram: Boolean(tg) }
}
