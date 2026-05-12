import { useState, useRef, useEffect } from 'react'
import { Phone, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react'
import BigButton from '../components/BigButton'

/* ── Login sub-states ── */
const VIEW = {
  PHONE:    'phone',
  LOADING:  'loading',
  OTP:      'otp',
}

export default function LoginScreen({ onAuthenticated }) {
  const [view, setView]       = useState(VIEW.PHONE)
  const [phone, setPhone]     = useState('')
  const [otp, setOtp]         = useState(['', '', '', ''])
  const [otpError, setOtpError] = useState(false)
  const inputRefs             = useRef([])

  const phoneValid = /^[6-9]\d{9}$/.test(phone)
  const otpFilled  = otp.every(d => d !== '')

  /* ── Submit phone → simulate API → show OTP screen ── */
  function handleSendOtp() {
    if (!phoneValid) return
    setView(VIEW.LOADING)
    setTimeout(() => setView(VIEW.OTP), 2000)
  }

  /* ── OTP digit input handler ── */
  function handleOtpChange(index, value) {
    // Accept only digits
    const digit = value.replace(/\D/g, '').slice(-1)
    const next  = [...otp]
    next[index] = digit
    setOtp(next)
    setOtpError(false)

    // Auto-advance focus
    if (digit && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleOtpKeyDown(index, e) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  /* ── Verify OTP – any 4-digit entry works ── */
  function handleVerifyOtp() {
    if (!otpFilled) return
    // Any 4-digit code is accepted (mock)
    onAuthenticated({ phone })
  }

  function handleResend() {
    setOtp(['', '', '', ''])
    setOtpError(false)
    setView(VIEW.LOADING)
    setTimeout(() => {
      setView(VIEW.OTP)
      inputRefs.current[0]?.focus()
    }, 1500)
  }

  /* Auto-focus first OTP box when OTP screen appears */
  useEffect(() => {
    if (view === VIEW.OTP) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    }
  }, [view])

  /* ════════════════════════════════════════
     LOADING VIEW
  ════════════════════════════════════════ */
  if (view === VIEW.LOADING) {
    return (
      <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center px-6 screen-enter">
        <div className="w-20 h-20 rounded-full border-4 border-sage-600 border-t-transparent animate-spin mb-8" />
        <p className="text-2xl font-semibold text-charcoal-700 text-center">
          Sending OTP to
        </p>
        <p className="text-2xl font-bold text-charcoal-800 mt-1">+91 {phone}</p>
        <p className="text-lg text-charcoal-500 mt-3 text-center">Please wait a moment…</p>
      </div>
    )
  }

  /* ════════════════════════════════════════
     OTP VIEW
  ════════════════════════════════════════ */
  if (view === VIEW.OTP) {
    return (
      <div className="min-h-screen bg-cream-100 flex flex-col px-5 py-10 screen-enter">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-10">
          <span className="text-3xl">🌿</span>
          <span className="text-2xl font-bold text-charcoal-800">Saathi</span>
        </div>

        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-sage-500/15 flex items-center justify-center mb-6">
          <ShieldCheck size={40} className="text-sage-600" strokeWidth={1.6} />
        </div>

        <h1 className="text-3xl font-bold text-charcoal-800 leading-tight mb-2">
          Enter the OTP
        </h1>
        <p className="text-lg text-charcoal-500 mb-2">
          We sent a 4-digit code to
        </p>
        <p className="text-xl font-bold text-charcoal-800 mb-8">
          +91 {phone}
        </p>

        {/* 4 large OTP boxes */}
        <div className="flex gap-4 justify-center mb-4">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => inputRefs.current[i] = el}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleOtpChange(i, e.target.value)}
              onKeyDown={e => handleOtpKeyDown(i, e)}
              className={`
                w-16 h-20 rounded-2xl border-2 text-center
                text-3xl font-bold text-charcoal-800
                bg-white shadow-card
                focus:outline-none transition-colors
                ${otpError
                  ? 'border-rose-600 bg-rose-50'
                  : digit
                  ? 'border-sage-600 bg-sage-500/5'
                  : 'border-charcoal-500/30 focus:border-sage-600'
                }
              `}
              aria-label={`OTP digit ${i + 1}`}
            />
          ))}
        </div>

        {otpError && (
          <p className="text-center text-rose-600 text-lg font-semibold mb-4">
            Incorrect OTP. Please try again.
          </p>
        )}

        <p className="text-base text-charcoal-500 text-center mb-8">
          Hint: any 4 digits will work in this demo
        </p>

        <BigButton onClick={handleVerifyOtp} disabled={!otpFilled} icon={ShieldCheck}>
          Verify & Continue
        </BigButton>

        {/* Resend */}
        <button
          onClick={handleResend}
          className="mt-5 w-full min-h-[56px] flex items-center justify-center gap-2 rounded-2xl
            bg-transparent text-sage-600 text-lg font-semibold
            border-2 border-sage-600/30 active:bg-sage-500/10 transition-colors"
        >
          <RefreshCw size={20} />
          Resend OTP
        </button>
      </div>
    )
  }

  /* ════════════════════════════════════════
     PHONE NUMBER VIEW (default)
  ════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col px-5 py-10 screen-enter">
      {/* Brand */}
      <div className="flex items-center gap-2 mb-10">
        <span className="text-3xl">🌿</span>
        <span className="text-2xl font-bold text-charcoal-800">Saathi</span>
      </div>

      {/* Hero text */}
      <h1 className="text-4xl font-bold text-charcoal-800 leading-tight mb-3">
        Aapka swagat hai 🙏
      </h1>
      <p className="text-xl text-charcoal-500 mb-10 leading-relaxed">
        Saathi mein aapka apna ghar hai — wisdom, companionship, aur care.
      </p>

      {/* Phone input */}
      <label htmlFor="phone-input" className="text-xl font-semibold text-charcoal-700 mb-3 block">
        Apna mobile number daalen
      </label>

      <div className="flex items-center gap-3 mb-3">
        {/* Country code badge */}
        <div className="flex-shrink-0 h-16 px-4 rounded-2xl bg-white border-2 border-charcoal-500/30
          flex items-center justify-center shadow-card">
          <span className="text-xl font-bold text-charcoal-800">🇮🇳 +91</span>
        </div>

        <input
          id="phone-input"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          value={phone}
          onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
          placeholder="98765 43210"
          autoComplete="tel"
          className="
            flex-1 h-16 px-5 rounded-2xl border-2 border-charcoal-500/30 bg-white
            text-2xl font-semibold text-charcoal-800 placeholder:text-charcoal-500/60
            focus:border-sage-600 focus:outline-none transition-colors shadow-card
          "
          aria-label="Mobile number"
        />
      </div>

      <p className="text-base text-charcoal-500 mb-10">
        Koi password yaad nahi karna — sirf ek OTP aayega.
      </p>

      <BigButton onClick={handleSendOtp} disabled={!phoneValid} icon={ArrowRight}>
        OTP Bhejo
      </BigButton>

      {/* Trust badge */}
      <div className="mt-8 flex items-center gap-3 px-4 py-4 rounded-2xl bg-white border border-cream-300 shadow-card">
        <ShieldCheck size={28} className="text-sage-600 flex-shrink-0" strokeWidth={1.6} />
        <p className="text-base text-charcoal-600 leading-snug">
          Aapka number sirf login ke liye use hoga. Kisi ke saath share nahi hoga.
        </p>
      </div>
    </div>
  )
}
