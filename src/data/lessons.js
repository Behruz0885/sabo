// Dars kontenti. Har bir dars: nazariya slaydlari, quiz, AI rol-o'yin mashqi.

const LESSONS = [
  {
    title: 'His qildir, ko‘rinma',
    module: 'Ichki o‘yin',
    reward: 20,
    concepts: [
      {
        emoji: '✨',
        heading: 'Karizma — o‘zingni ko‘rsatish emas',
        body: 'Odamlar seni tez unutadi, lekin sen ular bilan bo‘lganda o‘zlarini qanday his qilganini uzoq eslab qoladi. Karizma — aynan shu his.',
      },
      {
        emoji: '👂',
        heading: 'Diqqatni ularga qarat',
        body: 'Eng jozibali odamlar ko‘p gapirmaydi — ular yaxshi savol beradi va chin dildan tinglaydi. Suhbatni suhbatdoshing haqida qil.',
      },
      {
        emoji: '🎯',
        heading: 'Kichik amaliyot',
        body: 'Keyingi suhbatda bitta ochiq savol ber (“Qanday qilib...”, “Nega...”) va javobni bo‘lmasdan tingla. Shu bitta odat hammasini o‘zgartiradi.',
      },
    ],
    quiz: [
      {
        q: 'Karizma asosan nimaga bog‘liq?',
        options: [
          'Qimmat kiyim va tashqi ko‘rinish',
          'Odamlarni qanday his qildirishing',
          'Iloji boricha ko‘p gapirish',
          'Baland va dadil ovoz',
        ],
        correct: 1,
        explain: 'Karizma — odamlarda qoldirgan hissing. Tashqi ko‘rinish yoki ko‘p gapirish emas.',
      },
      {
        q: 'Suhbatda haqiqiy aloqani qanday yaratasan?',
        options: [
          'O‘zing haqingda ko‘proq gapirib',
          'Ochiq savollar berib va tinglab',
          'Telefoningga qarab turib',
          'Faqat jim tinglab',
        ],
        correct: 1,
        explain: 'Ochiq savol + samimiy tinglash suhbatdoshni qadrlanayotgandek his qildiradi.',
      },
    ],
    practice: {
      scenario: 'Tanishuv kechasidasan. Yoningda notanish odam turibdi. U bilan iliq suhbat boshla va uni o‘ziga qiziqayotganingni his qildir.',
      goal: 'Kamida bitta ochiq savol ber va suhbatni uning atrofida qur.',
      persona: 'Kamola',
    },
  },
]

const GENERIC = {
  module: 'Sabo',
  reward: 15,
  concepts: [
    {
      emoji: '💡',
      heading: 'Yangi ko‘nikma',
      body: 'Bu darsda kichik, amaliy bir naqshni o‘rganamiz. Uni bugunoq real suhbatda sinab ko‘r.',
    },
  ],
  quiz: [
    {
      q: 'Ko‘nikmani mustahkamlashning eng yaxshi yo‘li?',
      options: ['Faqat o‘qish', 'Muntazam mashq qilish', 'Kutish', 'E’tibor bermaslik'],
      correct: 1,
      explain: 'Har kuni ozgina mashq — o‘sishning eng ishonchli yo‘li.',
    },
  ],
  practice: {
    scenario: 'Kundalik suhbatni mashq qil. Tabiiy va samimiy bo‘l.',
    goal: 'Ochiq savol ber va suhbatdoshni tingla.',
    persona: 'Suhbatdosh',
  },
}

export function getLesson(index, title) {
  const base = LESSONS[index] || GENERIC
  return { ...base, title: title || base.title || 'Dars' }
}
