import { useState, useEffect, useRef } from 'react'
import { getReply, getFeedback } from '../../lib/ai'
import { CloseIcon, SendIcon, CheckMark, SparkLogo, BookmarkIcon } from '../icons'

export default function Lesson({ lesson, course, lessonIndex, saved = [], onToggleSave, telegram, onComplete, onClose }) {
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
        <ConceptPhase lesson={lesson} course={course} lessonIndex={lessonIndex}
          saved={saved} onToggleSave={onToggleSave} haptic={haptic} onDone={() => setPhase('quiz')} />
      )}
      {phase === 'quiz' && <QuizPhase lesson={lesson} haptic={haptic} onDone={() => setPhase('practice')} />}
      {phase === 'practice' && (
        <PracticePhase lesson={lesson} haptic={haptic} onDone={(fb) => { setFeedback(fb); setPhase('feedback') }} />
      )}
      {phase === 'feedback' && <FeedbackPhase result={feedback} onDone={() => setPhase('complete')} />}
      {phase === 'complete' && <CompletePhase lesson={lesson} haptic={haptic} onDone={() => onComplete(lesson.reward)} />}
    </main>
  )
}

/* ---------- 1. Nazariya + bookmark ---------- */
function ConceptPhase({ lesson, course, lessonIndex, saved, onToggleSave, haptic, onDone }) {
  const [i, setI] = useState(0)
  const c = lesson.concepts[i]
  const last = i === lesson.concepts.length - 1
  const itemId = `${course.id}-${lessonIndex}-${i}`
  const isSaved = saved.some((s) => s.id === itemId)

  const save = () => {
    haptic('light')
    onToggleSave?.({ id: itemId, text: c.body, course: course.title, lesson: lesson.title })
  }
  const next = () => { haptic('light'); last ? onDone() : setI((n) => n + 1) }

  return (
    <div className="lphase">
      <div className="concept">
        <button className={`concept__save ${isSaved ? 'is-on' : ''}`} onClick={save} aria-label="Saqlash">
          <BookmarkIcon />
        </button>
        <span className="lkicker">📘 O‘RGANISH</span>
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

  const correct = sel === q.correct
  const pick = (idx) => { if (answered) return; setSel(idx); haptic(idx === q.correct ? 'medium' : 'light') }
  const retry = () => setSel(null)
  const next = () => { if (last) onDone(); else { setI((n) => n + 1); setSel(null) } }

  return (
    <div className="lphase">
      <div className="quiz">
        <span className="lkicker lkicker--blue">☑ TEST · {i + 1}/{lesson.quiz.length}</span>
        <h1 className="quiz__q">{q.q}</h1>
        <div className="opts">
          {q.options.map((o, idx) => {
            let cls = ''
            if (answered) { if (idx === q.correct) cls = 'opt--correct'; else if (idx === sel) cls = 'opt--wrong' }
            return (
              <button key={idx} className={`opt ${cls}`} onClick={() => pick(idx)}>
                {answered && idx === q.correct && <span className="opt__mark ok"><CheckMark /></span>}
                {answered && idx === sel && idx !== q.correct && <span className="opt__mark no">✕</span>}
                <span className="opt__label">{o}</span>
              </button>
            )
          })}
        </div>
        {answered && (
          <div className={`quiz__explain ${correct ? 'ok' : 'no'}`}>
            <div className="quiz__explain-top">
              <b>{correct ? '✓ To‘g‘ri!' : '✕ Noto‘g‘ri'}</b>
              <span className="quiz__report">⚑ Xabar berish</span>
            </div>
            {!correct && <div className="quiz__best">To‘g‘ri javob: <b>{q.options[q.correct]}</b></div>}
            <div className="quiz__why">
              <span className="quiz__why-label">NEGA SHUNDAY</span>
              <p>{q.explain}</p>
            </div>
          </div>
        )}
      </div>
      <div className="lesson__foot">
        {answered && !correct && <button className="btn-ghost" onClick={retry}>Qayta urinish</button>}
        <button className="btn-primary" disabled={!answered} onClick={next}>{last ? 'Mashqqa o‘tish' : 'Davom etish'}</button>
      </div>
    </div>
  )
}

/* ---------- 3. AI rol-o'yin ---------- */
function PracticePhase({ lesson, haptic, onDone }) {
  const p = lesson.practice
  const [chat, setChat] = useState([{ role: 'ai', text: `Salom! Menimcha oldin uchrashmaganmiz. Men ${p.persona}. 🙂` }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [loadingFb, setLoadingFb] = useState(false)
  const [error, setError] = useState('')
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
    setError('')
    const nextChat = [...chat, { role: 'user', text }]
    setChat(nextChat)
    setInput('')
    setTyping(true)
    try {
      const reply = await getReply(nextChat, p)
      setChat((c) => [...c, { role: 'ai', text: reply }])
    } catch {
      setError('AI javob bera olmadi. Qayta urinib ko‘ring.')
    } finally {
      setTyping(false)
    }
  }

  const finish = async () => {
    haptic('medium')
    setLoadingFb(true)
    try {
      const fb = await getFeedback(chat, p)
      onDone(fb)
    } catch {
      setLoadingFb(false)
      setError('Tahlil olinmadi. Qayta urinib ko‘ring.')
    }
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
        {error && <div className="chat__error">{error}</div>}
      </div>

      {loadingFb ? (
        <div className="practice__loading"><div className="transition__loader" /><span>Suhbating tahlil qilinmoqda...</span></div>
      ) : (
        <div className="chat__bar">
          {canFinish && <button className="chat__finish" onClick={finish}>Suhbatni yakunlash va feedback olish</button>}
          <div className="chat__input-row">
            <input className="chat__input" value={input} placeholder="Javobingni yoz..."
              onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} />
            <button className="chat__send" onClick={send} disabled={!input.trim() || typing} aria-label="Yuborish"><SendIcon /></button>
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
      <div className="lesson__foot"><button className="btn-primary" onClick={onDone}>Davom etish</button></div>
    </div>
  )
}

/* ---------- 5. Yakun + confetti + ovoz ---------- */
function playChime() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    const ac = new Ctx()
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((f, i) => {
      const o = ac.createOscillator()
      const g = ac.createGain()
      o.type = 'sine'
      o.frequency.value = f
      o.connect(g)
      g.connect(ac.destination)
      const t = ac.currentTime + i * 0.12
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.25, t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3)
      o.start(t)
      o.stop(t + 0.32)
    })
  } catch {
    /* audio bloklangan bo'lishi mumkin */
  }
}

const CONFETTI_COLORS = ['#f5842a', '#4a90e2', '#a06bff', '#37d67a', '#ff5c8a', '#f0b400']

function CompletePhase({ lesson, haptic, onDone }) {
  useEffect(() => {
    haptic?.('medium')
    playChime()
  }, [])
  const pieces = Array.from({ length: 40 })
  return (
    <div className="lphase">
      <div className="confetti">
        {pieces.map((_, i) => (
          <span key={i} style={{
            left: `${Math.random() * 100}%`,
            background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${2 + Math.random() * 1.5}s`,
          }} />
        ))}
      </div>
      <div className="done">
        <div className="done__burst">🎉</div>
        <h1 className="done__title">Dars tugadi!</h1>
        <p className="done__sub">“{lesson.title}” ni muvaffaqiyatli yakunlading.</p>
        <div className="done__reward">
          <span className="done__xp">+{lesson.reward} XP</span>
          <span className="done__streak">🔥 Streak +1</span>
        </div>
      </div>
      <div className="lesson__foot"><button className="btn-primary" onClick={onDone}>Yo‘lga qaytish</button></div>
    </div>
  )
}
