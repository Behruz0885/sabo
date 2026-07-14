import { useState, useEffect, useRef } from 'react'
import { getReply, getFeedback } from '../../lib/ai'
import { CloseIcon, SendIcon, CheckMark, SparkLogo } from '../icons'

export default function Lesson({ lesson, telegram, onComplete, onClose }) {
  const { haptic } = telegram
  const [phase, setPhase] = useState('concept')
  const [feedback, setFeedback] = useState(null)

  const phases = ['concept', 'quiz', 'practice', 'feedback', 'complete']
  const progress = ((phases.indexOf(phase) + 1) / phases.length) * 100

  return (
    <main className="lesson">
      <header className="lesson__top">
        <button className="lesson__close" onClick={onClose} aria-label="Yopish"><CloseIcon /></button>
        <div className="onb__bar"><div className="onb__bar-fill" style={{ width: `${progress}%` }} /></div>
      </header>

      {phase === 'concept' && (
        <ConceptPhase lesson={lesson} haptic={haptic} onDone={() => setPhase('quiz')} />
      )}
      {phase === 'quiz' && (
        <QuizPhase lesson={lesson} haptic={haptic} onDone={() => setPhase('practice')} />
      )}
      {phase === 'practice' && (
        <PracticePhase lesson={lesson} haptic={haptic} onDone={(fb) => { setFeedback(fb); setPhase('feedback') }} />
      )}
      {phase === 'feedback' && (
        <FeedbackPhase result={feedback} onDone={() => setPhase('complete')} />
      )}
      {phase === 'complete' && (
        <CompletePhase lesson={lesson} onDone={() => onComplete(lesson.reward)} />
      )}
    </main>
  )
}

/* ---------- 1. Nazariya ---------- */
function ConceptPhase({ lesson, haptic, onDone }) {
  const [i, setI] = useState(0)
  const c = lesson.concepts[i]
  const last = i === lesson.concepts.length - 1
  const next = () => {
    haptic('light')
    if (last) onDone()
    else setI((n) => n + 1)
  }
  return (
    <div className="lphase">
      <div className="concept">
        <div className="concept__emoji">{c.emoji}</div>
        <h1 className="concept__heading">{c.heading}</h1>
        <p className="concept__body">{c.body}</p>
      </div>
      <div className="lesson__foot">
        <button className="btn-primary" onClick={next}>{last ? 'Testga o‘tish' : 'Davom etish'}</button>
      </div>
    </div>
  )
}

/* ---------- 2. Quiz ---------- */
function QuizPhase({ lesson, haptic, onDone }) {
  const [i, setI] = useState(0)
  const [sel, setSel] = useState(null)
  const q = lesson.quiz[i]
  const last = i === lesson.quiz.length - 1
  const answered = sel !== null

  const pick = (idx) => {
    if (answered) return
    setSel(idx)
    haptic(idx === q.correct ? 'medium' : 'light')
  }
  const next = () => {
    if (last) onDone()
    else { setI((n) => n + 1); setSel(null) }
  }

  return (
    <div className="lphase">
      <div className="quiz">
        <span className="quiz__count">{i + 1} / {lesson.quiz.length}</span>
        <h1 className="quiz__q">{q.q}</h1>
        <div className="opts">
          {q.options.map((o, idx) => {
            let cls = ''
            if (answered) {
              if (idx === q.correct) cls = 'opt--correct'
              else if (idx === sel) cls = 'opt--wrong'
            }
            return (
              <button key={idx} className={`opt ${cls}`} onClick={() => pick(idx)}>
                <span className="opt__label">{o}</span>
                {answered && idx === q.correct && <span className="opt__mark ok"><CheckMark /></span>}
                {answered && idx === sel && idx !== q.correct && <span className="opt__mark no">✕</span>}
              </button>
            )
          })}
        </div>
        {answered && (
          <div className={`quiz__explain ${sel === q.correct ? 'ok' : 'no'}`}>
            <b>{sel === q.correct ? 'To‘g‘ri! ' : 'Yaqin edi. '}</b>{q.explain}
          </div>
        )}
      </div>
      <div className="lesson__foot">
        <button className="btn-primary" disabled={!answered} onClick={next}>
          {last ? 'Mashqqa o‘tish' : 'Keyingi savol'}
        </button>
      </div>
    </div>
  )
}

/* ---------- 3. AI rol-o'yin ---------- */
function PracticePhase({ lesson, haptic, onDone }) {
  const p = lesson.practice
  const [chat, setChat] = useState([
    { role: 'ai', text: `Salom! Menimcha oldin uchrashmaganmiz. Men ${p.persona}. 🙂` },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [loadingFb, setLoadingFb] = useState(false)
  const scrollRef = useRef(null)

  const userTurns = chat.filter((m) => m.role === 'user').length
  const canFinish = userTurns >= 3

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [chat, typing])

  const send = async () => {
    const text = input.trim()
    if (!text || typing) return
    haptic('light')
    const nextChat = [...chat, { role: 'user', text }]
    setChat(nextChat)
    setInput('')
    setTyping(true)
    const reply = await getReply(nextChat, p)
    setTyping(false)
    setChat((c) => [...c, { role: 'ai', text: reply }])
  }

  const finish = async () => {
    haptic('medium')
    setLoadingFb(true)
    const fb = await getFeedback(chat, p)
    onDone(fb)
  }

  return (
    <div className="lphase lphase--chat">
      <div className="practice__brief">
        <b>🎭 Vaziyat</b>
        <p>{p.scenario}</p>
        <span className="practice__goal">🎯 Maqsad: {p.goal}</span>
      </div>

      <div className="chat" ref={scrollRef}>
        {chat.map((m, idx) => (
          <div key={idx} className={`bubble bubble--${m.role}`}>
            {m.role === 'ai' && <span className="bubble__ava"><SparkLogo /></span>}
            <span className="bubble__text">{m.text}</span>
          </div>
        ))}
        {typing && (
          <div className="bubble bubble--ai">
            <span className="bubble__ava"><SparkLogo /></span>
            <span className="bubble__text typing"><i></i><i></i><i></i></span>
          </div>
        )}
      </div>

      {loadingFb ? (
        <div className="practice__loading"><div className="transition__loader" /><span>Suhbating tahlil qilinmoqda...</span></div>
      ) : (
        <div className="chat__bar">
          {canFinish && (
            <button className="chat__finish" onClick={finish}>Suhbatni yakunlash va feedback olish</button>
          )}
          <div className="chat__input-row">
            <input
              className="chat__input"
              value={input}
              placeholder="Javobingni yoz..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
            />
            <button className="chat__send" onClick={send} disabled={!input.trim() || typing} aria-label="Yuborish">
              <SendIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- 4. Feedback ---------- */
function FeedbackPhase({ result, onDone }) {
  const r = result || { overall: 60, metrics: [], summary: '', tips: [] }
  return (
    <div className="lphase">
      <div className="fb">
        <div className="fb__ring" style={{ '--p': `${r.overall}%` }}>
          <div className="fb__num"><b>{r.overall}</b><small>/100</small></div>
        </div>
        <h1 className="fb__title">AI feedback</h1>
        <p className="fb__summary">{r.summary}</p>

        <div className="fb__metrics">
          {r.metrics.map((m) => (
            <div key={m.label} className="fb__metric">
              <div className="fb__metric-top"><span>{m.label}</span><span style={{ color: m.color }}>{m.value}%</span></div>
              <div className="score__track"><div style={{ width: `${m.value}%`, background: m.color }} /></div>
            </div>
          ))}
        </div>

        <div className="fb__tips">
          <b>💡 Maslahatlar</b>
          {r.tips.map((t, i) => <p key={i}>• {t}</p>)}
        </div>
      </div>
      <div className="lesson__foot">
        <button className="btn-primary" onClick={onDone}>Davom etish</button>
      </div>
    </div>
  )
}

/* ---------- 5. Yakun ---------- */
function CompletePhase({ lesson, onDone }) {
  return (
    <div className="lphase">
      <div className="done">
        <div className="done__burst">🎉</div>
        <h1 className="done__title">Dars tugadi!</h1>
        <p className="done__sub">“{lesson.title}” ni muvaffaqiyatli yakunlading.</p>
        <div className="done__reward">
          <span className="done__xp">+{lesson.reward} XP</span>
          <span className="done__streak">🔥 Streak +1</span>
        </div>
      </div>
      <div className="lesson__foot">
        <button className="btn-primary" onClick={onDone}>Yo‘lga qaytish</button>
      </div>
    </div>
  )
}
