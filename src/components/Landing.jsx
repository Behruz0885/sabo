import { SparkLogo } from './icons'

export default function Landing({ telegram, onStart }) {
  const { user, haptic } = telegram

  const handleStart = () => {
    haptic('medium')
    onStart?.()
  }

  return (
    <main className="welcome">
      <div className="welcome__glow" />

      <header className="welcome__brand">
        <SparkLogo />
        <span>Sabo</span>
      </header>

      <section className="welcome__hero">
        <div className="welcome__badge">✨ AI muloqot murabbiyi</div>
        <h1 className="welcome__title">
          Har bir suhbatda
          <br />
          <span className="welcome__accent">o‘ziga ishonch</span>
        </h1>
        <p className="welcome__sub">
          Kuniga atigi 5 daqiqa mashq qil. Ijtimoiy ko‘nikmalaringni
          o‘yin tarzida rivojlantir.
        </p>

        <div className="welcome__cards">
          <div className="welcome__chat welcome__chat--in">Salom! Bugun nima mashq qilamiz?</div>
          <div className="welcome__chat welcome__chat--out">Ish suhbatini mashq qilmoqchiman 💼</div>
        </div>
      </section>

      <footer className="welcome__footer">
        <button className="btn-primary" onClick={handleStart}>
          Boshlash
        </button>
        <p className="welcome__note">
          {user ? `Salom, ${user.first_name}! ` : ''}Ro‘yxatdan o‘tish shart emas · Bepul
        </p>
      </footer>
    </main>
  )
}
