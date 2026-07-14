// LLM chaqiruvi — OpenAI-mos Chat Completions API.
// OPENAI_BASE_URL ni o'zgartirib boshqa provayderlarga ulash mumkin
// (masalan OpenRouter, Groq, yoki mahalliy server).

const BASE = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
const MODEL = process.env.MODEL || 'gpt-4o-mini'
const KEY = process.env.OPENAI_API_KEY

export function hasKey() {
  return Boolean(KEY)
}

export async function chat(messages, { json = false, temperature = 0.8 } = {}) {
  if (!KEY) throw new Error('OPENAI_API_KEY yo‘q')

  const res = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature,
      ...(json ? { response_format: { type: 'json_object' } } : {}),
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`LLM xatosi ${res.status}: ${text.slice(0, 300)}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() || ''
}
