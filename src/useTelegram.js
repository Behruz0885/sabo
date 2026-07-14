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

    // To'liq ekran (Bot API 8.0+), mavjud bo'lsa
    try {
      webApp.requestFullscreen?.()
      webApp.disableVerticalSwipes?.()
      webApp.setHeaderColor?.('#140f0c')
      webApp.setBackgroundColor?.('#140f0c')
    } catch {
      /* eski versiyalarda mavjud emas */
    }

    // Xavfsiz zona: Telegram fullscreen'da Close/menu tugmalari kontentni tosib qo'ymasligi uchun
    const applyInsets = () => {
      const sa = webApp.safeAreaInset || {}
      const csa = webApp.contentSafeAreaInset || {}
      let top = (sa.top || 0) + (csa.top || 0)
      let bottom = (sa.bottom || 0) + (csa.bottom || 0)

      // Fullscreen'da insetlar hali kelmagan bo'lsa — zaxira minimal offset
      if (webApp.isFullscreen && top < 50) {
        top = Math.max((sa.top || 0) + 62, 96)
      }

      const root = document.documentElement.style
      root.setProperty('--safe-top', `${Math.max(top, 0)}px`)
      root.setProperty('--safe-bottom', `${Math.max(bottom, 0)}px`)
    }
    applyInsets()
    // Insetlar kechroq kelishi mumkin — bir necha marta qayta o'qiymiz
    ;[100, 300, 600, 1200].forEach((ms) => setTimeout(applyInsets, ms))
    try {
      webApp.onEvent?.('safeAreaChanged', applyInsets)
      webApp.onEvent?.('contentSafeAreaChanged', applyInsets)
      webApp.onEvent?.('fullscreenChanged', applyInsets)
      webApp.onEvent?.('viewportChanged', applyInsets)
    } catch {
      /* mavjud emas */
    }

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
