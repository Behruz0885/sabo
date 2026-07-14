// Onboarding qadamlari — Gleam tuzilishi asosida, o'zbekchada.
// type: text | single | multi | grid | likert | slider | info | superpower
//       | transition | graph | score | commit | notify

export const LIKERT = [
  { emoji: '😠', label: 'Umuman rozi emasman', color: '#ff5c5c' },
  { emoji: '🙁', label: 'Rozi emasman', color: '#e08a3c' },
  { emoji: '😐', label: 'Betaraf', color: '#5b7cc4' },
  { emoji: '🙂', label: 'Roziman', color: '#37d67a' },
  { emoji: '😄', label: 'To‘liq roziman', color: '#a06bff' },
]

export const STEPS = [
  { id: 'name', type: 'text', title: 'Isming nima?', placeholder: 'Isming', key: 'name' },

  {
    id: 'gender',
    type: 'single',
    title: 'Men o‘zimni...',
    key: 'gender',
    extra: 'Aytishni istamayman',
    options: [
      { icon: '♂️', label: 'Erkak' },
      { icon: '♀️', label: 'Ayol' },
      { icon: '⚧', label: 'Boshqa' },
    ],
  },

  {
    id: 'source',
    type: 'single',
    title: 'Biz haqimizda qayerdan eshitding?',
    subtitle: 'Odamlar bizni qayerdan topayotganini bilishga yordam ber.',
    key: 'source',
    options: [
      { icon: '📸', label: 'Instagram' },
      { icon: '🎵', label: 'TikTok' },
      { icon: '👥', label: 'Do‘stlar' },
      { icon: '🤖', label: 'AI vositalar (ChatGPT...)' },
      { icon: '🐦', label: 'X / Twitter' },
      { icon: '🔍', label: 'Google qidiruv' },
      { icon: '📄', label: 'Boshqa' },
    ],
  },

  {
    id: 'goals',
    type: 'grid',
    title: 'Bugun seni nima olib keldi?',
    subtitle: 'Mos keladiganlarning barchasini tanla.',
    key: 'goals',
    options: [
      { icon: '👑', label: 'Ko‘proq ishonchli bo‘lish' },
      { icon: '❤️', label: 'Muhabbat hayotini yaxshilash' },
      { icon: '💼', label: 'Karьerani rivojlantirish' },
      { icon: '🤝', label: 'Ko‘proq odamlar bilan bog‘lanish' },
    ],
  },

  {
    id: 'moment',
    type: 'single',
    title: 'Muayyan bir lahzaga tayyorgarlik ko‘ryapsanmi?',
    subtitle: 'Rejangni jadvalingga moslaymiz.',
    key: 'moment',
    options: [
      { icon: '🗓', label: 'Ha, shu hafta' },
      { icon: '📅', label: 'Ha, keyingi ikki haftada' },
      { icon: '📆', label: 'Ha, keyingi oy ichida' },
      { icon: '✨', label: 'Yo‘q, hayot uchun rivojlanyapman' },
    ],
  },

  {
    id: 'recharge',
    type: 'slider',
    title: 'Qanday qilib quvvat olasan?',
    subtitle: 'Javobingni tanlash uchun suring.',
    key: 'recharge',
    leftLabel: 'Yolg‘iz qolib',
    rightLabel: 'Odamlar orasida',
  },

  { id: 't1', type: 'transition', title: 'Bir nechta tezkor savol. Bugun senga eng to‘g‘ri kelganini tanla.' },

  {
    id: 'meet',
    type: 'single',
    title: 'Yangi odamlar bilan tanishishda o‘zingga qanchalik ishonasan?',
    key: 'meet',
    options: [
      { icon: '📊', label: 'Juda ishonchli' },
      { icon: '📉', label: 'Qisman ishonchli' },
      { icon: '📕', label: 'Umuman ishonchli emas' },
    ],
  },

  { id: 'l1', type: 'likert', title: 'Suhbatni ravon davom ettirishni yaxshilamoqchiman', key: 'l1' },

  {
    id: 'info1',
    type: 'info',
    title: 'Bilarmiding...',
    heading: 'Odamlar seni bir soniyaning o‘ndan birida baholaydi',
    bullets: [
      { icon: '🧠', text: 'Eng yaxshi mutaxassislarning 90% i yuqori EQ ga ega' },
      { icon: '🦅', text: 'Ishonchli ko‘rinadiganlar 60% ko‘proq kuchli lider deb qabul qilinadi' },
      { icon: '🎯', text: 'Tuzilgan mashq 75% odamda ko‘proq ishonch uyg‘otadi' },
    ],
    note: 'Willis & Todorov (Princeton, 2006); HBR (2019)',
  },

  {
    id: 'better',
    type: 'multi',
    title: 'Nimada yaxshilanmoqchisan?',
    subtitle: 'Mos keladiganlarni tanla. Bu tajribangni cheklamaydi.',
    key: 'better',
    options: [
      { icon: '➕', label: 'Suhbat boshlash' },
      { icon: '✨', label: 'Uchqunni saqlab qolish' },
      { icon: '👁', label: 'Ijtimoiy signallarni o‘qish' },
      { icon: '🏆', label: 'Esda qoladigan taassurot qoldirish' },
      { icon: '📢', label: 'Fikrimni aniq aytish' },
      { icon: '📖', label: 'Yaxshiroq hikoya qilish' },
    ],
  },

  { id: 'l2', type: 'likert', title: 'Yig‘ilishlarda gapirganda o‘zimni xotirjam his qilaman', key: 'l2' },

  {
    id: 'strangers',
    type: 'slider',
    title: 'Notanish odamlar to‘la xonada o‘zimni qulay his qilaman',
    subtitle: 'Javobingni tanlash uchun suring.',
    key: 'strangers',
    leftLabel: 'Ishonchsiz',
    rightLabel: 'Juda ishonchli',
  },

  {
    id: 'attractive',
    type: 'slider',
    title: 'Yoqtirgan odaming bilan gaplashishda qanchalik ishonchlisan?',
    subtitle: 'Javobingni tanlash uchun suring.',
    key: 'attractive',
    leftLabel: 'Ishonchsiz',
    rightLabel: 'Juda ishonchli',
  },

  {
    id: 'info2',
    type: 'info',
    title: 'Bilarmiding...',
    heading: 'Gap topolmay qolish his qilinganidan ko‘ra normalroq',
    bullets: [
      { icon: '❓', text: 'Ko‘pchilik suhbatdan keyin qanday ko‘ringanini ortiqcha o‘ylaydi' },
      { icon: '👥', text: 'Bitta yaxshi savol boshi berk ko‘chani haqiqiy aloqaga aylantiradi' },
      { icon: '🔗', text: 'Suhbat — oddiy naqshlar bilan rivojlantirsa bo‘ladigan ko‘nikma' },
    ],
    note: 'Boothby et al. (2018); Huang et al. (2017); Bandura (1977)',
  },

  {
    id: 'superpower',
    type: 'superpower',
    title: 'Ijtimoiy super-kuching qaysi?',
    subtitle: 'O‘zingga eng yaqinini tanla.',
    key: 'superpower',
    options: [
      { icon: '❤️', title: 'Iliqlik', desc: 'Odamlarni chin dildan qadrlanayotgandek his qildiraman' },
      { icon: '😄', title: 'Hazil', desc: 'Men kulguli, tez fikrli, birga bo‘lish yoqimli' },
      { icon: '🧘', title: 'Hozirlik', desc: 'Xotirjam, barqaror va ishonchli qolaman' },
      { icon: '🔍', title: 'Qiziquvchanlik', desc: 'Yaxshi savol beraman va chin dildan tinglayman' },
    ],
  },

  { id: 't2', type: 'transition', title: 'Javoblaringni shaxsiy ballga aylantirdik.' },

  {
    id: 'frequency',
    type: 'single',
    title: 'Yangi ijtimoiy vaziyatlarni qanchalik tez-tez sinaysan?',
    key: 'frequency',
    options: [
      { icon: '🚫', label: 'Juda kam' },
      { icon: '⏱', label: 'Ba’zan' },
      { icon: '✅', label: 'Tez-tez' },
      { icon: '🔥', label: 'Juda tez-tez' },
    ],
  },

  { id: 't3', type: 'transition', title: 'Javoblaring tahlil qilinmoqda...', loader: true },

  { id: 't4', type: 'transition', title: 'Esda tut, bu baho emas — bu sening boshlang‘ich nuqtang!' },

  { id: 'graph', type: 'graph', title: 'Kuniga 5 daqiqada ko‘proq ishonchli bo‘lasan' },

  {
    id: 'commitTime',
    type: 'single',
    title: 'Kuniga qancha mashqqa vaqt ajrata olasan?',
    key: 'commitTime',
    options: [
      { icon: '🌱', label: '5 daqiqa' },
      { icon: '🌿', label: '10 daqiqa' },
      { icon: '🌳', label: '15 daqiqa' },
      { icon: '⏰', label: '20+ daqiqa' },
    ],
  },

  { id: 'score', type: 'score' },

  { id: 'commit', type: 'commit' },
]
