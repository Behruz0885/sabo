// Onboarding qadamlari (silliqlangan, "siz" shaklida). Variantlar SVG ikona nomlarini ishlatadi.
// type: text | single | multi | grid | slider | info | superpower | transition | score | commit

export const STEPS = [
  { id: 'name', type: 'text', title: 'Ismingiz nima?', placeholder: 'Ismingiz', key: 'name' },

  {
    id: 'gender',
    type: 'single',
    title: 'O‘zingizni qanday ta’riflaysiz?',
    key: 'gender',
    extra: 'Aytishni istamayman',
    options: [
      { icon: 'male', color: '#4a90e2', label: 'Erkak' },
      { icon: 'female', color: '#ff5c8a', label: 'Ayol' },
      { icon: 'other', color: '#a06bff', label: 'Boshqa' },
    ],
  },

  {
    id: 'source',
    type: 'single',
    title: 'Sabo haqida qayerdan eshitdingiz?',
    subtitle: 'Bizni qayerdan topayotganingizni bilish yordam beradi.',
    key: 'source',
    options: [
      { icon: 'people', color: '#a06bff', label: 'Do‘stlar orqali' },
      { icon: 'bulb', color: '#f0b400', label: 'Instagram / TikTok' },
      { icon: 'search', color: '#4a90e2', label: 'Google qidiruv' },
      { icon: 'chatPlus', color: '#37d67a', label: 'AI vositalar (ChatGPT...)' },
      { icon: 'book', color: '#ff5c8a', label: 'Boshqa' },
    ],
  },

  {
    id: 'goals',
    type: 'grid',
    title: 'Sizni bugun nima olib keldi?',
    subtitle: 'Mos keladiganlarini belgilang.',
    key: 'goals',
    options: [
      { icon: 'crown', color: '#f0b400', label: 'Ko‘proq ishonch orttirish' },
      { icon: 'heart', color: '#ff5c8a', label: 'Munosabatlarni yaxshilash' },
      { icon: 'briefcase', color: '#4a90e2', label: 'Karyerada o‘sish' },
      { icon: 'people', color: '#a06bff', label: 'Yangi odamlar bilan tanishish' },
    ],
  },

  {
    id: 'strangers',
    type: 'slider',
    title: 'Notanish odamlar orasida o‘zingizni qanchalik qulay his qilasiz?',
    subtitle: 'Javobni tanlash uchun suring.',
    key: 'strangers',
    leftLabel: 'Noqulay',
    rightLabel: 'Juda qulay',
  },

  {
    id: 'meet',
    type: 'single',
    title: 'Yangi tanishuvlarda o‘zingizga qanchalik ishonasiz?',
    key: 'meet',
    options: [
      { icon: 'signalHigh', color: '#37d67a', label: 'Juda ishonchli' },
      { icon: 'signalMid', color: '#f0b400', label: 'Qisman ishonchli' },
      { icon: 'signalLow', color: '#ff5c5c', label: 'Unchalik emas' },
    ],
  },

  {
    id: 'better',
    type: 'multi',
    title: 'Aynan nimani yaxshilamoqchisiz?',
    subtitle: 'Bir nechtasini tanlashingiz mumkin.',
    key: 'better',
    options: [
      { icon: 'chatPlus', color: '#f0b400', label: 'Suhbatni boshlash' },
      { icon: 'eye', color: '#a06bff', label: 'Ijtimoiy signallarni o‘qish' },
      { icon: 'megaphone', color: '#ff5c8a', label: 'Fikrni aniq ifodalash' },
      { icon: 'book', color: '#4a90e2', label: 'Qiziqarli hikoya qilish' },
    ],
  },

  {
    id: 'info1',
    type: 'info',
    title: 'Bilarmidingiz...',
    heading: 'Odamlar sizni bir soniyaning o‘ndan birida baholaydi',
    bullets: [
      { icon: 'brain', color: '#a06bff', text: 'Muvaffaqiyatli mutaxassislarning 90% i yuqori emotsional intellektga ega' },
      { icon: 'trophy', color: '#f0b400', text: 'Ishonchli ko‘rinadiganlar 60% ko‘proq yetakchi sifatida qabul qilinadi' },
      { icon: 'target', color: '#37d67a', text: 'Muntazam mashq 75% odamda ishonchni oshiradi' },
    ],
    note: 'Manba: Willis & Todorov (Princeton, 2006); HBR (2019)',
  },

  {
    id: 'superpower',
    type: 'superpower',
    title: 'Ijtimoiy super-kuchingiz qaysi?',
    subtitle: 'O‘zingizga eng yaqinini tanlang.',
    key: 'superpower',
    options: [
      { icon: 'heart', color: '#ff5c8a', title: 'Iliqlik', desc: 'Odamlarni chin dildan qadrlanayotgandek his qildiraman' },
      { icon: 'smile', color: '#f0b400', title: 'Hazil', desc: 'Kulguli, tez fikrli va birga bo‘lish yoqimli' },
      { icon: 'balance', color: '#37d67a', title: 'Hozirlik', desc: 'Xotirjam, barqaror va ishonchli qolaman' },
      { icon: 'search', color: '#a06bff', title: 'Qiziquvchanlik', desc: 'Yaxshi savol beraman va chin dildan tinglayman' },
    ],
  },

  {
    id: 'commitTime',
    type: 'single',
    title: 'Kuniga qancha vaqt ajrata olasiz?',
    subtitle: 'Kichik, muntazam qadamlar eng yaxshi natija beradi.',
    key: 'commitTime',
    options: [
      { icon: 'seed', color: '#37d67a', label: 'Kuniga 5 daqiqa' },
      { icon: 'leaf', color: '#2e9e5b', label: 'Kuniga 10 daqiqa' },
      { icon: 'tree', color: '#1f8a4c', label: 'Kuniga 15 daqiqa' },
      { icon: 'alarm', color: '#f0b400', label: 'Kuniga 20+ daqiqa' },
    ],
  },

  { id: 't1', type: 'transition', title: 'Javoblaringiz tahlil qilinmoqda...', loader: true },

  { id: 'score', type: 'score' },

  { id: 'commit', type: 'commit' },
]
