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
