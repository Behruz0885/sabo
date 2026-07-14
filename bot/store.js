// Oddiy fayl asosidagi foydalanuvchi saqlagichi (users.json).
// Kichik loyihalar uchun yetarli; kattaroq bo'lsa DB'ga o'ting.

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

export function addUser(id, name) {
  const data = load()
  const key = String(id)
  data[key] = { name: name || data[key]?.name || '', since: data[key]?.since || Date.now() }
  persist(data)
}

export function allUserIds() {
  return Object.keys(load())
}
