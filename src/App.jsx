import { useState } from 'react'
import LoginScreen      from './screens/LoginScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import DashboardScreen  from './screens/DashboardScreen'
import WisdomScreen     from './screens/WisdomScreen'
import PeersScreen      from './screens/PeersScreen'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [screen, setScreen] = useState('login')
  const [user,   setUser]   = useState(null)

  function handleAuthenticated({ phone }) {
    setIsAuthenticated(true)
    setUser(prev => ({ ...prev, phone }))
    setScreen('onboarding')
  }

  function handleOnboardingComplete(userData) {
    setUser(prev => ({ ...prev, ...userData }))
    setScreen('dashboard')
  }

  function handleNavigate(featureId) {
    setScreen(featureId)
  }

  function goHome() {
    setScreen('dashboard')
  }

  /* ── Resolve which screen component to render ── */
  function renderScreen() {
    if (!isAuthenticated || screen === 'login') {
      return <LoginScreen onAuthenticated={handleAuthenticated} />
    }
    if (screen === 'onboarding') {
      return <OnboardingScreen onComplete={handleOnboardingComplete} />
    }
    if (screen === 'dashboard' && user) {
      return <DashboardScreen user={user} onNavigate={handleNavigate} />
    }
    if (screen === 'wisdom' && user) {
      return <WisdomScreen user={user} onBack={goHome} />
    }
    if (screen === 'peers' && user) {
      return <PeersScreen user={user} onBack={goHome} />
    }
    if (screen === 'saathi') {
      return (
        <PlaceholderScreen
          emoji="💬"
          title="Saathi – Aapka AI Dost"
          description="Aapka AI saathi sunne ke liye taiyaar hai — din ke kisi bhi waqt."
          note="Voice chat feature jald aa raha hai."
          onBack={goHome}
        />
      )
    }
    return <LoginScreen onAuthenticated={handleAuthenticated} />
  }

  return (
    <>
      {/* ── Mobile shell (the app itself) ── */}
      <div className="app-shell">
        {renderScreen()}
      </div>

      {/* ── Desktop sidebar — only visible ≥ 900px ── */}
      <aside className="desktop-sidebar" aria-hidden="true">
        <DesktopSidebar screen={screen} user={user} />
      </aside>
    </>
  )
}

/* ─────────────────────────────────────────
   DESKTOP SIDEBAR CONTENT
   Shows contextual info next to the phone
───────────────────────────────────────── */
function DesktopSidebar({ screen, user }) {
  const slides = {
    login: {
      emoji: '🌿',
      heading: 'Welcome to Saathi',
      body: 'A dignified space for India\'s elders — to share wisdom, find companionship, and never feel alone.',
      points: [
        '🔒 No password needed — just your phone number',
        '🗣️ Voice-first — no typing required',
        '🤝 Matched with people who truly understand you',
      ],
    },
    onboarding: {
      emoji: '🙏',
      heading: 'We\'re getting to know you',
      body: 'Your answers help us find the right companions and features for your unique life.',
      points: [
        '✅ Only 6 simple questions',
        '🔐 Your answers are private and secure',
        '🎯 Better answers = better matches',
      ],
    },
    dashboard: {
      emoji: '☀️',
      heading: `Namaste${user?.name ? ', ' + user.name : ''}`,
      body: 'Your personalised home. Everything you need is one tap away.',
      points: [
        '📖 Share your life wisdom with young India',
        '👥 Meet peers who share your journey',
        '💬 Talk to Saathi AI anytime',
      ],
    },
    wisdom: {
      emoji: '📖',
      heading: 'Your wisdom matters',
      body: 'Young people across India are waiting to hear from someone who has truly lived.',
      points: [
        '🎙️ Just tap and speak — no typing',
        '💡 Your advice can change a life',
        '🌟 You are the expert here',
      ],
    },
    peers: {
      emoji: '👥',
      heading: 'You are not alone',
      body: 'We find people who share your health journey, language, and life situation.',
      points: [
        '🤝 Matched by shared experiences',
        '🗣️ Connect with a voice note',
        '❤️ Shared pain creates the strongest bonds',
      ],
    },
    saathi: {
      emoji: '💬',
      heading: 'Saathi is always here',
      body: 'Your AI companion listens without judgment, any time of day or night.',
      points: [
        '🌙 Available 24 hours a day',
        '🗣️ Speak naturally in Hindi or English',
        '💚 No topic is too small to talk about',
      ],
    },
  }

  const slide = slides[screen] ?? slides.login

  return (
    <div>
      {/* Brand */}
      <div className="flex items-center gap-3 mb-10">
        <span className="text-4xl">🌿</span>
        <span className="text-3xl font-bold text-white">Saathi</span>
      </div>

      {/* Big emoji */}
      <div className="text-7xl mb-6">{slide.emoji}</div>

      {/* Heading */}
      <h2 className="text-4xl font-bold text-white leading-tight mb-4">
        {slide.heading}
      </h2>

      {/* Body */}
      <p className="text-xl text-white/70 leading-relaxed mb-8">
        {slide.body}
      </p>

      {/* Feature points */}
      <ul className="flex flex-col gap-4">
        {slide.points.map((pt, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="text-xl leading-snug">{pt}</span>
          </li>
        ))}
      </ul>

      {/* Bottom tagline */}
      <p className="mt-12 text-white/40 text-base">
        Saathi — Wisdom &amp; Companionship for India's Elders
      </p>
    </div>
  )
}

/* ── Generic placeholder for unbuilt screens ── */
function PlaceholderScreen({ emoji, title, description, note, onBack }) {
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center px-6 py-10 screen-enter">
      <span className="text-7xl mb-6">{emoji}</span>
      <h1 className="text-3xl font-bold text-charcoal-800 text-center mb-4">{title}</h1>
      <p className="text-xl text-charcoal-600 text-center mb-3 leading-relaxed">{description}</p>
      <p className="text-lg text-charcoal-500 text-center italic mb-10">{note}</p>
      <button
        onClick={onBack}
        className="w-full max-w-sm min-h-[64px] rounded-2xl bg-sage-600 text-white text-xl font-semibold
          flex items-center justify-center shadow-card active:scale-[0.97] transition-transform">
        ← Ghar Wapas
      </button>
    </div>
  )
}
