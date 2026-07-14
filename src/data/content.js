// Sabo — to'liq kontent. Kurslar, ularning darslari (nazariya, quiz, AI mashq).

export const COURSES = [
  {
    id: 'charisma',
    category: 'Karizma',
    title: 'Ichki o‘yin',
    icon: 'crown',
    color: '#f0b400',
    lessons: [
      {
        title: 'His qildir, ko‘rinma',
        reward: 20,
        concepts: [
          { emoji: '✨', heading: 'Karizma — o‘zingni ko‘rsatish emas', body: 'Odamlar seni tez unutadi, lekin sen bilan bo‘lganda o‘zlarini qanday his qilganini uzoq eslaydi. Karizma — aynan shu his.' },
          { emoji: '👂', heading: 'Diqqatni ularga qarat', body: 'Eng jozibali odamlar ko‘p gapirmaydi — yaxshi savol beradi va chin dildan tinglaydi. Suhbatni suhbatdoshing haqida qil.' },
        ],
        quiz: [
          { q: 'Karizma asosan nimaga bog‘liq?', options: ['Qimmat kiyim', 'Odamlarni qanday his qildirishing', 'Ko‘p gapirish', 'Baland ovoz'], correct: 1, explain: 'Karizma — odamlarda qoldirgan hissing.' },
          { q: 'Haqiqiy aloqani qanday yaratasan?', options: ['O‘zing haqingda ko‘p gapirib', 'Ochiq savol berib va tinglab', 'Telefonga qarab', 'Jim turib'], correct: 1, explain: 'Savol + samimiy tinglash qadrlanish hissini beradi.' },
        ],
        practice: { scenario: 'Tanishuv kechasidasan. Yoningdagi notanish odam bilan iliq suhbat boshla.', goal: 'Kamida bitta ochiq savol ber.', persona: 'Kamola' },
      },
      {
        title: 'Karizma baland ovoz emas',
        reward: 20,
        concepts: [
          { emoji: '🧘', heading: 'Xotirjamlik — kuch', body: 'Shoshmaslik va vazminlik ishonch belgisi. Pauza qilishdan qo‘rqma — u so‘zlaringga vazn beradi.' },
        ],
        quiz: [
          { q: 'Ishonchli odam suhbatда...', options: ['Tez va ko‘p gapiradi', 'Vazmin, pauza bilan gapiradi', 'Baqiradi', 'Jim qoladi'], correct: 1, explain: 'Vazminlik va pauza — ishonch belgisi.' },
        ],
        practice: { scenario: 'Do‘sting biror muammosini aytyapti. Uni shoshmasdan, vazmin tingla va javob ber.', goal: 'Shoshilmasdan, o‘ylab javob ber.', persona: 'Jasur' },
      },
      {
        title: 'Uni soxtalashtira olmaysan',
        reward: 20,
        concepts: [
          { emoji: '💎', heading: 'Samimiylik hammasidan ustun', body: 'Odamlar soxtalikni sezadi. O‘zing bo‘l — bu eng jozibali holat. Kamchiliklaringni ham qabul qil.' },
        ],
        quiz: [
          { q: 'Eng jozibali holat qaysi?', options: ['Boshqa birov bo‘lib ko‘rinish', 'O‘zing bo‘lish', 'Hammaga yoqishga urinish', 'Hech qachon xato qilmaslik'], correct: 1, explain: 'Samimiylik — haqiqiy jozibaning asosi.' },
        ],
        practice: { scenario: 'Yangi tanishing seni maqtadi. Samimiy va tabiiy javob ber.', goal: 'Maqtovni tabiiy qabul qil.', persona: 'Dilnoza' },
      },
      {
        title: 'Xonadan hech narsa kutma',
        reward: 25,
        concepts: [
          { emoji: '🎁', heading: 'Berish holati', body: 'Suhbatga “nima olaman” emas, “nima bera olaman” fikri bilan kir. Bu bosim va tashvishni yo‘qotadi.' },
        ],
        quiz: [
          { q: 'Suhbatga qanday kirish kerak?', options: ['Nimadir olish niyatida', 'Berish/ulashish holatida', 'Hech narsa o‘ylamay', 'Qo‘rquv bilan'], correct: 1, explain: 'Berish holati bosimni yo‘qotadi.' },
        ],
        practice: { scenario: 'Tadbirda notanish odamga o‘zingdan foydali biror narsa ulash.', goal: 'Suhbatdoshga qiymat ber.', persona: 'Aziz' },
      },
    ],
  },

  {
    id: 'convo',
    category: 'Suhbat asoslari',
    title: 'Qayta sozlash',
    icon: 'chatPlus',
    color: '#4a90e2',
    lessons: [
      {
        title: 'Suhbatni qanday boshlash',
        reward: 20,
        concepts: [
          { emoji: '👋', heading: 'Oddiy boshlanish yetarli', body: '“Salom” + atrofdagi biror narsaga izoh yoki savol. Mukammal jumla shart emas — tabiiylik muhim.' },
        ],
        quiz: [
          { q: 'Suhbatni boshlashning eng oson yo‘li?', options: ['Mukammal jumla o‘ylab topish', 'Salom + oddiy savol', 'Kutish', 'Hech narsa demaslik'], correct: 1, explain: 'Oddiy salom va savol yetarli.' },
        ],
        practice: { scenario: 'Kutubxonada yoningda o‘tirgan odam bilan suhbat boshla.', goal: 'Tabiiy salom va savol bilan boshla.', persona: 'Malika' },
      },
      {
        title: 'Ravon davom ettirish',
        reward: 20,
        concepts: [
          { emoji: '🔄', heading: 'Ilib olish texnikasi', body: 'Suhbatdoshning gapidagi biror detalni “ilib ol” va shu haqda savol ber. Suhbat tabiiy davom etadi.' },
        ],
        quiz: [
          { q: 'Suhbat to‘xtab qolmasligi uchun?', options: ['Mavzuni keskin o‘zgartirish', 'Gapidagi detalni ilib, savol berish', 'Jim qolish', 'Faqat “ha” deyish'], correct: 1, explain: 'Detalni ilib olish suhbatni ravon qiladi.' },
        ],
        practice: { scenario: 'Suhbatdoshing dam olishga borganини aytdi. Shu haqda chuqurroq savol ber.', goal: 'Uning gapidan detal ilib, savol ber.', persona: 'Bekzod' },
      },
      {
        title: 'Chiroyli yakunlash',
        reward: 20,
        concepts: [
          { emoji: '🤝', heading: 'Ijobiy tugatish', body: 'Suhbatni iliq nota bilan yakunla: “Sen bilan gaplashish yoqimli ekan” + keyingi qadam (aloqa almashish).' },
        ],
        quiz: [
          { q: 'Suhbatni qanday yakunlash yaxshi?', options: ['To‘satdan ketib qolish', 'Iliq so‘z + aloqa almashish', 'Hech narsa demay', 'Uzr so‘rab'], correct: 1, explain: 'Iliq yakun taassurotni mustahkamlaydi.' },
        ],
        practice: { scenario: 'Yoqimli suhbatni yakunlab, aloqa almashmoqchisan.', goal: 'Iliq yakunla va aloqa taklif qil.', persona: 'Nigora' },
      },
    ],
  },

  {
    id: 'dating',
    category: 'Tanishuv',
    title: 'Ichki muvozanat',
    icon: 'heart',
    color: '#ff5c8a',
    lessons: [
      {
        title: 'Ichki muvozanat',
        reward: 20,
        concepts: [
          { emoji: '⚖️', heading: 'Natijaga bog‘lanma', body: 'Natijaga ortiqcha bog‘lanish tashvish tug‘diradi. Suhbatdan zavq ol — bosim tushadi, tabiiy bo‘lasan.' },
        ],
        quiz: [
          { q: 'Tanishuvда tashvishni nima kamaytiradi?', options: ['Natijaга bog‘lanmaslik', 'Ko‘proq o‘ylash', 'Rejalar tuzish', 'Qochish'], correct: 0, explain: 'Jarayondan zavq olish bosimni kamaytiradi.' },
        ],
        practice: { scenario: 'Yoqtirgan odaming bilan birinchi suhbat. Tabiiy va bosimsiz gaplash.', goal: 'Zavq bilan, bosimsiz suhbatlash.', persona: 'Sevara' },
      },
      {
        title: 'Qiziqish bildirish',
        reward: 20,
        concepts: [
          { emoji: '👀', heading: 'Samimiy e’tibor', body: 'Chin qiziqish — eng kuchli jozibador xususiyat. Savol ber, ismini eslab qol, gaplarini eshit.' },
        ],
        quiz: [
          { q: 'Jozibaning kuchli belgisi?', options: ['Befarqlik', 'Samimiy qiziqish', 'Maqtanish', 'Sovuqqonlik'], correct: 1, explain: 'Samimiy qiziqish o‘ziga tortadi.' },
        ],
        practice: { scenario: 'Yoqtirgan odaming hobbisi haqida gapirdi. Chin qiziqish bildir.', goal: 'Samimiy qiziqish va savollar bilan davom et.', persona: 'Sevara' },
      },
      {
        title: 'Chegara va hurmat',
        reward: 20,
        concepts: [
          { emoji: '🛡', heading: 'O‘zingga va unga hurmat', body: 'Sog‘lom munosabat hurmatdan boshlanadi. “Yo‘q” ni qabul qil, o‘z chegarangni ham bil.' },
        ],
        quiz: [
          { q: 'Sog‘lom munosabat asosi?', options: ['Bosim', 'O‘zaro hurmat va chegara', 'Doim rozi bo‘lish', 'Manipulyatsiya'], correct: 1, explain: 'Hurmat va chegara — asos.' },
        ],
        practice: { scenario: 'Suhbatdoshing taklifingni rad etdi. Hurmat bilan javob ber.', goal: 'Rad javobini hurmat bilan qabul qil.', persona: 'Sevara' },
      },
    ],
  },

  {
    id: 'friends',
    category: 'Do‘st orttirish',
    title: 'O‘z odamlaringni topish',
    icon: 'people',
    color: '#a06bff',
    lessons: [
      {
        title: 'Birinchi qadam sendan',
        reward: 20,
        concepts: [
          { emoji: '🚀', heading: 'Tashabbus ko‘rsat', body: 'Do‘stlik ko‘pincha bir kishining tashabbusidan boshlanadi. Birinchi bo‘lib yozishdan yoki taklif qilishdan qo‘rqma.' },
        ],
        quiz: [
          { q: 'Yangi do‘stlik qanday boshlanadi?', options: ['O‘z-o‘zidan', 'Kimningdir tashabbusidan', 'Tasodifan', 'Hech qachon'], correct: 1, explain: 'Tashabbus muhim — birinchi qadamni tashla.' },
        ],
        practice: { scenario: 'Kursda tanish yigit/qizni kofega taklif qilmoqchisan.', goal: 'Tabiiy taklif qil.', persona: 'Sardor' },
      },
      {
        title: 'Umumiylik topish',
        reward: 20,
        concepts: [
          { emoji: '🔗', heading: 'Umumiy nuqta', body: 'Do‘stlik umumiy qiziqishlardan o‘sadi. Suhbatда umumiylik izla — sport, kino, sayohat.' },
        ],
        quiz: [
          { q: 'Do‘stlik nimadan o‘sadi?', options: ['Umumiy qiziqishlardan', 'Majburiyatdan', 'Tasodifdan', 'Sukutdan'], correct: 0, explain: 'Umumiy qiziqish yaqinlashtiradi.' },
        ],
        practice: { scenario: 'Yangi tanishing bilan umumiy qiziqish izlab suhbatlash.', goal: 'Umumiy mavzu top.', persona: 'Sardor' },
      },
      {
        title: 'Aloqani saqlash',
        reward: 20,
        concepts: [
          { emoji: '📞', heading: 'Muntazamlik', body: 'Do‘stlik e’tibor bilan yashaydi. Vaqti-vaqti bilan xabar yoz, holidan xabar ol.' },
        ],
        quiz: [
          { q: 'Do‘stlikni nima saqlaydi?', options: ['Muntazam e’tibor', 'Unutish', 'Faqat bayramlarda eslash', 'Kutish'], correct: 0, explain: 'Muntazam e’tibor aloqani saqlaydi.' },
        ],
        practice: { scenario: 'Ancha yozishmagan do‘stingga xabar yozmoqchisan.', goal: 'Iliq va tabiiy xabar boshla.', persona: 'Sardor' },
      },
    ],
  },

  {
    id: 'work',
    category: 'Ish joyidagi muloqot',
    title: 'Ishonchli taqdimot',
    icon: 'briefcase',
    color: '#37d67a',
    lessons: [
      {
        title: 'Yig‘ilishda gapirish',
        reward: 20,
        concepts: [
          { emoji: '🗣', heading: 'Fikringni ayt', body: 'Yig‘ilishда jim o‘tirma. Qisqa, aniq fikr bildirish — professional ishonch belgisi.' },
        ],
        quiz: [
          { q: 'Yig‘ilishda qanday gapirish yaxshi?', options: ['Uzoq va murakkab', 'Qisqa va aniq', 'Umuman gapirmaslik', 'Boshqalarni bo‘lish'], correct: 1, explain: 'Qisqa va aniqlik — ta’sirli.' },
        ],
        practice: { scenario: 'Jamoaviy yig‘ilishда g‘oyangni taqdim qilyapsan.', goal: 'G‘oyani qisqa va aniq ayt.', persona: 'Rahbar' },
      },
      {
        title: 'Ish suhbati (intervyu)',
        reward: 25,
        concepts: [
          { emoji: '💼', heading: 'STAR usuli', body: 'Yutuqlaringni STAR bilan ayt: Vaziyat – Vazifa – Harakat – Natija. Aniq misol — kuchli taassurot.' },
        ],
        quiz: [
          { q: 'Intervyuда tajribani qanday aytish yaxshi?', options: ['Umumiy gaplar bilan', 'STAR (aniq misol) bilan', 'Maqtanib', 'Qisqa “ha/yo‘q”'], correct: 1, explain: 'STAR — aniq va ishonarli.' },
        ],
        practice: { scenario: 'Ish suhbatidasan. “O‘zingiz haqingizda gapiring” deyishdi.', goal: 'Qisqa, ishonchli o‘zini tanishtir.', persona: 'HR menejer' },
      },
      {
        title: 'Konfliktni hal qilish',
        reward: 20,
        concepts: [
          { emoji: '🕊', heading: 'Muammoga qarshi, odamга emas', body: 'Kelishmovchilikда shaxsga emas, muammoga qarat. “Men” tilida gapir: “Menimcha...”, “Men shunday his qildim...”.' },
        ],
        quiz: [
          { q: 'Konfliktда qanday gapirish kerak?', options: ['Ayblab', '“Men” tilida, muammoga qarab', 'Baqirib', 'Jim qolib'], correct: 1, explain: '“Men” tili keskinlikni kamaytiradi.' },
        ],
        practice: { scenario: 'Hamkasbing bilan kelishmovchilik chiqdi. Xotirjam hal qilmoqchisan.', goal: '“Men” tilida, hurmat bilan gaplash.', persona: 'Hamkasb' },
      },
    ],
  },
]

export const COURSE_SUBTITLE = {
  charisma: 'Bemalol karizma ortidagi ichki holatni qayta sozlash.',
  convo: 'Har qanday suhbatni ishonch bilan boshlash va davom ettirish.',
  dating: 'Bosimsiz, tabiiy va o‘ziga ishongan tanishuv.',
  friends: 'Yangi do‘stlik boshlash va uni saqlab qolish.',
  work: 'Ish joyida aniq, ishonchli va ta’sirli muloqot.',
}

// Dars taxminiy davomiyligi (daqiqa)
export function lessonMinutes(lesson) {
  return 5 + (lesson.concepts?.length || 0) + (lesson.quiz?.length || 0)
}

// Kategoriyaga qarab kutubxona
export function libraryByCategory() {
  const map = {}
  for (const c of COURSES) {
    if (!map[c.category]) map[c.category] = []
    map[c.category].push(c)
  }
  return Object.entries(map).map(([category, courses]) => ({ category, courses }))
}

export function getCourse(id) {
  return COURSES.find((c) => c.id === id) || COURSES[0]
}

// Onboarding javoblariga qarab boshlang'ich kursni tanlash
export function pickCourseId(profile) {
  const goals = profile?.goals || []
  if (goals.some((g) => g.includes('Muhabbat'))) return 'dating'
  if (goals.some((g) => g.includes('Karьera') || g.includes('Karyera'))) return 'work'
  if (goals.some((g) => g.includes('bog‘lanish') || g.includes('boglanish'))) return 'friends'
  if (goals.some((g) => g.includes('ishonchli'))) return 'charisma'
  return 'convo'
}
