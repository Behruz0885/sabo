import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import crypto from 'crypto'
import { chat, hasKey } from './llm.js'
import { upsertUser, listUsers } from './users.js'

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
app.get('/health', (_req, res) => res.json({ ok: true, llm: hasKey() }))

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

/* ---- Admin: foydalanuvchilar ro'yxati ---- */
const ADMIN_KEY = process.env.ADMIN_KEY || ''
app.get('/api/admin/users', (req, res) => {
  const key = req.get('X-Admin-Key') || req.query.key
  if (!ADMIN_KEY || key !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Ruxsat yo‘q' })
  }
  res.json({ users: listUsers() })
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
      `Sen "Sabo" — do‘stona AI muloqot va soft-skills murabbiysan. ` +
      `Foydalanuvchiga suhbat boshlash, ijtimoiy ishonch, tanishuv, ish joyidagi muloqot ` +
      `va hikoya qilish bo‘yicha yordam berasan. ` +
      `O‘ZBEK TILIDA, iliq, qisqa (2-4 gap) va amaliy javob ber. ` +
      `Imkon bo‘lsa aniq misol yoki bitta amaliy maslahat qo‘sh. ` +
      `Ortiqcha rasmiyatchilikdan qoch, samimiy bo‘l.`,
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

app.listen(PORT, () => {
  console.log(`✅ Sabo server ${PORT}-portda ishlayapti (LLM: ${hasKey() ? 'ulangan' : 'YO‘Q — kalit kiriting'})`)
})
