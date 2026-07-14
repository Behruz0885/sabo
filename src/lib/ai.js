// AI moduli (Sabo).
// VITE_API_URL o'rnatilgan bo'lsa — real backend (LLM) ishlatiladi.
// Aks holda yoki xatolikda — frontenddagi heuristik zaxira ishlaydi.

const API = import.meta.env.VITE_API_URL || ''
const initData = typeof window !== 'undefined' ? window?.Telegram?.WebApp?.initData || '' : ''

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function callBackend(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Init-Data': initData },
    body: JSON.stringify({ ...body, initData }),
  })
  if (!res.ok) throw new Error(`Backend ${res.status}`)
  return res.json()
}

/* ============ Ommaviy API ============ */
export async function getReply(history, practice) {
  if (API) {
    try {
      const { reply } = await callBackend('/api/reply', { history, practice })
      if (reply) return reply
    } catch (e) {
      console.warn('AI backend ishlamadi, heuristikaga o‘tildi:', e.message)
    }
  }
  return heuristicReply(history)
}

export async function getCoachReply(history) {
  if (API) {
    try {
      const { reply } = await callBackend('/api/chat', { history })
      if (reply) return reply
    } catch (e) {
      console.warn('AI murabbiy backend ishlamadi, heuristikaga o‘tildi:', e.message)
    }
  }
  return heuristicCoach(history)
}

export async function getFeedback(history, practice) {
  if (API) {
    try {
      const fb = await callBackend('/api/feedback', { history, practice })
      if (fb && typeof fb.overall === 'number') return fb
    } catch (e) {
      console.warn('AI feedback backend ishlamadi, heuristikaga o‘tildi:', e.message)
    }
  }
  return heuristicFeedback(history)
}

/* ============ Heuristik zaxira ============ */
async function heuristicCoach(history) {
  await wait(700 + Math.random() * 500)
  const last = (history[history.length - 1]?.text || '').toLowerCase()
  if (last.includes('boshla') || last.includes('suhbat'))
    return 'Suhbatni ochiq savol bilan boshla: “Bu yerga qanday kelib qolding?” yoki atrofdagi biror narsaga izoh ber. Muhimi — samimiy qiziqish. Keyingi qadam sifatida nima demoqchisan?'
  if (last.includes('ishonch') || last.includes('qo‘rq') || last.includes('qorq'))
    return 'Ishonch — mashqdan tug‘iladi. Kichik boshla: bugun bitta odamga savol ber. Nafasingni sekinlashtir, ko‘zga qara va shoshilma. Qaysi vaziyatда o‘zingni noqulay his qilasan?'
  if (last.includes('ish') || last.includes('intervyu') || last.includes('suhbat'))
    return 'Ish suhbatiga tayyorgarlik: yutuqlaringni STAR (Vaziyat–Vazifa–Harakat–Natija) formatida tayyorla. 2-3 ta misolni mashq qil. Qaysi savoldan hayotiroqsan?'
  return 'Yaxshi savol! Buni birga hал qilaylik. Menga biroz batafsilroq ayt — qaysi vaziyat haqida gapiryapmiz?'
}

const REPLIES = [
  'Tanishganimdan xursandman! Bu yerga qanday kelib qolding?',
  'Qiziq ekan. Men ham shunga o‘xshash narsalarni yoqtiraman. Bo‘sh vaqtingda odatda nima qilasan?',
  'Voy, ajoyib-ku! Buni qanday boshlagansan?',
  'Sen bilan gaplashish juda yoqimli ekan. Do‘stlaring ham shu yerdami?',
  'Rahmat, bu haqda o‘ylab ko‘rmagan ekanman. Yana nima deb o‘ylaysan?',
]

async function heuristicReply(history) {
  await wait(700 + Math.random() * 500)
  const userTurns = history.filter((m) => m.role === 'user').length
  const last = history[history.length - 1]?.text || ''
  if (last.includes('?')) {
    const answers = [
      'Yaxshi savol! Menimcha, bu ko‘proq amaliyotga bog‘liq. Sen-chi?',
      'Hmm, qiziq. Men bir necha yildan beri shug‘ullanaman. Sen qanchadan beri?',
    ]
    return answers[userTurns % answers.length]
  }
  return REPLIES[Math.min(userTurns, REPLIES.length - 1)]
}

async function heuristicFeedback(history) {
  await wait(1100)
  const userMsgs = history.filter((m) => m.role === 'user').map((m) => m.text)
  const text = userMsgs.join(' ')
  const avgLen = userMsgs.length ? text.length / userMsgs.length : 0
  const questions = (text.match(/\?/g) || []).length
  const hedges = (text.match(/balki|bilmadim|menimcha yo‘q|noaniq/gi) || []).length
  const positive = (text.match(/rahmat|zo‘r|ajoyib|yaxshi|qiziq|yoqadi/gi) || []).length
  const clamp = (n) => Math.max(20, Math.min(98, Math.round(n)))

  const confidence = clamp(50 + Math.min(avgLen, 60) * 0.5 - hedges * 12)
  const clarity = clamp(60 + (avgLen > 8 && avgLen < 120 ? 20 : -5) - hedges * 6)
  const engagement = clamp(45 + questions * 14 + positive * 6)
  const overall = Math.round((confidence + clarity + engagement) / 3)

  const tips = []
  if (questions === 0) tips.push('Ochiq savol bermading. “Qanday...”, “Nega...” bilan savol berib ko‘r — suhbat jonlanadi.')
  else if (questions >= 2) tips.push('Zo‘r! Ochiq savollar bilan suhbatdoshni yaxshi jalb qilding.')
  if (hedges > 0) tips.push('“Bilmadim”, “balki” kabi ikkilanish so‘zlarini kamaytir — fikringni dadilroq ayt.')
  if (avgLen < 10) tips.push('Javoblaring juda qisqa. Bir-ikki jumla qo‘shsang, iliqroq tuyuladi.')
  if (avgLen > 140) tips.push('Ba’zi javoblar uzunroq — qisqaroq va aniqroq bo‘lsang, ta’sirliroq bo‘ladi.')
  if (positive > 0) tips.push('Ijobiy va samimiy ohang qo‘llading — bu odamlarni o‘ziga tortadi.')
  if (tips.length === 0) tips.push('Yaxshi boshlanish! Suhbatni suhbatdoshning javoblari asosida chuqurlashtir.')

  return {
    overall,
    metrics: [
      { label: 'Ishonch', value: confidence, color: '#4a90e2' },
      { label: 'Aniqlik', value: clarity, color: '#37d67a' },
      { label: 'Qiziqish', value: engagement, color: '#f0b400' },
    ],
    summary:
      overall >= 75
        ? 'Ajoyib suhbat! Iliq, ishonchli va jalb qiluvchi bo‘lding.'
        : overall >= 55
          ? 'Yaxshi urinish! Bir nechta kichik o‘zgarish bilan yanada ta’sirli bo‘lasan.'
          : 'Yaxshi boshlanish. Quyidagi maslahatlar keyingi safar yordam beradi.',
    tips: tips.slice(0, 3),
  }
}
