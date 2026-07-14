// Foydalanuvchilar saqlagichi (fayl asosida).
// ⚠️ Render Free'da disk vaqtinchalik — restart/redeploy'da tozalanishi mumkin.
// Doimiy saqlash uchun keyin DB (Postgres/Mongo) yoki Render Disk qo'shing.

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const DIR = dirname(fileURLToPath(import.meta.url))
const FILE = join(DIR, 'users.json')

function load() {
  if (!existsSync(FILE)) return {}
  try {
    return JSON.parse(readFileSync(FILE, 'utf8'))
  } catch {
    return {}
  }
}

function persist(data) {
  writeFileSync(FILE, JSON.stringify(data, null, 2))
}

export function upsertUser(u) {
  if (!u?.id) return
  const data = load()
  const key = String(u.id)
  const now = Date.now()
  const prev = data[key] || {}
  data[key] = {
    id: key,
    first_name: u.first_name || prev.first_name || '',
    last_name: u.last_name || prev.last_name || '',
    username: u.username || prev.username || '',
    language_code: u.language_code || prev.language_code || '',
    joined: prev.joined || now,
    lastSeen: now,
  }
  persist(data)
}

export function listUsers() {
  return Object.values(load()).sort((a, b) => b.joined - a.joined)
}
