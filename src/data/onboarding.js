// Onboarding qadamlari (qisqartirilgan). Variantlar emoji emas, SVG ikona nomlarini ishlatadi.
// type: text | single | multi | grid | slider | info | superpower | transition | score | commit

export const STEPS = [
  { id: 'name', type: 'text', title: 'Isming nima?', placeholder: 'Isming', key: 'name' },

  {
    id: 'gender',
    type: 'single',
    title: 'Men o‘zimni...',
    key: 'gender',
    extra: 'Aytishni istamayman',
    options: [
      { icon: 'male', color: '#4a90e2', label: 'Erkak' },
      { icon: 'female', color: '#ff5c8a', label: 'Ayol' },
      { icon: 'other', color: '#a06bff', label: 'Boshqa' },
    ],
  },

  {
    id: 'goals',
    type: 'grid',
    title: 'Bugun seni nima olib keldi?',
    subtitle: 'Mos keladiganlarni tanla.',
    key: 'goals',
    options: [
      { icon: 'crown', color: '#f0b400', label: 'Ko‘proq ishonchli bo‘lish' },
      { icon: 'heart', color: '#ff5c8a', label: 'Muhabbat hayotini yaxshilash' },
      { icon: 'briefcase', color: '#4a90e2', label: 'Karьerani rivojlantirish' },
      { icon: 'people', color: '#a06bff', label: 'Odamlar bilan bog‘lanish' },
    ],
  },

  {
    id: 'strangers',
    type: 'slider',
    title: 'Notanish odamlar orasida o‘zingni qanchalik qulay his qilasan?',
    subtitle: 'Javobingni tanlash uchun suring.',
    key: 'strangers',
    leftLabel: 'Ishonchsiz',
    rightLabel: 'Juda ishonchli',
  },

  {
    id: 'meet',
    type: 'single',
    title: 'Yangi odamlar bilan tanishishda o‘zingga ishonasanmi?',
    key: 'meet',
    options: [
      { icon: 'signalHigh', color: '#37d67a', label: 'Juda ishonchli' },
      { icon: 'signalMid', color: '#f0b400', label: 'Qisman ishonchli' },
      { icon: 'signalLow', color: '#ff5c5c', label: 'Ishonchli emas' },
    ],
  },

  {
    id: 'better',
    type: 'multi',
    title: 'Nimada yaxshilanmoqchisan?',
    subtitle: 'Mos keladiganlarni tanla.',
    key: 'better',
    options: [
      { icon: 'chatPlus', color: '#f0b400', label: 'Suhbat boshlash' },
      { icon: 'eye', color: '#a06bff', label: 'Ijtimoiy signallarni o‘qish' },
      { icon: 'megaphone', color: '#ff5c8a', label: 'Fikrimni aniq aytish' },
      { icon: 'book', color: '#4a90e2', label: 'Yaxshiroq hikoya qilish' },
    ],
  },

  {
    id: 'info1',
    type: 'info',
    title: 'Bilarmiding...',
    heading: 'Odamlar seni bir soniyaning o‘ndan birida baholaydi',
    bullets: [
      { icon: 'brain', color: '#a06bff', text: 'Eng yaxshi mutaxassislarning 90% i yuqori EQ ga ega' },
      { icon: 'trophy', color: '#f0b400', text: 'Ishonchli ko‘rinadiganlar 60% ko‘proq lider deb qabul qilinadi' },
      { icon: 'target', color: '#37d67a', text: 'Tuzilgan mashq 75% odamda ko‘proq ishonch uyg‘otadi' },
    ],
    note: 'Willis & Todorov (Princeton, 2006); HBR (2019)',
  },

  {
    id: 'superpower',
    type: 'superpower',
    title: 'Ijtimoiy super-kuching qaysi?',
    subtitle: 'O‘zingga eng yaqinini tanla.',
    key: 'superpower',
    options: [
      { icon: 'heart', color: '#ff5c8a', title: 'Iliqlik', desc: 'Odamlarni chin dildan qadrlanayotgandek his qildiraman' },
      { icon: 'smile', color: '#f0b400', title: 'Hazil', desc: 'Kulguli, tez fikrli, birga bo‘lish yoqimli' },
      { icon: 'balance', color: '#37d67a', title: 'Hozirlik', desc: 'Xotirjam, barqaror va ishonchli qolaman' },
      { icon: 'search', color: '#a06bff', title: 'Qiziquvchanlik', desc: 'Yaxshi savol beraman va chin dildan tinglayman' },
    ],
  },

  {
    id: 'commitTime',
    type: 'single',
    title: 'Kuniga qancha mashqqa vaqt ajrata olasan?',
    key: 'commitTime',
    options: [
      { icon: 'seed', color: '#37d67a', label: '5 daqiqa' },
      { icon: 'leaf', color: '#2e9e5b', label: '10 daqiqa' },
      { icon: 'tree', color: '#1f8a4c', label: '15 daqiqa' },
      { icon: 'alarm', color: '#f0b400', label: '20+ daqiqa' },
    ],
  },

  { id: 't1', type: 'transition', title: 'Javoblaring tahlil qilinmoqda...', loader: true },

  { id: 'score', type: 'score' },

  { id: 'commit', type: 'commit' },
]
