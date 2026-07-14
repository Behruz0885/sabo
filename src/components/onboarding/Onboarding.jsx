import { useState, useEffect, useRef } from 'react'
import { STEPS } from '../../data/onboarding'
import { BackIcon, CheckMark, SparkLogo, RunIcon, BookIcon } from '../icons'
import OptIcon from './OptIcon'

export default function Onboarding({ telegram, onFinish, onExit }) {
  const { haptic, user } = telegram
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({ name: user?.first_name || '' })

  const step = STEPS[index]
  const total = STEPS.length
  const progress = ((index + 1) / total) * 100

  const setAnswer = (key, value) => setAnswers((a) => ({ ...a, [key]: value }))

  const next = () => {
    haptic('light')
    if (index < total - 1) setIndex((i) => i + 1)
    else onFinish(answers)
  }
  const back = () => {
    haptic('light')
    if (index === 0) onExit()
    else setIndex((i) => i - 1)
  }

  // Transition ekranlari avtomatik o'tadi
  useEffect(() => {
    if (step.type === 'transition') {
      const t = setTimeout(next, step.loader ? 2400 : 1900)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  const val = step.key ? answers[step.key] : undefined
  const isAnswered = (() => {
    switch (step.type) {
      case 'text':
        return Boolean((val || '').trim())
      case 'single':
      case 'likert':
      case 'superpower':
        return val !== undefined
      case 'slider':
        return true
      case 'multi':
      case 'grid':
        return Array.isArray(val) && val.length > 0
      default:
        return true
    }
  })()

  const showContinue = !['transition', 'commit'].includes(step.type)

  return (
    <main className="onb">
      <header className="onb__top">
        <button className="onb__back" onClick={back} aria-label="Orqaga">
          <BackIcon />
        </button>
        <div className="onb__bar">
          <div className="onb__bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <div className="onb__body">
        <StepView step={step} value={val} answers={answers} setAnswer={setAnswer} next={next} />
      </div>

      {showContinue && (
        <footer className="onb__foot">
          <button className="btn-primary" disabled={!isAnswered} onClick={next}>
            Davom etish
          </button>
        </footer>
      )}
    </main>
  )
}

/* ============ Qadam turlari ============ */
function StepView({ step, value, answers, setAnswer, next }) {
  switch (step.type) {
    case 'text':
      return <TextStep step={step} value={value} setAnswer={setAnswer} />
    case 'single':
      return <SingleStep step={step} value={value} setAnswer={setAnswer} />
    case 'multi':
      return <MultiStep step={step} value={value} setAnswer={setAnswer} />
    case 'grid':
      return <GridStep step={step} value={value} setAnswer={setAnswer} />
    case 'slider':
      return <SliderStep step={step} value={value} setAnswer={setAnswer} />
    case 'info':
      return <InfoStep step={step} />
    case 'superpower':
      return <SuperStep step={step} value={value} setAnswer={setAnswer} />
    case 'transition':
      return <TransitionStep step={step} />
    case 'graph':
      return <GraphStep />
    case 'score':
      return <ScoreStep answers={answers} />
    case 'commit':
      return <CommitStep answers={answers} next={next} />
    default:
      return null
  }
}

function Heading({ step }) {
  return (
    <div className="onb__head">
      <h1 className="onb__title">{step.title}</h1>
      {step.subtitle && <p className="onb__subtitle">{step.subtitle}</p>}
    </div>
  )
}

function TextStep({ step, value, setAnswer }) {
  return (
    <>
      <Heading step={step} />
      <div className="text-step">
        <input
          className="text-step__input"
          value={value || ''}
          placeholder={step.placeholder}
          onChange={(e) => setAnswer(step.key, e.target.value)}
          autoFocus
        />
      </div>
    </>
  )
}

function SingleStep({ step, value, setAnswer }) {
  return (
    <>
      <Heading step={step} />
      <div className="opts">
        {step.options.map((o) => (
          <button
            key={o.label}
            className={`opt ${value === o.label ? 'opt--on' : ''}`}
            onClick={() => setAnswer(step.key, o.label)}
          >
            <span className="opt__icon" style={{ color: o.color }}><OptIcon name={o.icon} /></span>
            <span className="opt__label">{o.label}</span>
          </button>
        ))}
        {step.extra && (
          <button
            className={`opt-extra ${value === step.extra ? 'opt-extra--on' : ''}`}
            onClick={() => setAnswer(step.key, step.extra)}
          >
            {step.extra}
          </button>
        )}
      </div>
    </>
  )
}

function MultiStep({ step, value = [], setAnswer }) {
  const toggle = (label) => {
    const set = new Set(value)
    set.has(label) ? set.delete(label) : set.add(label)
    setAnswer(step.key, [...set])
  }
  return (
    <>
      <Heading step={step} />
      <div className="opts">
        {step.options.map((o) => {
          const on = value.includes(o.label)
          return (
            <button key={o.label} className={`opt ${on ? 'opt--on' : ''}`} onClick={() => toggle(o.label)}>
              <span className="opt__icon" style={{ color: o.color }}><OptIcon name={o.icon} /></span>
              <span className="opt__label">{o.label}</span>
              <span className={`radio ${on ? 'radio--on' : ''}`}>{on && <CheckMark />}</span>
            </button>
          )
        })}
      </div>
    </>
  )
}

function GridStep({ step, value = [], setAnswer }) {
  const toggle = (label) => {
    const set = new Set(value)
    set.has(label) ? set.delete(label) : set.add(label)
    setAnswer(step.key, [...set])
  }
  return (
    <>
      <Heading step={step} />
      <div className="grid2">
        {step.options.map((o) => {
          const on = value.includes(o.label)
          return (
            <button key={o.label} className={`gcard ${on ? 'gcard--on' : ''}`} onClick={() => toggle(o.label)}>
              <span className="gcard__icon" style={{ color: o.color }}><OptIcon name={o.icon} /></span>
              <span className={`radio radio--tr ${on ? 'radio--on' : ''}`}>{on && <CheckMark />}</span>
              <span className="gcard__label">{o.label}</span>
            </button>
          )
        })}
      </div>
    </>
  )
}

function SliderStep({ step, value, setAnswer }) {
  const v = value ?? 5
  const words = ['Umuman', 'Juda kam', 'Kam', 'Pastroq', 'Bir oz', 'Muvozanatli', 'Bir oz', 'Ancha', 'Ko‘proq', 'Deyarli', 'To‘liq']
  const pct = (v / 10) * 100
  return (
    <>
      <Heading step={step} />
      <div className="slider">
        <div className="slider__bubble" style={{ left: `${pct}%` }}>
          {words[v]}
          <i />
        </div>
        <input
          type="range"
          min="0"
          max="10"
          value={v}
          onChange={(e) => setAnswer(step.key, Number(e.target.value))}
          style={{ '--pct': `${pct}%` }}
        />
        <div className="slider__ticks">
          {Array.from({ length: 11 }, (_, i) => (
            <span key={i} className={i === v ? 'on' : ''}>{i}</span>
          ))}
        </div>
        <div className="slider__labels">
          <span>{step.leftLabel}</span>
          <span>{step.rightLabel}</span>
        </div>
      </div>
    </>
  )
}

function InfoStep({ step }) {
  return (
    <div className="info">
      <div className="info__image" />
      <h2 className="info__kicker">{step.title}</h2>
      <h1 className="info__heading">{step.heading}</h1>
      <ul className="info__list">
        {step.bullets.map((b, i) => (
          <li key={i} style={{ animationDelay: `${i * 0.15}s` }}>
            <span className="info__bicon" style={{ color: b.color }}><OptIcon name={b.icon} /></span>
            <span>{b.text}</span>
          </li>
        ))}
      </ul>
      {step.note && <p className="info__note">{step.note}</p>}
    </div>
  )
}

function SuperStep({ step, value, setAnswer }) {
  return (
    <>
      <Heading step={step} />
      <div className="opts">
        {step.options.map((o) => (
          <button
            key={o.title}
            className={`super ${value === o.title ? 'super--on' : ''}`}
            onClick={() => setAnswer(step.key, o.title)}
          >
            <span className="super__icon" style={{ color: o.color }}><OptIcon name={o.icon} /></span>
            <span className="super__text">
              <b>{o.title}</b>
              <small>{o.desc}</small>
            </span>
          </button>
        ))}
      </div>
    </>
  )
}

function TransitionStep({ step }) {
  return (
    <div className="transition">
      {step.loader && <div className="transition__loader" />}
      <h1 className="transition__text">{step.title}</h1>
    </div>
  )
}

function GraphStep() {
  return (
    <div className="graph">
      <svg viewBox="0 0 340 200" className="graph__svg">
        {[40, 80, 120, 160].map((y) => (
          <line key={y} x1="10" y1={y} x2="330" y2={y} stroke="#3a2e27" strokeWidth="1" />
        ))}
        {/* mindless scrolling (past) */}
        <path d="M30 120 C120 130, 200 170, 300 175" fill="none" stroke="#ff7a45" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        {/* using Sabo (up) */}
        <path d="M30 120 C110 100, 180 70, 300 30" fill="none" stroke="url(#g)" strokeWidth="4" strokeLinecap="round" />
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="340" y2="0">
            <stop stopColor="#7a72e8" />
            <stop offset="1" stopColor="#37d67a" />
          </linearGradient>
        </defs>
        <circle cx="30" cy="120" r="6" fill="#7a72e8" />
        <circle cx="300" cy="30" r="6" fill="#37d67a" />
      </svg>
      <div className="graph__legend">
        <span>Bugun</span>
        <span>1 oydan keyin</span>
      </div>
      <h1 className="graph__title">Kuniga 5 daqiqada ko‘proq ishonchli bo‘lasan</h1>
      <ul className="info__list">
        <li><span className="info__bicon"><RunIcon /></span><span><b style={{ color: '#f5842a' }}>3x</b> an’anaviy kurslardan tezroq</span></li>
        <li><span className="info__bicon"><BookIcon /></span><span>Yo‘lda, tushlik vaqtida bajarsa bo‘ladigan qisqa darslar</span></li>
      </ul>
    </div>
  )
}

function computeScore(answers) {
  const sliders = ['recharge', 'strangers', 'attractive'].map((k) => answers[k] ?? 5)
  const avg = sliders.reduce((a, b) => a + b, 0) / sliders.length
  const base = Math.round(35 + avg * 3) // ~ 40-65
  return {
    overall: Math.min(72, Math.max(42, base)),
    confidence: Math.min(70, base),
    sociability: Math.min(70, base + 1),
    flirting: Math.min(70, base + 1),
    charisma: Math.min(70, base),
  }
}

function ScoreStep({ answers }) {
  const s = computeScore(answers)
  const bars = [
    { label: 'Ishonch', v: s.confidence, color: '#4a90e2' },
    { label: 'Ijtimoiylik', v: s.sociability, color: '#a06bff' },
    { label: 'Flört', v: s.flirting, color: '#ff5c8a' },
    { label: 'Karizma', v: s.charisma, color: '#f0b400' },
  ]
  return (
    <div className="score">
      <div className="score__card">
        <div className="score__ring" style={{ '--p': `${s.overall}%` }}>
          <div className="score__num">
            <b>{s.overall}</b>
            <small>/100</small>
          </div>
        </div>
        <div className="score__bars">
          {bars.map((b) => (
            <div className="score__bar" key={b.label}>
              <div className="score__bar-top">
                <span>{b.label}</span>
                <span style={{ color: b.color }}>{b.v}%</span>
              </div>
              <div className="score__track">
                <div style={{ width: `${b.v}%`, background: b.color }} />
              </div>
            </div>
          ))}
        </div>
        <h2 className="score__title">Sen — Yangi Ovozsan</h2>
        <p className="score__desc">
          Ijtimoiy ishonching hali shakllanmoqda. To‘g‘ri mashq seni xotirjamroq,
          aniqroq va o‘z o‘rningni egallashda qulayroq his qildiradi.
        </p>
      </div>
    </div>
  )
}

function CommitStep({ answers, next }) {
  const name = answers.name || 'do‘stim'
  const holdRef = useRef(null)
  const [holding, setHolding] = useState(false)

  const start = () => {
    setHolding(true)
    holdRef.current = setTimeout(() => next(), 1300)
  }
  const cancel = () => {
    setHolding(false)
    clearTimeout(holdRef.current)
  }

  return (
    <div className="commit">
      <div className="commit__letter">
        <h1>Salom! Bu men</h1>
        <div className="commit__from">
          <span className="commit__avatar"><SparkLogo /></span>
          <b>Kelajakdagi {name}</b>
        </div>
        <p>Bu — bir yildan kelayotgan sen. Bugun o‘zingni tortmaslikka qaror qilding va bu hammasini o‘zgartirdi!</p>
        <p>Endi xonalarga xotirjamroq kirasan, fikrlaringga ishonasan va to‘g‘ri so‘zlarni topasan — chunki Saboga sodiq qolding.</p>
        <p>Kuniga 5 daqiqa ber. Ishonaman, arziydi.</p>
        <div className="commit__sign">Ko‘rishguncha,<br /><b>Kelajakdagi {name}</b></div>
      </div>
      <button
        className={`commit__hold ${holding ? 'commit__hold--on' : ''}`}
        onPointerDown={start}
        onPointerUp={cancel}
        onPointerLeave={cancel}
      >
        <span className="commit__ring" />
        <span className="commit__fp"><OptIcon name="fingerprint" /></span>
        <em>Sodiqlikni tasdiqlash uchun bosib turing</em>
      </button>
    </div>
  )
}
