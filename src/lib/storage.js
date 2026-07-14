// Saqlash moduli.
// Telegram ichida — CloudStorage (qurilmalar aro sinxron), aks holda localStorage.

const tg = typeof window !== 'undefined' ? window?.Telegram?.WebApp : null
const cloud = tg?.CloudStorage
const KEY = 'sabo_state_v1'

function rawGet(key) {
  return new Promise((resolve) => {
    try {
      if (cloud?.getItem) {
        cloud.getItem(key, (err, val) => resolve(err ? null : val || null))
      } else {
        resolve(localStorage.getItem(key))
      }
    } catch {
      resolve(null)
    }
  })
}

function rawSet(key, value) {
  return new Promise((resolve) => {
    try {
      if (cloud?.setItem) {
        cloud.setItem(key, value, () => resolve())
      } else {
        localStorage.setItem(key, value)
        resolve()
      }
    } catch {
      resolve()
    }
  })
}

export const DEFAULT_STATE = {
  onboarded: false,
  profile: null,
  courseId: 'charisma', // joriy kurs
  progressByCourse: {}, // { courseId: tugatilgan darslar soni }
  saved: [], // saqlangan insights (bookmark)
  activeDays: [], // faol kunlar ['YYYY-MM-DD'] (kalendar uchun)
  xp: 0,
  streak: 0,
  lastActive: null, // ISO sana (streak hisobi uchun)
}

export async function loadState() {
  const raw = await rawGet(KEY)
  if (!raw) return { ...DEFAULT_STATE }
  try {
    return { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_STATE }
  }
}

export async function saveState(state) {
  await rawSet(KEY, JSON.stringify(state))
}

// Streak: bugun birinchi faollik bo'lsa oshiramiz; kun o'tkazib yuborilsa 1 dan boshlaymiz.
export function computeStreak(prevStreak, lastActive) {
  const today = new Date().toISOString().slice(0, 10)
  if (lastActive === today) return { streak: prevStreak, lastActive: today }
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  if (lastActive === yesterday) return { streak: prevStreak + 1, lastActive: today }
  return { streak: Math.max(1, prevStreak && lastActive ? 1 : 1), lastActive: today }
}
