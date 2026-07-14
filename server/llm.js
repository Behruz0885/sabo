// LLM chaqiruvi — Gemini (Google), GitHub Models yoki OpenAI-mos API.
// Provayder avtomatik tanlanadi (birinchi mavjud kalit bo'yicha):
//   1) GEMINI_API_KEY  -> Gemini (Google)
//   2) GITHUB_TOKEN    -> GitHub Models (OpenAI-mos)
//   3) OPENAI_API_KEY  -> OpenAI yoki mos provayder

const GEMINI_KEY = process.env.GEMINI_API_KEY
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const OPENAI_KEY = process.env.OPENAI_API_KEY

const PROVIDER = GEMINI_KEY ? 'gemini' : GITHUB_TOKEN ? 'github' : OPENAI_KEY ? 'openai' : 'none'

// OpenAI-mos provayder uchun manzil, kalit va standart model
const OPENAI_COMPAT = {
  github: { base: 'https://models.github.ai/inference', key: GITHUB_TOKEN, model: 'openai/gpt-4o-mini' },
  openai: { base: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1', key: OPENAI_KEY, model: 'gpt-4o-mini' },
}
const GEMINI_MODEL = process.env.MODEL || 'gemini-2.0-flash'

export function hasKey() {
  return PROVIDER !== 'none'
}
export function provider() {
  return PROVIDER
}
export function model() {
  if (PROVIDER === 'none') return null
  if (PROVIDER === 'gemini') return GEMINI_MODEL
  return process.env.MODEL || OPENAI_COMPAT[PROVIDER].model
}

/* ---- Gemini (native) ---- */
async function geminiChat(messages, { json, temperature }) {
  const systemText = messages.filter((m) => m.role === 'system').map((m) => m.content).join('\n')
  const contents = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }))

  const body = {
    contents,
    generationConfig: { temperature, ...(json ? { responseMimeType: 'application/json' } : {}) },
  }
  if (systemText) body.systemInstruction = { parts: [{ text: systemText }] }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (!res.ok) {
    const t = await res.text().catch(() => '')
    throw new Error(`Gemini xatosi ${res.status}: ${t.slice(0, 300)}`)
  }
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.map((p) => p.text).join('').trim() || ''
}

/* ---- OpenAI-mos (GitHub Models / OpenAI) ---- */
async function openaiChat(messages, { json, temperature }) {
  const cfg = OPENAI_COMPAT[PROVIDER]
  const model = process.env.MODEL || cfg.model
  const res = await fetch(`${cfg.base}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.key}` },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      ...(json ? { response_format: { type: 'json_object' } } : {}),
    }),
  })
  if (!res.ok) {
    const t = await res.text().catch(() => '')
    throw new Error(`LLM xatosi ${res.status}: ${t.slice(0, 300)}`)
  }
  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() || ''
}

export async function chat(messages, { json = false, temperature = 0.8 } = {}) {
  if (!hasKey()) throw new Error('API kaliti yo‘q (GEMINI_API_KEY, GITHUB_TOKEN yoki OPENAI_API_KEY)')
  return PROVIDER === 'gemini' ? geminiChat(messages, { json, temperature }) : openaiChat(messages, { json, temperature })
}
