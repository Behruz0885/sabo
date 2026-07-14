import 'dotenv/config'
import http from 'http'
import { Bot, InlineKeyboard, GrammyError, HttpError, webhookCallback } from 'grammy'
import cron from 'node-cron'
import { addUser, allUserIds } from './store.js'

const token = process.env.BOT_TOKEN
const webAppUrl = process.env.WEBAPP_URL
const reminderHour = Number(process.env.REMINDER_HOUR ?? 20)
const timezone = process.env.TZ || 'Asia/Tashkent'

// Render/hosting web-servisi bo'lsa — webhook; lokalda — long polling
const PORT = process.env.PORT || 3000
const publicUrl = process.env.WEBHOOK_URL || process.env.RENDER_EXTERNAL_URL || ''

if (!token) {
  console.error('❌ BOT_TOKEN topilmadi. .env faylini to‘ldiring (.env.example dan nusxa oling).')
  process.exit(1)
}
if (!webAppUrl) {
  console.warn('⚠️  WEBAPP_URL yo‘q — tugmalar Mini App’ni ocholmaydi. .env ga qo‘shing.')
}

const bot = new Bot(token)

// Kirish maydoni yonidagi doimiy "menu" tugmasini Mini App’ga bog‘laymiz
if (webAppUrl) {
  bot.api
    .setChatMenuButton({
      menu_button: { type: 'web_app', text: 'Sabo', web_app: { url: webAppUrl } },
    })
    .then(() => console.log('✅ Menu tugmasi Mini App’ga ulandi'))
    .catch((e) => console.warn('Menu tugmasini o‘rnatib bo‘lmadi:', e.description || e))
}

// Bot buyruqlari ro‘yxati (Telegram menyusida ko‘rinadi)
bot.api.setMyCommands([
  { command: 'start', description: 'Saboni ochish' },
  { command: 'help', description: 'Yordam' },
]).catch(() => {})

bot.command('start', async (ctx) => {
  const name = ctx.from?.first_name || 'do‘stim'
  addUser(ctx.from?.id, name)
  const kb = webAppUrl
    ? new InlineKeyboard().webApp('🚀 Saboni ochish', webAppUrl)
    : undefined

  await ctx.reply(
    `Salom, ${name}! 👋\n\n` +
      `✨ *Sabo* — AI muloqot murabbiying.\n\n` +
      `Har kuni atigi 5 daqiqa mashq qilib:\n` +
      `• Suhbatlarda o‘ziga ishonchni oshirasan\n` +
      `• AI bilan real vaziyatlarni mashq qilasan\n` +
      `• Shaxsiy feedback olasan\n\n` +
      `Boshlash uchun quyidagi tugmani bos 👇`,
    { parse_mode: 'Markdown', reply_markup: kb }
  )
})

bot.command('help', async (ctx) => {
  await ctx.reply(
    'Sabo — soft skills va muloqot murabbiyi.\n\n' +
      '/start — ilovani ochish\n' +
      'Kirish maydoni yonidagi “Sabo” tugmasi orqali ham ochishing mumkin.'
  )
})

// Har qanday boshqa xabarga — ochish tugmasi
bot.on('message', async (ctx) => {
  addUser(ctx.from?.id, ctx.from?.first_name)
  if (!webAppUrl) return
  const kb = new InlineKeyboard().webApp('🚀 Saboni ochish', webAppUrl)
  await ctx.reply('Mashqni boshlash uchun Saboni och 👇', { reply_markup: kb })
})

/* ---- Kunlik streak eslatmasi ---- */
const REMINDERS = [
  '🔥 Streakingni yo‘qotma! Bugun 5 daqiqa mashq qilib qo‘y.',
  '✨ Kuning qanday o‘tdi? Sabo bilan qisqa mashq — katta farq qiladi.',
  '💬 Bugungi darsni bajarding? Ijtimoiy muskulingni charxlab tur!',
  '🌱 Har kungi kichik qadam — katta o‘sish. Sabo seni kutyapti.',
]

async function sendReminders() {
  const ids = allUserIds()
  if (!ids.length) return
  const kb = webAppUrl ? new InlineKeyboard().webApp('🚀 Mashqni boshlash', webAppUrl) : undefined
  const text = REMINDERS[Math.floor(Math.random() * REMINDERS.length)]
  let ok = 0
  for (const id of ids) {
    try {
      await bot.api.sendMessage(id, text, { reply_markup: kb })
      ok++
      await new Promise((r) => setTimeout(r, 40)) // rate-limit
    } catch {
      /* foydalanuvchi botni bloklagan bo'lishi mumkin */
    }
  }
  console.log(`🔔 Eslatma yuborildi: ${ok}/${ids.length}`)
}

// Har kuni belgilangan soatda
cron.schedule(`0 ${reminderHour} * * *`, sendReminders, { timezone })
console.log(`🔔 Kunlik eslatma ${reminderHour}:00 (${timezone}) ga rejalashtirildi`)

// Xatolarni ushlash
bot.catch((err) => {
  const e = err.error
  if (e instanceof GrammyError) console.error('Telegram xatosi:', e.description)
  else if (e instanceof HttpError) console.error('Tarmoq xatosi:', e)
  else console.error('Noma’lum xato:', e)
})

/* ---- Ishga tushirish: webhook yoki polling ---- */
if (publicUrl) {
  // Webhook rejimi (Render Web Service uchun)
  const secretPath = `/tg/${token.split(':')[0]}`
  const handleUpdate = webhookCallback(bot, 'http')

  const server = http.createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === secretPath) {
      try {
        await handleUpdate(req, res)
      } catch (e) {
        console.error('webhook xatosi:', e)
        if (!res.headersSent) { res.writeHead(500); res.end() }
      }
      return
    }
    // Salomatlik / ping (Render uyg'oq tutish uchun)
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('Sabo bot ishlayapti')
  })

  server.listen(PORT, async () => {
    const url = `${publicUrl.replace(/\/$/, '')}${secretPath}`
    await bot.api.setWebhook(url, { drop_pending_updates: true })
    console.log(`✅ Webhook o‘rnatildi: ${url}`)
    console.log(`✅ Server ${PORT}-portda`)
  })
} else {
  // Long polling (lokal ishlab chiqish)
  bot.start({
    onStart: (info) => console.log(`✅ @${info.username} polling rejimida ishga tushdi`),
  })
}
