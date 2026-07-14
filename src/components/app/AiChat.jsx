import { useState, useEffect, useRef } from 'react'
import { getCoachReply } from '../../lib/ai'
import { CloseIcon, SendIcon, SparkLogo } from '../icons'
import OptIcon from '../onboarding/OptIcon'

const ACTIONS = [
  { id: 'reply', icon: 'chatPlus', color: '#f5842a', title: 'Javob yozib ber', prompt: 'Menga suhbatga chiroyli javob yozishda yordam ber. Vaziyat: ' },
  { id: 'ice', icon: 'bulb', color: '#f0b400', title: 'Icebreaker ber', prompt: 'Menga suhbat boshlash uchun 3 ta qiziqarli icebreaker savol ber.' },
  { id: 'confident', icon: 'people', color: '#a06bff', title: 'Ishonchli gapirish', prompt: 'Qanday qilib ishonchliroq va dadilroq gapirsam bo‘ladi? Amaliy maslahat ber.' },
  { id: 'lesson', icon: 'cap', color: '#4a90e2', title: 'Dars tavsiya qil', prompt: 'Menga ijtimoiy ko‘nikmalarim uchun mos dars tavsiya qil.' },
]

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Xayrli tong'
  if (h < 18) return 'Xayrli kun'
  return 'Xayrli kech'
}

export default function AiChat({ telegram, onClose }) {
  const { haptic, user } = telegram
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef(null)
  const started = messages.length > 0

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  const sendText = async (text) => {
    if (!text.trim() || typing) return
    haptic('light')
    const next = [...messages, { role: 'user', text }]
    setMessages(next)
    setInput('')
    setTyping(true)
    try {
      const reply = await getCoachReply(next)
      setMessages((c) => [...c, { role: 'ai', text: reply }])
    } catch {
      setMessages((c) => [...c, { role: 'ai', text: 'Kechirasiz, javob bera olmadim. Qayta urinib ko‘ring.' }])
    } finally {
      setTyping(false)
    }
  }

  return (
    <main className="aichat">
      <header className="aichat__top">
        <button className="aichat__close" onClick={onClose} aria-label="Yopish"><CloseIcon /></button>
        <div className="aichat__id">
          <span className="aichat__ava"><SparkLogo /></span>
          <b>Sabo AI</b>
        </div>
        <span style={{ width: 36 }} />
      </header>

      {!started ? (
        <div className="assist">
          <div className="assist__hello">
            <p>{greeting()}, {user?.first_name || 'do‘stim'}</p>
            <h1>Qanday yordam beray?</h1>
          </div>
          <div className="assist__grid">
            {ACTIONS.map((a) => (
              <button key={a.id} className="acard" style={{ borderColor: `${a.color}55` }} onClick={() => sendText(a.prompt)}>
                <span className="acard__icon" style={{ color: a.color }}><OptIcon name={a.icon} /></span>
                <b>{a.title}</b>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="chat" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`bubble bubble--${m.role}`}>
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
      )}

      <div className="chat__bar">
        <div className="chat__input-row">
          <input className="chat__input" value={input} placeholder="Sabodan so‘ra..."
            onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendText(input)} />
          <button className="chat__send" onClick={() => sendText(input)} disabled={!input.trim() || typing} aria-label="Yuborish"><SendIcon /></button>
        </div>
      </div>
    </main>
  )
}
