import { useState } from 'react'
import {
  Sun, Users, Smartphone,
  Footprints, Coffee,
  Home, Languages,
  CheckCircle2, HelpCircle, MessageCircle,
  ChevronRight, ChevronLeft,
  HeartHandshake, PersonStanding, Accessibility,
  Heart, UserX,
} from 'lucide-react'
import ProgressDots from '../components/ProgressDots'
import OptionCard from '../components/OptionCard'
import BigButton from '../components/BigButton'

/* ─────────────────────────────────────────────
   QUESTION DEFINITIONS
   Original 3 + 3 new deepened questions = 6 total
───────────────────────────────────────────── */
const QUESTIONS = [
  /* ── Original Q1 ── */
  {
    id: 'outings',
    question: 'How often do you go out?',
    hint: 'There are no right or wrong answers.',
    options: [
      { value: 'daily',    label: 'Daily',                       sublabel: 'I step out most days',           icon: Sun,           score: 0 },
      { value: 'weekly',   label: 'Once a week',                 sublabel: 'I go out occasionally',          icon: Footprints,    score: 1 },
      { value: 'mobility', label: 'Mobility issues restrict me', sublabel: 'Getting around is difficult',    icon: Accessibility, score: 2 },
    ],
  },
  /* ── Original Q2 ── */
  {
    id: 'tea',
    question: 'Who do you share your evening tea with?',
    hint: 'Tell us about your daily moments.',
    options: [
      { value: 'family',  label: 'Family',       sublabel: 'With my children or spouse',   icon: Home,           score: 0 },
      { value: 'friends', label: 'Friends',       sublabel: 'With neighbours or friends',   icon: Users,          score: 1 },
      { value: 'alone',   label: 'Mostly alone',  sublabel: 'I usually have tea by myself', icon: Coffee,         score: 2 },
    ],
  },
  /* ── Original Q3 ── */
  {
    id: 'phone',
    question: 'How comfortable are you with phones?',
    hint: 'We will make Saathi easy for you.',
    options: [
      { value: 'very',     label: 'Very comfortable', sublabel: 'I use many apps',             icon: Smartphone,    score: 0 },
      { value: 'whatsapp', label: 'Only WhatsApp',    sublabel: 'I manage calls and messages', icon: MessageCircle, score: 1 },
      { value: 'help',     label: 'I need some help', sublabel: 'Phones can be confusing',     icon: HelpCircle,    score: 2 },
    ],
  },
  /* ── NEW Q4 – Language Preference ── */
  {
    id: 'language',
    question: 'Aapki pasandida bhasha?',
    hint: 'Hum aapki bhasha mein baat karenge.',
    options: [
      { value: 'hindi',   label: 'हिन्दी',   sublabel: 'Hindi mein baat karna pasand hai', icon: Languages, score: 0 },
      { value: 'english', label: 'English',   sublabel: 'I prefer English',                 icon: MessageCircle, score: 0 },
    ],
  },
  /* ── NEW Q5 – Mobility / Health ── */
  {
    id: 'mobility',
    question: 'Kya aapko chalne-phirne mein takleef hai?',
    hint: 'Yeh jaankari aapke liye sahi saathi dhundhne mein madad karegi.',
    options: [
      {
        value: 'low',
        label: 'Haan, ghutno/jodo mein dard hai',
        sublabel: 'Bahar jaana mushkil lagta hai',
        icon: Accessibility,
        score: 2,
        mobility_status: 'Low',
      },
      {
        value: 'high',
        label: 'Nahi, main theek chal leta/leti hun',
        sublabel: 'Chalna-phirna theek hai',
        icon: PersonStanding,
        score: 0,
        mobility_status: 'High',
      },
    ],
  },
  /* ── NEW Q6 – Living Situation / Grief ── */
  {
    id: 'living',
    question: 'Ghar mein aap kiske saath rehte hain?',
    hint: 'Aapki zindagi ko samajhne ke liye pooch rahe hain.',
    options: [
      {
        value: 'alone',
        label: 'Akele rehta/rehti hun',
        sublabel: 'Apna saathi kho diya hai',
        icon: UserX,
        score: 2,
        grief_status: 'Alone',
      },
      {
        value: 'family',
        label: 'Parivaar ke saath',
        sublabel: 'Bachche ya spouse ke saath hun',
        icon: HeartHandshake,
        score: 0,
        grief_status: 'With Family',
      },
    ],
  },
]

const TOTAL_STEPS = QUESTIONS.length + 1 // questions + name entry

/* ── Isolation score → profile ── */
function getIsolationProfile(score) {
  if (score <= 2) return { level: 'Connected',        color: 'text-sage-600',  bg: 'bg-sage-500/10'  }
  if (score <= 5) return { level: 'Somewhat isolated', color: 'text-amber-500', bg: 'bg-amber-400/10' }
  return           { level: 'Needs connection',        color: 'text-rose-600',  bg: 'bg-rose-600/10'  }
}

export default function OnboardingScreen({ onComplete }) {
  const [step, setStep]     = useState(0)   // 0–5 = questions, 6 = name entry
  const [answers, setAnswers] = useState({})
  const [name, setName]     = useState('')

  const isNameStep = step === QUESTIONS.length
  const q          = QUESTIONS[step]
  const selected   = answers[q?.id]
  const canProceed = isNameStep ? name.trim().length >= 2 : !!selected

  function choose(value) {
    setAnswers(prev => ({ ...prev, [q.id]: value }))
  }

  function goNext() {
    if (!isNameStep) {
      setStep(s => s + 1)
    } else {
      // Build full user object
      const score = QUESTIONS.reduce((acc, question) => {
        const opt = question.options.find(o => o.value === answers[question.id])
        return acc + (opt?.score ?? 0)
      }, 0)

      // Derive structured fields for matching engine
      const mobilityOpt = QUESTIONS.find(q => q.id === 'mobility')
        ?.options.find(o => o.value === answers['mobility'])
      const livingOpt = QUESTIONS.find(q => q.id === 'living')
        ?.options.find(o => o.value === answers['living'])

      onComplete({
        name:            name.trim(),
        phone:           '', // passed from App
        answers,
        isolationScore:  score,
        profile:         getIsolationProfile(score),
        language:        answers['language'] ?? 'hindi',
        mobility_status: mobilityOpt?.mobility_status ?? 'High',
        grief_status:    livingOpt?.grief_status ?? 'With Family',
      })
    }
  }

  function goBack() {
    if (step > 0) setStep(s => s - 1)
  }

  /* ════════════════════════════════════════
     NAME ENTRY STEP
  ════════════════════════════════════════ */
  if (isNameStep) {
    return (
      <div className="min-h-screen bg-cream-100 flex flex-col px-5 py-8 screen-enter">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={goBack}
            className="w-12 h-12 rounded-xl bg-white border border-cream-300 flex items-center justify-center shadow-card"
            aria-label="Go back">
            <ChevronLeft size={24} className="text-charcoal-600" />
          </button>
          <span className="text-base text-charcoal-500">Almost done</span>
        </div>

        <ProgressDots total={TOTAL_STEPS} current={step} />

        <div className="mt-8 flex-1 flex flex-col">
          <h1 className="text-3xl font-bold text-charcoal-800 leading-tight mb-3">
            Aapko kya bulaayen? 😊
          </h1>
          <p className="text-lg text-charcoal-500 mb-8">
            Sirf pehla naam kaafi hai.
          </p>

          <label htmlFor="name-input" className="text-xl font-semibold text-charcoal-700 mb-3 block">
            Aapka Naam
          </label>
          <input
            id="name-input"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="jaise Ramesh, Savitri…"
            autoFocus
            className="
              w-full px-5 py-4 rounded-2xl border-2 border-cream-300 bg-white
              text-2xl font-semibold text-charcoal-800 placeholder:text-charcoal-500/40
              focus:border-sage-600 focus:outline-none transition-colors shadow-card
            "
          />

          <div className="mt-auto pt-8">
            <BigButton onClick={goNext} disabled={!canProceed} icon={CheckCircle2}>
              Meri Yatra Shuru Karo
            </BigButton>
          </div>
        </div>
      </div>
    )
  }

  /* ════════════════════════════════════════
     QUESTION STEPS
  ════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col px-5 py-8 screen-enter">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        {step > 0 ? (
          <button onClick={goBack}
            className="w-12 h-12 rounded-xl bg-white border border-cream-300 flex items-center justify-center shadow-card"
            aria-label="Go back">
            <ChevronLeft size={24} className="text-charcoal-600" />
          </button>
        ) : (
          <div className="w-12" />
        )}

        <div className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <span className="text-xl font-bold text-charcoal-800">Saathi</span>
        </div>

        <div className="w-12" />
      </div>

      <ProgressDots total={TOTAL_STEPS} current={step} />

      {/* Question header */}
      <div className="mt-7 mb-6">
        <p className="text-base text-charcoal-500 mb-2 font-medium uppercase tracking-wider">
          Sawaal {step + 1} / {QUESTIONS.length}
        </p>
        <h1 className="text-3xl font-bold text-charcoal-800 leading-tight">
          {q.question}
        </h1>
        <p className="text-lg text-charcoal-500 mt-2">{q.hint}</p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-4 flex-1">
        {q.options.map((opt, i) => (
          <div key={opt.value} className={`fade-up fade-up-${i + 1}`}>
            <OptionCard
              icon={opt.icon}
              label={opt.label}
              sublabel={opt.sublabel}
              selected={selected === opt.value}
              onClick={() => choose(opt.value)}
            />
          </div>
        ))}
      </div>

      {/* Next button */}
      <div className="mt-6 pb-4">
        <BigButton onClick={goNext} disabled={!canProceed} icon={ChevronRight}>
          {step < QUESTIONS.length - 1 ? 'Aage Badhein' : 'Ek Aakhri Kadam'}
        </BigButton>
      </div>
    </div>
  )
}
