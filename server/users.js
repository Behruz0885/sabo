// Foydalanuvchilar saqlagichi (fayl asosida).
// ⚠️ Render Free'da disk vaqtinchalik — restart/redeploy'da tozalanishi mumkin.
// Doimiy saqlash uchun keyin DB (Postgres/Mongo) yoki Render Disk qo'shing.

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { scheduleBackup, restore, enabled } from './tgdb.js'

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
    xp: prev.xp || 0,
    streak: prev.streak || 0,
    progress: prev.progress || 0,
    blocked: prev.blocked || false,
  }
  persist(data)
  scheduleBackup(Object.values(data)) // Telegram kanalga zaxira
}

// Ilova progressini yangilash (XP, streak, tugatilgan darslar)
export function updateProgress(u, stats = {}) {
  if (!u?.id) return
  const data = load()
  const key = String(u.id)
  const prev = data[key]
  if (!prev) {
    upsertUser(u)
    return updateProgress(u, stats)
  }
  data[key] = {
    ...prev,
    first_name: u.first_name || prev.first_name,
    username: u.username || prev.username,
    language_code: u.language_code || prev.language_code,
    xp: stats.xp ?? prev.xp ?? 0,
    streak: stats.streak ?? prev.streak ?? 0,
    progress: stats.progress ?? prev.progress ?? 0,
    lastSeen: Date.now(),
  }
  persist(data)
  scheduleBackup(Object.values(data))
}

export function setBlocked(id, blocked) {
  const data = load()
  const key = String(id)
  if (!data[key]) return
  data[key].blocked = Boolean(blocked)
  persist(data)
  scheduleBackup(Object.values(data))
}

export function removeUser(id) {
  const data = load()
  delete data[String(id)]
  persist(data)
  scheduleBackup(Object.values(data))
}

export function listUsers() {
  return Object.values(load()).sort((a, b) => b.joined - a.joined)
}

// Ishga tushganda kanaldagi bazadan tiklash
export async function initUsers() {
  if (!enabled()) return
  const arr = await restore()
  if (Array.isArray(arr) && arr.length) {
    const map = {}
    for (const u of arr) if (u?.id) map[String(u.id)] = u
    persist(map)
    console.log(`🗃 Kanaldan ${arr.length} foydalanuvchi tiklandi`)
  }
}
