# Sabo — AI muloqot murabbiyi (Telegram Mini App)

Sabo — soft skills va muloqotni mashq qilish uchun Telegram Mini App. React + Vite frontend va grammY (Node.js) bot.

## Loyiha tuzilishi

```
AnewAPP/
├─ src/                     # Mini App (React frontend)
│  ├─ components/
│  │  ├─ Landing.jsx        # Ochilish ekrani
│  │  ├─ onboarding/        # Onboarding (savol-javob oqimi)
│  │  ├─ app/               # Asosiy ilova (Home, Library, Insights, You)
│  │  └─ lesson/            # Dars oqimi (nazariya, quiz, AI mashq, feedback)
│  ├─ data/                 # Savollar, kurslar, dars kontenti
│  ├─ lib/                  # ai.js (AI), storage.js (saqlash)
│  └─ useTelegram.js        # Telegram WebApp SDK hook
├─ server/                  # AI backend (Express + LLM proksi)
│  ├─ index.js              # /api/reply, /api/feedback, /health
│  ├─ llm.js                # OpenAI-mos API chaqiruvi
│  └─ .env.example
└─ bot/                     # Telegram bot (grammY)
   ├─ bot.js                # /start, WebApp tugma, kunlik eslatma
   ├─ store.js              # foydalanuvchilar (users.json)
   └─ .env.example
```

## 1. Frontend (Mini App)

```bash
npm install
npm run dev      # lokal: http://localhost:5173
npm run build    # prod build → dist/
```

Telegram Mini App faqat **HTTPS** orqali ishlaydi. Variantlar:
- **Prod:** `npm run build` → `dist/` ni hostingga joylang (Vercel, Netlify, GitHub Pages, Cloudflare Pages).
- **Lokal test:** dev serverni HTTPS tunnel orqali oching:
  ```bash
  npx ngrok http 5173
  ```
  ngrok bergan `https://...` manzilini `WEBAPP_URL` sifatida ishlating.

## 2. Bot yaratish (BotFather)

1. Telegramda [@BotFather](https://t.me/BotFather) ga `/newbot` yuboring.
2. Nom va username bering → **token** olasiz.
3. (ixtiyoriy) `/setmenubutton` yoki bot kod avtomatik menu tugmasini o‘rnatadi.

## 3. Botni ishga tushirish

```bash
cd bot
npm install
copy .env.example .env      # Windows (yoki: cp .env.example .env)
```

`.env` ni to‘ldiring:
```
BOT_TOKEN=BotFather bergan token
WEBAPP_URL=https://sizning-manzilingiz/   (ngrok yoki hosting)
```

Keyin:
```bash
npm start
```

Botga `/start` yozing → **“🚀 Saboni ochish”** tugmasi chiqadi → Mini App ochiladi.

## Holat (progress) saqlash

- Telegram ichida — **CloudStorage** (qurilmalararo sinxron).
- Brauzerda — **localStorage**.
- Progress, XP, streak va onboarding javoblari saqlanadi.

## 4. AI backend (real LLM)

`server/` — Express proksi. API kalit **faqat serverda** turadi (frontendga qo‘yilmaydi).

```bash
cd server
npm install
copy .env.example .env      # OPENAI_API_KEY va boshqalarni to'ldiring
npm start                   # http://localhost:8787
```

Endpointlar:
- `GET /health` — holat (`llm: true/false`)
- `POST /api/reply` — rol-o‘yin javobi
- `POST /api/feedback` — suhbat tahlili (JSON)

Frontendni backendga ulash — loyiha ildizida `.env`:
```
VITE_API_URL=http://localhost:8787
```
> `VITE_API_URL` bo‘sh bo‘lsa, frontend **heuristik zaxira** bilan ishlaydi (internetsiz, demo). Backend ulanganda avtomatik real AI ishlaydi, xatolikda esa heuristikaga qaytadi.

Boshqa provayderlar (`server/.env`):
- OpenRouter: `OPENAI_BASE_URL=https://openrouter.ai/api/v1`
- Groq: `OPENAI_BASE_URL=https://api.groq.com/openai/v1`

### Xavfsizlik
- ⚠️ API kalitni hech qachon frontendga yoki gitga qo‘ymang (`.env` allaqachon `.gitignore` da).
- Prod uchun `server/.env` da `BOT_TOKEN` qo‘shsangiz, backend har so‘rovda Telegram `initData` ni tekshiradi (soxta so‘rovlardan himoya).
- `ALLOWED_ORIGIN` ni aniq frontend domeningizga cheklang.

## Kunlik streak eslatmasi

Bot har kuni belgilangan soatda (`REMINDER_HOUR`, standart 20:00 `Asia/Tashkent`) foydalanuvchilarga eslatma yuboradi.
Foydalanuvchilar `bot/users.json` da saqlanadi (birinchi `/start` da qo‘shiladi).
