// Foydalanuvchi ro'yxatga olish va admin API (frontend).
const API = import.meta.env.VITE_API_URL || ''
const initData = typeof window !== 'undefined' ? window?.Telegram?.WebApp?.initData || '' : ''

export async function registerUser(user) {
  if (!API || !user?.id) return
  try {
    await fetch(`${API}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData, user }),
    })
  } catch {
    /* jim */
  }
}

export async function reportProgress(user, stats) {
  if (!API || !user?.id) return
  try {
    await fetch(`${API}/api/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData, user, stats }),
    })
  } catch {
    /* jim */
  }
}

export async function adminBroadcast(key, payload) {
  const res = await fetch(`${API}/api/admin/broadcast`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Key': key },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Yuborilmadi')
  return res.json()
}

export async function fetchHealth() {
  if (!API) return null
  try {
    const res = await fetch(`${API}/health`)
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function adminAnalyzeUser(key, user) {
  const res = await fetch(`${API}/api/admin/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Key': key },
    body: JSON.stringify({ user }),
  })
  if (!res.ok) throw new Error('AI tahlil olinmadi')
  return (await res.json()).analysis
}

export async function fetchBroadcasts(key) {
  const res = await fetch(`${API}/api/admin/broadcasts`, { headers: { 'X-Admin-Key': key } })
  if (!res.ok) throw new Error('Tarix olinmadi')
  return (await res.json()).items || []
}

export async function adminUserAction(key, id, action) {
  const res = await fetch(`${API}/api/admin/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Key': key },
    body: JSON.stringify({ id, action }),
  })
  if (!res.ok) throw new Error('Amal bajarilmadi')
  return res.json()
}

export async function fetchUsers(key) {
  if (!API) throw new Error('API manzili yo‘q')
  const res = await fetch(`${API}/api/admin/users`, { headers: { 'X-Admin-Key': key } })
  if (res.status === 401) throw new Error('Noto‘g‘ri parol')
  if (!res.ok) throw new Error('Server xatosi')
  return (await res.json()).users || []
}

export function isAdminRoute() {
  if (typeof window === 'undefined') return false
  const path = window.location.pathname.replace(/\/+$/, '').split('/').pop()
  return path === 'behruz620' || window.location.hash.includes('behruz620')
}
