import { useState, useEffect, useRef } from 'react'
import { getCoachReply } from '../../lib/ai'
import { CloseIcon, SendIcon, SparkLogo } from '../icons'

const CHIPS = [
  'Suhbatni qanday boshlayman?',
  'Ishonchni qanday oshiraman?',
  'Ish suhbatiga tayyorlanamiz',
]

export default function AiChat({ telegram, onClose }) {
  const { haptic } = telegram
  const [chat, setChat] = useState([
    {
      role: 'ai',
      text: 'Salom! Men Sabo — muloqot murabbiying. 🌟 Nimada yordam beray? Suhbat boshlash, ishonch, tanishuv yoki ish muloqoti — istaganingni so‘ra.',
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [chat, typing])

  const sendText = async (text) => {
    if (!text.trim() || typing) return
    haptic('light')
    const next = [...chat, { role: 'user', text }]
    setChat(next)
    setInput('')
    setTyping(true)
    const reply = await getCoachReply(next)
    setTyping(false)
    setChat((c) => [...c, { role: 'ai', text: reply }])
  }

  const showChips = chat.length <= 1

  return (
    <main className="aichat">
      <header className="aichat__top">
        <div className="aichat__id">
          <span className="aichat__ava"><SparkLogo /></span>
          <div>
            <b>Sabo AI</b>
            <small>Muloqot murabbiying</small>
          </div>
        </div>
        <button className="aichat__close" onClick={onClose} aria-label="Yopish"><CloseIcon /></button>
      </header>

      <div className="chat" ref={scrollRef}>
        {chat.map((m, i) => (
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

        {showChips && (
          <div className="aichat__chips">
            {CHIPS.map((c) => (
              <button key={c} onClick={() => sendText(c)}>{c}</button>
            ))}
          </div>
        )}
      </div>

      <div className="chat__bar">
        <div className="chat__input-row">
          <input
            className="chat__input"
            value={input}
            placeholder="Savolingni yoz..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendText(input)}
          />
          <button className="chat__send" onClick={() => sendText(input)} disabled={!input.trim() || typing} aria-label="Yuborish">
            <SendIcon />
          </button>
        </div>
      </div>
    </main>
  )
}
