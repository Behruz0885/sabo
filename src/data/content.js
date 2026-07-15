// Sabo — kontent. Matnlar iliq, hikoyaviy va insoniy ohangda yozilgan.

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
          {
            emoji: '✨',
            heading: 'Odamlar sizni tuyg‘u orqali eslaydi',
            body:
              'Bir yil oldin kimdir bilan aynan nima haqida gaplashganingiz esingizdami? Ehtimol yo‘q. ' +
              'Lekin o‘sha odam yoningizda o‘zingizni qanday his qilganingiz — yengilmi yoki tarangmi — hali ham yodingizda. ' +
              'Karizma ham shunaqa: aytgan gapingiz emas, qoldirgan tuyg‘uingiz esda qoladi.',
          },
          {
            emoji: '👂',
            heading: 'Diqqatni o‘zingizdan olib, unga bering',
            body:
              'Ko‘pchilik suhbatda “keyin nima desam” deb o‘ylab yuradi. Aslida sehr boshqa joyda: ' +
              'suhbatdoshga chin qiziqish bilan bitta savol bering va javobini bo‘lmasdan tinglang. ' +
              'Shu bitta odat sizni xonadagi eng yoqimli odamga aylantiradi.',
          },
        ],
        quiz: [
          {
            q: 'Odamda karizmatik taassurot nima qoldiradi?',
            options: ['Chiroyli kiyimi', 'U yoningizda o‘zingizni qanday his qilganingiz', 'Qancha ko‘p gapirgani', 'Ovozining balandligi'],
            correct: 1,
            explain: 'Detallar unutiladi, tuyg‘u qoladi. Odamni o‘zi haqida yaxshi his qildirsangiz — sizni eslab qoladi.',
          },
        ],
        practice: {
          scenario: 'Tadbirda yoningizda notanish odam turibdi. Uni suhbatga torting va o‘ziga qiziqayotganingizni his qildiring.',
          goal: 'Kamida bitta ochiq savol bering va javobiga chin e’tibor qarating.',
          persona: 'Kamola',
        },
      },
      {
        title: 'Karizma baland ovoz emas',
        reward: 20,
        concepts: [
          {
            emoji: '🌿',
            heading: 'Vazminlik — ishonchning tili',
            body:
              'Eng ishonchli odamlar tez gapirmaydi. Ular pauza qilishdan qo‘rqmaydi. ' +
              'Bir zum jimlik — bo‘shliq emas, u sizning so‘zingizga vazn beradi. ' +
              'Keyingi suhbatda javob berishdan oldin bir nafas oling; o‘zingiz ham farqni sezasiz.',
          },
        ],
        quiz: [
          {
            q: 'Ishonchli odam odatda qanday gapiradi?',
            options: ['Tez va to‘xtovsiz', 'Vazmin, o‘rinli pauzalar bilan', 'Imkon qadar baland', 'Umuman jim'],
            correct: 1,
            explain: 'Shoshmaslik “men shoshilmayapman, o‘zimga ishonaman” degani. Pauza — kuch belgisi.',
          },
        ],
        practice: {
          scenario: 'Do‘stingiz muammosini hayajon bilan aytyapti. Uni bo‘lmasdan, vazmin tinglang va o‘ylab javob bering.',
          goal: 'Shoshmang — avval tinglang, keyin javob bering.',
          persona: 'Jasur',
        },
      },
      {
        title: 'Uni soxtalashtirib bo‘lmaydi',
        reward: 20,
        concepts: [
          {
            emoji: '💎',
            heading: 'Odamlar soxtalikni bir zumda sezadi',
            body:
              'Boshqa birov bo‘lishga urinsangiz, bu taranglik sifatida seziladi. ' +
              'Aksincha, kichik kamchiliklaringiz bilan o‘zingiz bo‘lsangiz — bu yaqinlik uyg‘otadi. ' +
              'Mukammal ko‘rinishga emas, samimiy bo‘lishga harakat qiling.',
          },
        ],
        quiz: [
          {
            q: 'Qaysi holat ko‘proq jozibador?',
            options: ['Hammaga yoqishga urinish', 'Tabiiy, o‘zingiz bo‘lish', 'Hech qachon xato qilmaslik', 'Doim rozi bo‘lish'],
            correct: 1,
            explain: 'Haqiqiylik — eng kam uchraydigan, shuning uchun eng jozibali sifat.',
          },
        ],
        practice: {
          scenario: 'Yangi tanishingiz sizni maqtadi. Uni tabiiy, hech mubolag‘asiz qabul qiling.',
          goal: 'Maqtovni kamtarona, ammo dadil qabul qiling.',
          persona: 'Dilnoza',
        },
      },
      {
        title: 'Xonadan hech narsa kutmang',
        reward: 25,
        concepts: [
          {
            emoji: '🎁',
            heading: '“Nima olaman” emas, “nima beraman”',
            body:
              'Suhbatga “meni yoqtirishsinmi?” degan tashvish bilan kirsangiz, har bir gap imtihonga aylanadi. ' +
              'Fikringizni o‘zgartiring: “men bu odamga nima yaxshilik bera olaman?” — kulgimi, e’tibormi, foydali fikr. ' +
              'Shu ondayoq bosim yo‘qoladi va siz erkinroq bo‘lasiz.',
          },
        ],
        quiz: [
          {
            q: 'Suhbatga qanday niyat bilan kirish yengil qiladi?',
            options: ['Tasdiq izlab', 'Berish/ulashish niyatida', 'Hech narsa o‘ylamay', 'Hukmdan qo‘rqib'],
            correct: 1,
            explain: 'Berish holati e’tiborni o‘zingizdan olib, tabiiylik va xotirjamlik beradi.',
          },
        ],
        practice: {
          scenario: 'Tadbirda notanish odamga o‘zingizdan foydali bir narsa (tavsiya, fikr, yordam) ulashing.',
          goal: 'Suhbatdoshga aniq bir qiymat bering.',
          persona: 'Aziz',
        },
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
        title: 'Suhbatni boshlash',
        reward: 20,
        concepts: [
          {
            emoji: '👋',
            heading: 'Mukammal jumla shart emas',
            body:
              'Ko‘pchilik “nima desam eng zo‘r bo‘ladi?” deb o‘ylab, natijada hech nima demaydi. ' +
              'Aslida oddiy salom va atrofdagi biror narsaga izoh yetarli: “Bu yer ancha gavjum ekan-a?”. ' +
              'Boshlanish mazmuni emas, boshlash jasorati muhim.',
          },
        ],
        quiz: [
          {
            q: 'Suhbatni boshlashning eng oson yo‘li?',
            options: ['Aqlli jumla o‘ylab topish', 'Oddiy salom + kichik izoh yoki savol', 'Kimdir boshlashini kutish', 'Jim turaverish'],
            correct: 1,
            explain: 'Eng yaxshi ochilishlar oddiy. Muhimi — birinchi qadamni o‘zingiz tashlash.',
          },
        ],
        practice: { scenario: 'Kutubxonada yoningizda o‘tirgan odam bilan suhbat boshlang.', goal: 'Tabiiy salom va yengil savol bilan boshlang.', persona: 'Malika' },
      },
      {
        title: 'Suhbatni ravon davom ettirish',
        reward: 20,
        concepts: [
          {
            emoji: '🪝',
            heading: '“Ilib olish” usuli',
            body:
              'Suhbat to‘xtab qolganda aybdor — quruq javoblar. Yechim oddiy: suhbatdoshning gapidan bitta detalni ilib oling. ' +
              '“Dam olishga borgandim” desa — “Qayerga? Nimasi yoqdi?” Har javobda keyingi savol uchun ip yashiringan.',
          },
        ],
        quiz: [
          {
            q: 'Suhbat to‘xtab qolmasligi uchun nima qilasiz?',
            options: ['Mavzuni keskin o‘zgartirasiz', 'Gapidagi detalni ilib, savol berasiz', 'Jim qolasiz', 'Faqat “ha-ha” deysiz'],
            correct: 1,
            explain: 'Detalni ilib olish suhbatni tabiiy va bosimsiz davom ettiradi.',
          },
        ],
        practice: { scenario: 'Suhbatdoshingiz yaqinda sayohatga borganini aytdi. Shu haqda chuqurroq so‘rang.', goal: 'Uning gapidan detal ilib, savol bering.', persona: 'Bekzod' },
      },
      {
        title: 'Chiroyli yakunlash',
        reward: 20,
        concepts: [
          {
            emoji: '🤝',
            heading: 'Oxirgi taassurot ham muhim',
            body:
              'Suhbatni noqulay “xo‘p, mayli...” bilan emas, iliq nota bilan yakunlang: ' +
              '“Siz bilan gaplashish yoqimli ekan, keyin ham davom ettiramiz” + aloqa almashish. ' +
              'Shunda odam siz bilan uchrashuvni yaxshi xotira sifatida saqlaydi.',
          },
        ],
        quiz: [
          {
            q: 'Suhbatni qanday yakunlash yaxshi taassurot qoldiradi?',
            options: ['To‘satdan ketib qolish', 'Iliq so‘z + aloqa almashish', 'Hech nima demay ketish', 'Uzr so‘rab qochish'],
            correct: 1,
            explain: 'Iliq yakun — keyingi uchrashuvga ochilgan eshik.',
          },
        ],
        practice: { scenario: 'Yoqimli suhbat tugadi, aloqa almashmoqchisiz.', goal: 'Iliq yakunlang va aloqa taklif qiling.', persona: 'Nigora' },
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
          {
            emoji: '⚖️',
            heading: 'Natijaga yopishmang',
            body:
              '“U meni yoqtirsa-yu...” degan o‘y har bir so‘zingizni og‘irlashtiradi. ' +
              'Diqqatni natijadan jarayonga ko‘chiring: shunchaki suhbatdan zavq oling. ' +
              'Ajablanarlisi — aynan shunda siz tabiiy va jozibali bo‘lasiz.',
          },
        ],
        quiz: [
          {
            q: 'Tanishuvdagi tashvishni nima kamaytiradi?',
            options: ['Natijaga yopishmaslik', 'Ko‘proq rejalab olish', 'Har so‘zni o‘lchash', 'Umuman gapirmaslik'],
            correct: 0,
            explain: 'Jarayondan zavq olsangiz, bosim tushadi va o‘zingiz bo‘lasiz.',
          },
        ],
        practice: { scenario: 'Yoqtirgan insoningiz bilan birinchi suhbat. Bosimsiz, zavq bilan gaplashing.', goal: 'Natija haqida emas, suhbat haqida o‘ylang.', persona: 'Sevara' },
      },
      {
        title: 'Chin qiziqish bildirish',
        reward: 20,
        concepts: [
          {
            emoji: '👀',
            heading: 'E’tibor — eng kuchli joziba',
            body:
              'Odamlar o‘zini ko‘rsatishga uringanlarni emas, o‘zlarini chin dildan tinglaganlarni yoqtiradi. ' +
              'Ismini eslang, gapiga qiziqing, tafsilotini so‘rang. Bu — hech qanday “texnika”dan kuchliroq.',
          },
        ],
        quiz: [
          {
            q: 'Nima ko‘proq jozibador?',
            options: ['O‘zini maqtash', 'Suhbatdoshga chin qiziqish', 'Befarq ko‘rinish', 'Sovuqqonlik'],
            correct: 1,
            explain: 'Chin qiziqish odamni qadrlanayotgandek his qildiradi — bu esa o‘ziga tortadi.',
          },
        ],
        practice: { scenario: 'Yoqtirgan insoningiz hobbisi haqida gapirdi. Chin qiziqish bilan davom eting.', goal: 'Samimiy savollar bilan chuqurlashtiring.', persona: 'Sevara' },
      },
      {
        title: 'Chegara va hurmat',
        reward: 20,
        concepts: [
          {
            emoji: '🛡',
            heading: 'Hurmat — sog‘lom yaqinlikning asosi',
            body:
              'Sog‘lom munosabat bosim bilan emas, hurmat bilan quriladi. ' +
              '“Yo‘q”ni bosiqlik bilan qabul qiling, o‘z chegarangizni ham bilib turing. ' +
              'Bu zaiflik emas — aksincha, kuchli va ishonchli odam belgisi.',
          },
        ],
        quiz: [
          {
            q: 'Sog‘lom munosabatning asosi nima?',
            options: ['Bosim o‘tkazish', 'O‘zaro hurmat va chegara', 'Doim rozi bo‘lish', 'Manipulyatsiya'],
            correct: 1,
            explain: 'Hurmat va aniq chegara ikkala tomonga ham xotirjamlik beradi.',
          },
        ],
        practice: { scenario: 'Taklifingiz rad etildi. Buni hurmat bilan qabul qiling.', goal: 'Rad javobini bosiqlik bilan qabul qiling.', persona: 'Sevara' },
      },
    ],
  },

  {
    id: 'friends',
    category: 'Do‘st orttirish',
    title: 'O‘z odamlaringizni topish',
    icon: 'people',
    color: '#a06bff',
    lessons: [
      {
        title: 'Birinchi qadam sizdan',
        reward: 20,
        concepts: [
          {
            emoji: '🚀',
            heading: 'Ko‘pchilik taklifni kutib o‘tiradi',
            body:
              'Hamma “meni chaqirishsa borardim” deb o‘ylaydi — shuning uchun hech kim chaqirmaydi. ' +
              'Do‘stlik odatda bitta odamning jur’atidan boshlanadi. Birinchi bo‘lib yozing yoki kofega taklif qiling — ' +
              'ko‘pchilik bundan xursand bo‘ladi.',
          },
        ],
        quiz: [
          {
            q: 'Yangi do‘stlik ko‘pincha qanday boshlanadi?',
            options: ['O‘z-o‘zidan', 'Kimningdir jur’atli birinchi qadamidan', 'Tasodifan', 'Hech qachon'],
            correct: 1,
            explain: 'Tashabbus — do‘stlikning kaliti. Kutmang, taklif qiling.',
          },
        ],
        practice: { scenario: 'Kursdagi tanishingizni kofega taklif qilmoqchisiz.', goal: 'Tabiiy va bosimsiz taklif qiling.', persona: 'Sardor' },
      },
      {
        title: 'Umumiylikni topish',
        reward: 20,
        concepts: [
          {
            emoji: '🔗',
            heading: 'Yaqinlik umumiylikdan o‘sadi',
            body:
              'Do‘stlik “bir xil narsani yoqtiramiz” degan tuyg‘udan kuchayadi. ' +
              'Suhbatda umumiy nuqta izlang — sport, kino, sayohat, ish. Topilgan har bir umumiylik ' +
              'ikkovingiz orasida ko‘prik bo‘ladi.',
          },
        ],
        quiz: [
          {
            q: 'Do‘stlik nimadan kuchayadi?',
            options: ['Umumiy qiziqishlardan', 'Majburiyatdan', 'Tasodifdan', 'Sukutdan'],
            correct: 0,
            explain: 'Umumiy nuqta — yaqinlashuvning tabiiy sababi.',
          },
        ],
        practice: { scenario: 'Yangi tanishingiz bilan umumiy qiziqish izlab suhbatlashing.', goal: 'Kamida bitta umumiy mavzu toping.', persona: 'Sardor' },
      },
      {
        title: 'Aloqani saqlash',
        reward: 20,
        concepts: [
          {
            emoji: '📞',
            heading: 'Do‘stlik e’tibor bilan yashaydi',
            body:
              'Eng yaxshi do‘stliklar ham e’tiborsizlikdan so‘nadi. ' +
              'Katta narsa shart emas: vaqti-vaqti bilan “Qalaysan?” deb yozing, biror qiziq narsani ulashing. ' +
              'Kichik, muntazam e’tibor — uzoq do‘stlikning siri.',
          },
        ],
        quiz: [
          {
            q: 'Do‘stlikni nima tirik saqlaydi?',
            options: ['Muntazam kichik e’tibor', 'Unutib yuborish', 'Faqat bayramda eslash', 'Kutish'],
            correct: 0,
            explain: 'Doimiy kichik aloqa katta muhabbatdan ko‘ra ishonchliroq.',
          },
        ],
        practice: { scenario: 'Ancha yozishmagan do‘stingizga xabar yozmoqchisiz.', goal: 'Iliq va tabiiy tarzda suhbatni qayta boshlang.', persona: 'Sardor' },
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
          {
            emoji: '🗣',
            heading: 'Jim o‘tirish ham xabar beradi',
            body:
              'Yig‘ilishda indamay o‘tirsangiz, g‘oyangiz ham ko‘rinmaydi. ' +
              'Mukammal nutq shart emas — qisqa, aniq bitta fikr bildirish yetarli: ' +
              '“Menimcha, avval mijozdan so‘rasak yaxshi bo‘ladi”. Aniqlik — ishonch belgisi.',
          },
        ],
        quiz: [
          {
            q: 'Yig‘ilishda qanday gapirish ta’sirli?',
            options: ['Uzoq va murakkab', 'Qisqa va aniq', 'Umuman gapirmaslik', 'Boshqalarni bo‘lish'],
            correct: 1,
            explain: 'Qisqa va aniq fikr eshitiladi va hurmat uyg‘otadi.',
          },
        ],
        practice: { scenario: 'Jamoaviy yig‘ilishda g‘oyangizni taqdim qilyapsiz.', goal: 'Fikringizni qisqa va aniq ayting.', persona: 'Rahbar' },
      },
      {
        title: 'Ish suhbati (intervyu)',
        reward: 25,
        concepts: [
          {
            emoji: '💼',
            heading: 'Hikoya raqamlardan yaxshi eslanadi',
            body:
              '“Mas’uliyatli va tirishqoqman” — buni hamma aytadi, hech kim eslamaydi. ' +
              'Buning o‘rniga kichik hikoya ayting: qanday vaziyat edi, siz nima qildingiz, natija qanday bo‘ldi. ' +
              'Aniq misol sizni yodda qoldiradi.',
          },
        ],
        quiz: [
          {
            q: 'Intervyuda tajribani qanday aytish kuchli?',
            options: ['Umumiy sifatlar sanab', 'Aniq misol/hikoya bilan', 'Kamtarlik uchun jim', 'Faqat “ha/yo‘q”'],
            correct: 1,
            explain: 'Vaziyat → harakat → natija ko‘rinishidagi hikoya ishonarli va esda qoladi.',
          },
        ],
        practice: { scenario: 'Ish suhbatidasiz. “O‘zingiz haqingizda gapiring” deyishdi.', goal: 'Qisqa, ishonchli va misolli tanishtiring.', persona: 'HR menejer' },
      },
      {
        title: 'Kelishmovchilikni hal qilish',
        reward: 20,
        concepts: [
          {
            emoji: '🕊',
            heading: 'Odamga emas, muammoga qarshi turing',
            body:
              'Nizoda “sen doim shunaqasan” desangiz, suhbat urushga aylanadi. ' +
              '“Men” tilida gapiring: “Men bu vaziyatda biroz noqulaylik sezdim”. ' +
              'Shunda suhbatdosh himoyaga o‘tmaydi va yechim topish osonlashadi.',
          },
        ],
        quiz: [
          {
            q: 'Kelishmovchilikda qanday gapirish keskinlikni kamaytiradi?',
            options: ['Ayblab', '“Men” tilida, muammoga qarab', 'Baqirib', 'Jim qolib'],
            correct: 1,
            explain: '“Men” tili suhbatdoshni himoyaga o‘tkazmaydi — bu tinch yechimga yo‘l ochadi.',
          },
        ],
        practice: { scenario: 'Hamkasbingiz bilan kelishmovchilik chiqdi. Uni xotirjam hal qilmoqchisiz.', goal: '“Men” tilida, hurmat bilan gaplashing.', persona: 'Hamkasb' },
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
  if (goals.some((g) => g.includes('Munosabat'))) return 'dating'
  if (goals.some((g) => g.includes('Karyera') || g.includes('Karyera'))) return 'work'
  if (goals.some((g) => g.includes('tanishish'))) return 'friends'
  if (goals.some((g) => g.includes('ishonch'))) return 'charisma'
  return 'convo'
}
