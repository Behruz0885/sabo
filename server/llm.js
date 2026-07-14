// LLM chaqiruvi — Gemini (Google) yoki OpenAI-mos API.
// GEMINI_API_KEY berilsa — Gemini ishlatiladi. Aks holda OpenAI-mos.

const GEMINI_KEY = process.env.GEMINI_API_KEY
const OPENAI_KEY = process.env.OPENAI_API_KEY
const OPENAI_BASE = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'

const PROVIDER = GEMINI_KEY ? 'gemini' : 'openai'
const MODEL =
  process.env.MODEL || (PROVIDER === 'gemini' ? 'gemini-2.0-flash' : 'gpt-4o-mini')

export function hasKey() {
  return Boolean(GEMINI_KEY || OPENAI_KEY)
}

export function provider() {
  return hasKey() ? PROVIDER : 'none'
}

/* ---- Gemini (native) ---- */
async function geminiChat(messages, { json, temperature }) {
  const systemText = messages
    .filter((m) => m.role === 'system')
    .map((m) => m.content)
    .join('\n')

  const contents = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

  const body = {
    contents,
    generationConfig: {
      temperature,
      ...(json ? { responseMimeType: 'application/json' } : {}),
    },
  }
  if (systemText) body.systemInstruction = { parts: [{ text: systemText }] }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_KEY}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const t = await res.text().catch(() => '')
    throw new Error(`Gemini xatosi ${res.status}: ${t.slice(0, 300)}`)
  }
  const data = await res.json()
  return (
    data.candidates?.[0]?.content?.parts?.map((p) => p.text).join('').trim() || ''
  )
}

/* ---- OpenAI-mos ---- */
async function openaiChat(messages, { json, temperature }) {
  const res = await fetch(`${OPENAI_BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({
      model: MODEL,
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
  if (!hasKey()) throw new Error('API kaliti yo‘q (GEMINI_API_KEY yoki OPENAI_API_KEY)')
  return PROVIDER === 'gemini'
    ? geminiChat(messages, { json, temperature })
    : openaiChat(messages, { json, temperature })
}
