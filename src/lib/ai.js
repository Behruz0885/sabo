// AI moduli (Sabo). Faqat backend (real AI) orqali ishlaydi.
// Backend ulanmagan yoki xato bo'lsa — xatolik qaytaradi (tasodifiy javob yo'q).

const API = import.meta.env.VITE_API_URL || ''
const initData = typeof window !== 'undefined' ? window?.Telegram?.WebApp?.initData || '' : ''

async function callBackend(path, body) {
  if (!API) throw new Error('AI hozircha ulanmagan')
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Init-Data': initData },
    body: JSON.stringify({ ...body, initData }),
  })
  if (!res.ok) throw new Error(`AI xatosi (${res.status})`)
  return res.json()
}

// Rol-o'yin suhbatida AI javobi
export async function getReply(history, practice) {
  const { reply } = await callBackend('/api/reply', { history, practice })
  if (!reply) throw new Error('AI bo‘sh javob qaytardi')
  return reply
}

// AI murabbiy chati
export async function getCoachReply(history) {
  const { reply } = await callBackend('/api/chat', { history })
  if (!reply) throw new Error('AI bo‘sh javob qaytardi')
  return reply
}

// Suhbat yakunidagi feedback
export async function getFeedback(history, practice) {
  const fb = await callBackend('/api/feedback', { history, practice })
  if (!fb || typeof fb.overall !== 'number') throw new Error('AI feedback qaytarmadi')
  return fb
}
