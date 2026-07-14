import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import crypto from 'crypto'
import { chat, hasKey, provider } from './llm.js'
import { upsertUser, updateProgress, setBlocked, removeUser, listUsers, initUsers } from './users.js'
import { addBroadcast, listBroadcasts } from './broadcasts.js'

const app = express()
app.use(express.json({ limit: '256kb' }))

const ORIGIN = process.env.ALLOWED_ORIGIN || '*'
app.use(cors({ origin: ORIGIN }))

const PORT = process.env.PORT || 8787
const BOT_TOKEN = process.env.BOT_TOKEN // initData tekshiruvi uchun (ixtiyoriy)

/* ---- Telegram initData tekshiruvi (ixtiyoriy, xavfsizlik) ---- */
function verifyInitData(initData) {
  if (!BOT_TOKEN || !initData) return true // token yo'q bo'lsa tekshirmaymiz (dev)
  try {
    const params = new URLSearchParams(initData)
    const hash = params.get('hash')
    params.delete('hash')
    const dataCheck = [...params.entries()]
      .map(([k, v]) => `${k}=${v}`)
      .sort()
      .join('\n')
    const secret = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest()
    const calc = crypto.createHmac('sha256', secret).update(dataCheck).digest('hex')
    return calc === hash
  } catch {
    return false
  }
}

function guard(req, res, next) {
  const initData = req.body?.initData || req.get('X-Init-Data')
  if (!verifyInitData(initData)) {
    return res.status(401).json({ error: 'initData tekshiruvi muvaffaqiyatsiz' })
  }
  next()
}

/* ---- Salomatlik ---- */
app.get('/health', (_req, res) => res.json({ ok: true, llm: hasKey(), provider: provider() }))

/* ---- initData'dan foydalanuvchini ajratish ---- */
function parseUser(initData) {
  try {
    const u = new URLSearchParams(initData).get('user')
    return u ? JSON.parse(u) : null
  } catch {
    return null
  }
}

/* ---- Foydalanuvchini ro'yxatga olish (Mini App ochilганda) ---- */
app.post('/api/register', (req, res) => {
  const initData = req.body?.initData
  let user = parseUser(initData) || req.body?.user
  if (!user?.id) return res.json({ ok: false })
  upsertUser(user)
  res.json({ ok: true })
})

/* ---- Ilova progressini yuborish ---- */
app.post('/api/progress', (req, res) => {
  const user = parseUser(req.body?.initData) || req.body?.user
  if (!user?.id) return res.json({ ok: false })
  updateProgress(user, req.body?.stats || {})
  res.json({ ok: true })
})

/* ---- Admin autentifikatsiya ---- */
const ADMIN_KEY = process.env.ADMIN_KEY || ''
function adminAuth(req, res, next) {
  const key = req.get('X-Admin-Key') || req.query.key
  if (!ADMIN_KEY || key !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Ruxsat yo‘q' })
  }
  next()
}

/* ---- Admin: foydalanuvchilar ro'yxati ---- */
app.get('/api/admin/users', adminAuth, (_req, res) => {
  res.json({ users: listUsers() })
})

/* ---- Admin: foydalanuvchini boshqarish (block/unblock/delete) ---- */
app.post('/api/admin/user', adminAuth, (req, res) => {
  const { id, action } = req.body || {}
  if (!id || !action) return res.status(400).json({ error: 'id va action kerak' })
  if (action === 'block') setBlocked(id, true)
  else if (action === 'unblock') setBlocked(id, false)
  else if (action === 'delete') removeUser(id)
  else return res.status(400).json({ error: 'noma’lum action' })
  res.json({ ok: true })
})

/* ---- Admin: ommaviy xabar (broadcast+) ---- */
const isActiveUser = (u) => Date.now() - (u.lastSeen || 0) < 7 * 86400000

async function tgApi(method, payload) {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return res.json()
}

app.get('/api/admin/broadcasts', adminAuth, (_req, res) => {
  res.json({ items: listBroadcasts() })
})

app.post('/api/admin/broadcast', adminAuth, async (req, res) => {
  const { text = '', segment = 'all', button, image } = req.body || {}
  const msg = text.trim()
  if (!msg && !image) return res.status(400).json({ error: 'Matn yoki rasm kerak' })
  if (!BOT_TOKEN) return res.status(500).json({ error: 'BOT_TOKEN yo‘q' })

  let targets = listUsers().filter((u) => !u.blocked)
  if (segment === 'active') targets = targets.filter(isActiveUser)

  const reply_markup =
    button?.text && button?.url ? { inline_keyboard: [[{ text: button.text, url: button.url }]] } : undefined

  let sent = 0
  let failed = 0
  for (const u of targets) {
    try {
      const r = image
        ? await tgApi('sendPhoto', { chat_id: u.id, photo: image, caption: msg, parse_mode: 'HTML', reply_markup })
        : await tgApi('sendMessage', { chat_id: u.id, text: msg, parse_mode: 'HTML', reply_markup })
      r.ok ? sent++ : failed++
    } catch {
      failed++
    }
    await new Promise((r) => setTimeout(r, 45)) // Telegram rate-limit
  }

  addBroadcast({ text: msg, segment, hasImage: Boolean(image), hasButton: Boolean(reply_markup), sent, failed, total: targets.length })
  res.json({ ok: true, sent, failed, total: targets.length })
})

/* ---- Rol-o'yin javobi ---- */
app.post('/api/reply', guard, async (req, res) => {
  const { history = [], practice = {} } = req.body || {}
  const persona = practice.persona || 'Suhbatdosh'
  const scenario = practice.scenario || 'Do‘stona suhbat.'

  const system = {
    role: 'system',
    content:
      `Sen "${persona}" ismli do‘stona, samimiy odamsan. ` +
      `Vaziyat: ${scenario} ` +
      `Foydalanuvchi bilan O‘ZBEK TILIDA rol o‘ynaysan. ` +
      `Javoblaring qisqa (1-2 gap), tabiiy va iliq bo‘lsin. ` +
      `Ba’zan qo‘shimcha savol berib, suhbatni davom ettir. ` +
      `Hech qachon o‘zingni AI ekanligingni aytma.`,
  }
  const msgs = [
    system,
    ...history.map((m) => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text })),
  ]

  try {
    const reply = await chat(msgs, { temperature: 0.9 })
    res.json({ reply })
  } catch (e) {
    console.error('reply xatosi:', e.message)
    res.status(502).json({ error: 'AI javob bermadi' })
  }
})

/* ---- Feedback (JSON) ---- */
app.post('/api/feedback', guard, async (req, res) => {
  const { history = [], practice = {} } = req.body || {}
  const userMsgs = history.filter((m) => m.role === 'user').map((m) => m.text)

  const system = {
    role: 'system',
    content:
      `Sen muloqot murabbiysan. Foydalanuvchining rol-o‘yin suhbatidagi ` +
      `xabarlarini tahlil qil. Maqsad edi: ${practice.goal || 'iliq suhbat qurish'}. ` +
      `FAQAT JSON qaytar, O‘ZBEK TILIDA, quyidagi shaklda:\n` +
      `{"overall": <0-100>, "metrics": [` +
      `{"label":"Ishonch","value":<0-100>,"color":"#4a90e2"},` +
      `{"label":"Aniqlik","value":<0-100>,"color":"#37d67a"},` +
      `{"label":"Qiziqish","value":<0-100>,"color":"#f0b400"}], ` +
      `"summary":"<1-2 gap umumiy baho>", "tips":["<maslahat1>","<maslahat2>","<maslahat3>"]}`,
  }
  const user = {
    role: 'user',
    content: `Foydalanuvchi xabarlari:\n${userMsgs.map((t, i) => `${i + 1}. ${t}`).join('\n') || '(bo‘sh)'}`,
  }

  try {
    const raw = await chat([system, user], { json: true, temperature: 0.4 })
    const parsed = JSON.parse(raw)
    res.json(parsed)
  } catch (e) {
    console.error('feedback xatosi:', e.message)
    res.status(502).json({ error: 'AI feedback bermadi' })
  }
})

/* ---- Erkin AI murabbiy chati ---- */
app.post('/api/chat', guard, async (req, res) => {
  const { history = [] } = req.body || {}
  const system = {
    role: 'system',
    content:
      `Sen — "Sabo AI", Sabo ilovasining shaxsiy muloqot va soft-skills murabbiysisan. ` +
      `Vazifang: foydalanuvchiga ijtimoiy ishonch, suhbat boshlash va davom ettirish, ` +
      `tanishuv (dating), do‘st orttirish, ish joyidagi muloqot, hikoya qilish va ` +
      `ijtimoiy tashvishni yengish bo‘yicha yordam berish.\n\n` +
      `QOIDALAR:\n` +
      `1. Faqat O‘ZBEK TILIDA javob ber.\n` +
      `2. Iliq, qo‘llab-quvvatlovchi, do‘stona ohangda gapir — hech qachon hukm qilma.\n` +
      `3. Qisqa va aniq bo‘l (2-4 gap). Kerak bo‘lsa aniq misol yoki 1 ta amaliy qadam ber.\n` +
      `4. Mavzudan tashqari (masalan kod yozish, siyosat, tibbiyot) so‘ralса, muloyimlik bilan ` +
      `o‘z sohangga — muloqot va ijtimoiy ko‘nikmalarga qaytar.\n` +
      `5. O‘zingni AI ekanligingни ochiq aytaverma; tabiiy murabbiy kabi muloqot qil.\n` +
      `6. Foydalanuvchini kichik amaliy qadamlar bilan rag‘batlantir.`,
  }
  const msgs = [
    system,
    ...history.map((m) => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text })),
  ]
  try {
    const reply = await chat(msgs, { temperature: 0.8 })
    res.json({ reply })
  } catch (e) {
    console.error('chat xatosi:', e.message)
    res.status(502).json({ error: 'AI javob bermadi' })
  }
})

// Ishga tushganda kanaldan bazani tiklaymiz, keyin serverni ochamiz
initUsers().finally(() => {
  app.listen(PORT, () => {
    console.log(`✅ Sabo server ${PORT}-portda ishlayapti (LLM: ${hasKey() ? 'ulangan' : 'YO‘Q'})`)
  })
})
