// Yuborilgan ommaviy xabarlar tarixi (fayl asosida).
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const DIR = dirname(fileURLToPath(import.meta.url))
const FILE = join(DIR, 'broadcasts.json')

function load() {
  if (!existsSync(FILE)) return []
  try {
    return JSON.parse(readFileSync(FILE, 'utf8'))
  } catch {
    return []
  }
}

export function addBroadcast(entry) {
  const list = load()
  list.unshift({ ...entry, at: Date.now() })
  writeFileSync(FILE, JSON.stringify(list.slice(0, 100), null, 2))
}

export function listBroadcasts() {
  return load()
}
