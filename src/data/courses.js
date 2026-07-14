// Home o'quv yo'li — joriy modul darslari
export const PATH_LESSONS = [
  { id: 1, status: 'current', title: 'His qildir, ko‘rinma' },
  { id: 2, status: 'locked', title: 'Karizma baland ovoz emas' },
  { id: 3, status: 'locked', title: 'Uni soxtalashtira olmaysan' },
  { id: 4, status: 'locked', title: 'Xonadan hech narsa kutma' },
]

export const CURRENT_MODULE = { label: '1-modul', title: 'Ichki o‘yin', progress: 0 }

// Library — kategoriyalar va kurslar
export const LIBRARY = [
  {
    category: 'Karizma',
    courses: [
      { title: 'Ichki o‘yin', lessons: 4, tint: '#3a2a1e' },
      { title: 'Ularni kattaroq his qildir', lessons: 5, tint: '#332a20' },
    ],
  },
  {
    category: 'Suhbat asoslari',
    courses: [
      { title: 'Qayta sozlash', lessons: 5, tint: '#2f271f' },
      { title: 'Noldan boshlash', lessons: 4, tint: '#3d4a2e', image: true },
    ],
  },
  {
    category: 'Tanishuv (Dating)',
    courses: [
      { title: 'Ichki muvozanat', lessons: 4, tint: '#3a2626' },
      { title: 'Hozirlik va ramka', lessons: 4, tint: '#332430' },
    ],
  },
  {
    category: 'Do‘st orttirish',
    courses: [
      { title: 'Qayta start', lessons: 3, tint: '#2a2b1f' },
      { title: 'O‘z odamlaringni topish', lessons: 5, tint: '#25302f' },
    ],
  },
  {
    category: 'Ish joyidagi muloqot',
    courses: [
      { title: 'Ishonchli taqdimot', lessons: 6, tint: '#2e2636' },
      { title: 'Konfliktni hal qilish', lessons: 4, tint: '#362a26' },
    ],
  },
]

// You — kurs tanlash (drawer / progress)
export const COURSES = [
  { title: 'Karizma', icon: '👑', done: 0, total: 18, current: true },
  { title: 'Suhbat asoslari', icon: '💬', done: 0, total: 41 },
  { title: 'Tanishuv', icon: '❤️', done: 0, total: 27 },
  { title: 'Do‘st orttirish', icon: '🍷', done: 0, total: 17 },
  { title: 'Ish joyidagi muloqot', icon: '🧑‍💼', done: 0, total: 30 },
]
