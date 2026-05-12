import { useState } from 'react'
import LoginScreen      from './screens/LoginScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import DashboardScreen  from './screens/DashboardScreen'
import WisdomScreen     from './screens/WisdomScreen'
import PeersScreen      from './screens/PeersScreen'

/*
 * App — top-level state machine.
 *
 * Auth flow:   login → onboarding → dashboard
 * Feature nav: dashboard → wisdom | peers | saathi
 *
 * Global state shape:
 *   isAuthenticated : boolean
 *   screen          : 'login' | 'onboarding' | 'dashboard' | 'wisdom' | 'peers' | 'saathi'
 *   user            : null | {
 *       name, phone, answers, isolationScore, profile,
 *       language, mobility_status, grief_status
 *   }
 */
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [screen, setScreen] = useState('login')
  const [user,   setUser]   = useState(null)

  /* ── Step 1: Login complete ── */
  function handleAuthenticated({ phone }) {
    setIsAuthenticated(true)
    // Carry phone into user object; rest filled after onboarding
    setUser(prev => ({ ...prev, phone }))
    setScreen('onboarding')
  }

  /* ── Step 2: Onboarding complete ── */
  function handleOnboardingComplete(userData) {
    setUser(prev => ({ ...prev, ...userData }))
    setScreen('dashboard')
  }

  /* ── Feature navigation from Dashboard ── */
  function handleNavigate(featureId) {
    setScreen(featureId)
  }

  /* ── Back to dashboard ── */
  function goHome() {
    setScreen('dashboard')
  }

  /* ════════════════════════════════════════
     SCREEN ROUTER
  ════════════════════════════════════════ */

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

  // Fallback — should never reach here
  return <LoginScreen onAuthenticated={handleAuthenticated} />
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
