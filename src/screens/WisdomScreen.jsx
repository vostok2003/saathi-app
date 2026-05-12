import { useState, useRef, useEffect } from 'react'
import {
  ChevronLeft, Mic, MicOff, Send,
  ThumbsUp, Clock, User,
  CheckCircle2, RotateCcw,
} from 'lucide-react'
import EmergencyBar from '../components/EmergencyBar'

/* ── Mock questions from young people ── */
const QUESTIONS = [
  {
    id: 1,
    asker: 'Rahul',
    age: 22,
    avatar: '👨‍💻',
    city: 'Bengaluru',
    question: 'How do I handle career stress and the pressure to succeed quickly?',
    context: 'I just started my first job and feel overwhelmed.',
    timeAgo: '2 hours ago',
    category: 'Career & Life',
  },
  {
    id: 2,
    asker: 'Priya',
    age: 19,
    avatar: '👩‍🎓',
    city: 'Pune',
    question: 'How do I stay patient when things don\'t go as planned?',
    context: 'I failed my entrance exam and feel lost.',
    timeAgo: '5 hours ago',
    category: 'Patience & Resilience',
  },
  {
    id: 3,
    asker: 'Arjun',
    age: 25,
    avatar: '👨‍🔬',
    city: 'Delhi',
    question: 'How did you balance family and personal ambitions in your youth?',
    context: 'I want to move abroad but my parents need me here.',
    timeAgo: '1 day ago',
    category: 'Family & Duty',
  },
]

/* ── Recording states ── */
const STATE = {
  IDLE:       'idle',
  RECORDING:  'recording',
  RECORDED:   'recorded',
  SUBMITTED:  'submitted',
}

/* ── Waveform visualiser (pure CSS animation) ── */
function Waveform({ active }) {
  const bars = [0.4, 0.7, 1, 0.8, 0.5, 0.9, 0.6, 1, 0.7, 0.4]
  return (
    <div className="flex items-center justify-center gap-1 h-10" aria-hidden="true">
      {bars.map((h, i) => (
        <span
          key={i}
          className={`w-1.5 rounded-full transition-all ${active ? 'bg-sage-600' : 'bg-charcoal-500/20'}`}
          style={{
            height: active ? `${h * 36}px` : '6px',
            animation: active ? `waveBar 0.8s ease-in-out ${i * 0.08}s infinite alternate` : 'none',
          }}
        />
      ))}
      <style>{`
        @keyframes waveBar {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1);   }
        }
      `}</style>
    </div>
  )
}

/* ── Timer display ── */
function RecordTimer({ seconds }) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')
  return (
    <span className="text-2xl font-mono font-bold text-charcoal-800 tabular-nums">
      {m}:{s}
    </span>
  )
}

export default function WisdomScreen({ user, onBack }) {
  const [qIndex, setQIndex]       = useState(0)
  const [recState, setRecState]   = useState(STATE.IDLE)
  const [seconds, setSeconds]     = useState(0)
  const [showEmergency, setShowEmergency] = useState(false)
  const timerRef = useRef(null)

  const q = QUESTIONS[qIndex]

  /* Timer logic */
  useEffect(() => {
    if (recState === STATE.RECORDING) {
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [recState])

  function startRecording() {
    setSeconds(0)
    setRecState(STATE.RECORDING)
  }

  function stopRecording() {
    if (seconds < 2) return // too short
    setRecState(STATE.RECORDED)
  }

  function discardRecording() {
    setSeconds(0)
    setRecState(STATE.IDLE)
  }

  function submitAdvice() {
    setRecState(STATE.SUBMITTED)
  }

  function nextQuestion() {
    setQIndex(i => (i + 1) % QUESTIONS.length)
    setRecState(STATE.IDLE)
    setSeconds(0)
  }

  /* ── Submitted state ── */
  if (recState === STATE.SUBMITTED) {
    return (
      <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center px-5 py-10 screen-enter">
        <div className="w-24 h-24 rounded-full bg-sage-500/15 flex items-center justify-center mb-6">
          <CheckCircle2 size={52} className="text-sage-600" strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-bold text-charcoal-800 text-center mb-3">
          Your wisdom has been shared!
        </h2>
        <p className="text-xl text-charcoal-500 text-center mb-2">
          Rahul will receive your voice note.
        </p>
        <p className="text-lg text-charcoal-500 text-center mb-10">
          You may have just changed someone's life today. 🙏
        </p>

        <div className="w-full flex flex-col gap-4">
          <button onClick={nextQuestion}
            className="w-full min-h-[64px] rounded-2xl bg-sage-600 text-white text-xl font-semibold flex items-center justify-center gap-3 shadow-card active:scale-[0.97] transition-transform">
            <ThumbsUp size={24} />
            Answer Another Question
          </button>
          <button onClick={onBack}
            className="w-full min-h-[64px] rounded-2xl bg-cream-200 border-2 border-cream-300 text-charcoal-700 text-xl font-semibold flex items-center justify-center gap-3 shadow-card active:scale-[0.97] transition-transform">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col pb-28 screen-enter">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-5 pt-8 pb-5">
        <button onClick={onBack}
          className="w-12 h-12 rounded-xl bg-white border border-cream-300 flex items-center justify-center shadow-card"
          aria-label="Go back">
          <ChevronLeft size={24} className="text-charcoal-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-charcoal-800 leading-tight">Share Your Wisdom</h1>
          <p className="text-base text-charcoal-500">Young India is listening</p>
        </div>
      </div>

      {/* ── Question navigation pills ── */}
      <div className="flex gap-2 px-5 mb-5 overflow-x-auto pb-1 scrollbar-hide">
        {QUESTIONS.map((item, i) => (
          <button key={item.id} onClick={() => { setQIndex(i); setRecState(STATE.IDLE); setSeconds(0) }}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-base font-semibold border transition-colors ${
              i === qIndex
                ? 'bg-sage-600 text-white border-sage-600'
                : 'bg-white text-charcoal-600 border-cream-300'
            }`}>
            {item.asker}
          </button>
        ))}
      </div>

      {/* ── Question card ── */}
      <div className="mx-5 mb-6 bg-white rounded-3xl border-2 border-cream-300 shadow-card overflow-hidden fade-up fade-up-1">
        {/* Category tag */}
        <div className="px-5 pt-4 pb-2">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-400/15 text-amber-500 text-sm font-semibold">
            {q.category}
          </span>
        </div>

        {/* Asker info */}
        <div className="flex items-center gap-3 px-5 pb-3">
          <span className="text-4xl">{q.avatar}</span>
          <div>
            <p className="text-xl font-bold text-charcoal-800">
              {q.asker}, {q.age}
            </p>
            <p className="text-base text-charcoal-500 flex items-center gap-1.5">
              <User size={14} />
              {q.city}
              <span className="mx-1">·</span>
              <Clock size={14} />
              {q.timeAgo}
            </p>
          </div>
        </div>

        {/* The question */}
        <div className="px-5 pb-3">
          <p className="text-2xl font-bold text-charcoal-800 leading-snug">
            "{q.question}"
          </p>
        </div>

        {/* Context */}
        <div className="mx-5 mb-5 px-4 py-3 rounded-xl bg-cream-100 border border-cream-300">
          <p className="text-base text-charcoal-600 italic">
            Context: {q.context}
          </p>
        </div>
      </div>

      {/* ── Recording interface ── */}
      <div className="mx-5 bg-white rounded-3xl border-2 border-cream-300 shadow-card px-5 py-6 flex flex-col items-center fade-up fade-up-2">

        {recState === STATE.IDLE && (
          <>
            <p className="text-xl font-semibold text-charcoal-700 text-center mb-2">
              Hold and speak your advice
            </p>
            <p className="text-base text-charcoal-500 text-center mb-6">
              No typing needed. Just talk naturally.
            </p>

            {/* Big mic button */}
            <div className="relative flex items-center justify-center mb-6">
              <button
                onPointerDown={startRecording}
                className="
                  relative z-10 w-28 h-28 rounded-full
                  bg-sage-600 text-white
                  flex items-center justify-center
                  shadow-[0_6px_24px_rgba(92,122,92,0.45)]
                  active:scale-95 transition-transform duration-150
                "
                aria-label="Hold to record your advice">
                <Mic size={48} strokeWidth={1.8} />
              </button>
            </div>

            <p className="text-base text-charcoal-500 text-center">
              Tap the microphone to start recording
            </p>
          </>
        )}

        {recState === STATE.RECORDING && (
          <>
            <p className="text-xl font-semibold text-sage-600 text-center mb-2">
              Recording… speak clearly
            </p>
            <Waveform active={true} />
            <RecordTimer seconds={seconds} />
            <p className="text-base text-charcoal-500 text-center mt-2 mb-6">
              Tap the button again to stop
            </p>

            {/* Pulsing mic */}
            <div className="relative flex items-center justify-center mb-4">
              {/* Pulse rings */}
              <span className="absolute w-28 h-28 rounded-full bg-sage-500/20 pulse-ring" />
              <span className="absolute w-28 h-28 rounded-full bg-sage-500/15 pulse-ring" style={{ animationDelay: '0.4s' }} />
              <button
                onClick={stopRecording}
                className="
                  relative z-10 w-28 h-28 rounded-full
                  bg-rose-600 text-white
                  flex items-center justify-center
                  shadow-[0_6px_24px_rgba(192,57,43,0.45)]
                  active:scale-95 transition-transform duration-150
                "
                aria-label="Stop recording">
                <MicOff size={48} strokeWidth={1.8} />
              </button>
            </div>
          </>
        )}

        {recState === STATE.RECORDED && (
          <>
            <p className="text-xl font-semibold text-charcoal-800 text-center mb-3">
              Recording ready!
            </p>
            <Waveform active={false} />
            <p className="text-lg text-charcoal-500 text-center mt-1 mb-6">
              Duration: <RecordTimer seconds={seconds} />
            </p>

            {/* Playback bar (mock) */}
            <div className="w-full h-2 rounded-full bg-cream-200 mb-6 overflow-hidden">
              <div className="h-full w-2/3 rounded-full bg-sage-500" />
            </div>

            <div className="w-full flex flex-col gap-3">
              <button onClick={submitAdvice}
                className="w-full min-h-[64px] rounded-2xl bg-sage-600 text-white text-xl font-semibold flex items-center justify-center gap-3 shadow-card active:scale-[0.97] transition-transform">
                <Send size={22} />
                Send My Advice to {q.asker}
              </button>
              <button onClick={discardRecording}
                className="w-full min-h-[56px] rounded-2xl bg-cream-200 border-2 border-cream-300 text-charcoal-600 text-lg font-semibold flex items-center justify-center gap-2 active:scale-[0.97] transition-transform">
                <RotateCcw size={18} />
                Record Again
              </button>
            </div>
          </>
        )}
      </div>

      <EmergencyBar onPress={() => setShowEmergency(true)} />
    </div>
  )
}
