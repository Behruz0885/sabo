// Telegram kanalini "baza" sifatida ishlatish.
// - Har o'zgarishda foydalanuvchilar bazasini .js fayl ko'rinishida kanalga yuboradi/yangilaydi.
// - Xabarni pin qiladi; qayta ishga tushganda pin qilingan fayldan bazani tiklaydi.
//
// Talab: bot kanalda ADMIN bo'lishi kerak (Post, Edit, Pin ruxsatlari bilan).

const TOKEN = process.env.BOT_TOKEN
const CHANNEL = process.env.DB_CHANNEL_ID
const BASE = TOKEN ? `https://api.telegram.org/bot${TOKEN}` : ''

let messageId = null
let timer = null
let pending = null

export function enabled() {
  return Boolean(TOKEN && CHANNEL)
}

function toJsFile(data) {
  return (
    `// Sabo — foydalanuvchilar bazasi\n` +
    `// Yangilandi: ${new Date().toISOString()}\n` +
    `// Jami: ${data.length}\n` +
    `module.exports = ${JSON.stringify(data, null, 2)};\n`
  )
}

async function api(method, params) {
  const res = await fetch(`${BASE}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  return res.json()
}

async function sendDoc(content) {
  const form = new FormData()
  form.append('chat_id', CHANNEL)
  form.append('caption', `🗃 Sabo bazasi · ${new Date().toLocaleString('uz-UZ')}`)
  form.append('document', new Blob([content], { type: 'application/javascript' }), 'sabo-users.js')
  const res = await fetch(`${BASE}/sendDocument`, { method: 'POST', body: form })
  const j = await res.json()
  if (!j.ok) throw new Error(j.description)
  return j.result.message_id
}

async function editDoc(content) {
  const form = new FormData()
  form.append('chat_id', CHANNEL)
  form.append('message_id', String(messageId))
  form.append(
    'media',
    JSON.stringify({ type: 'document', media: 'attach://file', caption: `🗃 Sabo bazasi · ${new Date().toLocaleString('uz-UZ')}` })
  )
  form.append('file', new Blob([content], { type: 'application/javascript' }), 'sabo-users.js')
  const res = await fetch(`${BASE}/editMessageMedia`, { method: 'POST', body: form })
  const j = await res.json()
  if (!j.ok) throw new Error(j.description)
}

async function flush() {
  timer = null
  const data = pending
  pending = null
  if (!enabled() || !data) return
  const content = toJsFile(data)
  try {
    if (messageId) {
      await editDoc(content)
    } else {
      messageId = await sendDoc(content)
      await api('pinChatMessage', { chat_id: CHANNEL, message_id: messageId, disable_notification: true })
    }
    console.log(`🗃 Baza kanalga saqlandi (${data.length} ta)`)
  } catch (e) {
    console.error('tgdb saqlash xatosi:', e.message)
    messageId = null // keyingi safar qaytadan yuboradi
  }
}

// Debounce — tez-tez yuborishning oldini oladi
export function scheduleBackup(data) {
  if (!enabled()) return
  pending = data
  if (timer) clearTimeout(timer)
  timer = setTimeout(flush, 10000)
}

// Kanaldagi pin qilingan .js fayldan bazani tiklash
export async function restore() {
  if (!enabled()) return null
  try {
    const chat = await api('getChat', { chat_id: CHANNEL })
    const fileId = chat.result?.pinned_message?.document?.file_id
    if (!fileId) return null
    const f = await api('getFile', { file_id: fileId })
    const path = f.result?.file_path
    if (!path) return null
    const res = await fetch(`https://api.telegram.org/file/bot${TOKEN}/${path}`)
    const text = await res.text()
    const json = text.slice(text.indexOf('=') + 1).trim().replace(/;+\s*$/, '')
    const arr = JSON.parse(json)
    return Array.isArray(arr) ? arr : null
  } catch (e) {
    console.error('tgdb tiklash xatosi:', e.message)
    return null
  }
}
