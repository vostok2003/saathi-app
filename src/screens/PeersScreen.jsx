import { useState, useMemo } from 'react'
import {
  ChevronLeft, Mic, MapPin, Heart,
  Clock, CheckCircle2, Users, Sparkles,
} from 'lucide-react'
import { matchPeers } from '../data/peersData'
import EmergencyBar from '../components/EmergencyBar'

/* ── Match score → label + color ── */
function getMatchLabel(score) {
  if (score >= 11) return { label: 'Perfect Match',  bg: 'bg-sage-500/15',   text: 'text-sage-600',  dot: 'bg-sage-600'  }
  if (score >= 7)  return { label: 'Great Match',    bg: 'bg-amber-400/15',  text: 'text-amber-500', dot: 'bg-amber-400' }
  return                   { label: 'Good Match',    bg: 'bg-blue-400/15',   text: 'text-blue-600',  dot: 'bg-blue-400'  }
}

/* ── Voice note sent confirmation modal ── */
function SentModal({ peer, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 px-4 pb-6"
      role="dialog" aria-modal="true">
      <div className="w-full bg-white rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-sage-500/15 flex items-center justify-center mb-4">
            <CheckCircle2 size={44} className="text-sage-600" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-bold text-charcoal-800 mb-2">
            Voice note bhej diya! 🙏
          </h2>
          <p className="text-lg text-charcoal-500 mb-1">
            <span className="font-semibold text-charcoal-700">{peer.name}</span> ko aapka
            parichay message mil gaya.
          </p>
          <p className="text-base text-charcoal-500 mb-6">
            {peer.responseTime}.
          </p>
          <button onClick={onClose}
            className="w-full min-h-[60px] rounded-2xl bg-sage-600 text-white text-xl font-semibold
              flex items-center justify-center shadow-card active:scale-[0.97] transition-transform">
            Theek Hai, Dhanyavaad!
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Single peer card ── */
function PeerCard({ peer, rank, onSendVoiceNote }) {
  const matchInfo = getMatchLabel(peer.matchScore)

  return (
    <div className={`
      bg-white rounded-3xl border-2 shadow-card overflow-hidden fade-up fade-up-${rank}
      ${rank === 1 ? 'border-sage-500/40' : 'border-cream-300'}
    `}>
      {/* Top accent bar for #1 match */}
      {rank === 1 && (
        <div className="bg-sage-600 px-5 py-2 flex items-center gap-2">
          <Sparkles size={16} className="text-white" />
          <span className="text-white text-base font-semibold">Aapka Sabse Accha Saathi</span>
        </div>
      )}

      <div className="px-5 pt-5 pb-4">
        {/* Avatar + name row */}
        <div className="flex items-start gap-4 mb-4">
          <span className="text-5xl flex-shrink-0">{peer.avatar}</span>
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-bold text-charcoal-800 leading-tight">
              {peer.name}
            </h3>
            <p className="text-lg text-charcoal-500 flex items-center gap-1.5 mt-0.5">
              <MapPin size={16} className="flex-shrink-0" />
              {peer.city} · {peer.age} saal
            </p>
          </div>
          {/* Match badge */}
          <span className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${matchInfo.bg} ${matchInfo.text}`}>
            <span className={`w-2 h-2 rounded-full ${matchInfo.dot}`} />
            {matchInfo.label}
          </span>
        </div>

        {/* Bio */}
        <p className="text-lg text-charcoal-700 leading-relaxed mb-4 italic">
          "{peer.bio}"
        </p>

        {/* Shared traits */}
        <div className="flex flex-wrap gap-2 mb-4">
          {peer.mobility_status === 'Low' && (
            <span className="px-3 py-1 rounded-full bg-amber-400/15 text-amber-500 text-base font-semibold">
              🦵 Jodo mein dard
            </span>
          )}
          {peer.grief_status === 'Alone' && (
            <span className="px-3 py-1 rounded-full bg-rose-600/10 text-rose-600 text-base font-semibold">
              🏠 Akele rehte hain
            </span>
          )}
          {peer.interests.slice(0, 2).map(interest => (
            <span key={interest} className="px-3 py-1 rounded-full bg-cream-200 text-charcoal-600 text-base font-semibold">
              {interest}
            </span>
          ))}
        </div>

        {/* Response time */}
        <p className="text-base text-charcoal-500 flex items-center gap-2 mb-5">
          <Clock size={16} className="flex-shrink-0" />
          {peer.responseTime}
        </p>

        {/* CTA */}
        <button
          onClick={() => onSendVoiceNote(peer)}
          className="
            w-full min-h-[68px] rounded-2xl
            bg-sage-600 text-white
            text-xl font-bold
            flex items-center justify-center gap-3
            shadow-[0_4px_16px_rgba(74,103,65,0.35)]
            active:scale-[0.97] transition-transform duration-150
          "
          aria-label={`Send voice note to ${peer.name}`}
        >
          <Mic size={26} strokeWidth={2} />
          Voice Note Bhejo
        </button>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════
   MAIN SCREEN
════════════════════════════════════════ */
export default function PeersScreen({ user, onBack }) {
  const [sentPeer, setSentPeer]         = useState(null)
  const [showEmergency, setShowEmergency] = useState(false)

  // Run matching engine — memoised so it doesn't re-run on every render
  const matches = useMemo(() => matchPeers(user, 2), [user])

  /* Explain why these matches were chosen */
  function getMatchReason(peer) {
    const reasons = []
    if (peer.mobility_status === user.mobility_status && user.mobility_status === 'Low')
      reasons.push('Dono ko chalne mein takleef hai')
    if (peer.grief_status === user.grief_status && user.grief_status === 'Alone')
      reasons.push('Dono akele rehte hain')
    if (peer.language === user.language)
      reasons.push(`Dono ${user.language === 'hindi' ? 'Hindi' : 'English'} bolte hain`)
    if (reasons.length === 0) reasons.push('Milti-julti zindagi')
    return reasons.join(' · ')
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
          <h1 className="text-2xl font-bold text-charcoal-800 leading-tight">Aapke Saathi</h1>
          <p className="text-base text-charcoal-500">Aapke liye khaas log dhundhe hain</p>
        </div>
      </div>

      {/* ── Matching explanation banner ── */}
      <div className="mx-5 mb-6 px-5 py-4 rounded-2xl bg-white border border-cream-300 shadow-card fade-up fade-up-1">
        <div className="flex items-start gap-3">
          <Users size={22} className="text-sage-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-lg font-semibold text-charcoal-800 mb-1">
              Yeh log aapke jaisa hi mehsoos karte hain
            </p>
            <p className="text-base text-charcoal-500 leading-snug">
              Humne aapki sehat, bhasha aur zindagi ke hisaab se yeh {matches.length} log dhundhe hain.
              Shared pain creates the strongest bonds.
            </p>
          </div>
        </div>
      </div>

      {/* ── Match reason chips ── */}
      {matches.length > 0 && (
        <div className="px-5 mb-4 fade-up fade-up-1">
          <p className="text-base text-charcoal-500 font-semibold uppercase tracking-wider mb-2">
            Matching Reasons
          </p>
          <div className="flex flex-wrap gap-2">
            {getMatchReason(matches[0]).split(' · ').map((r, i) => (
              <span key={i} className="px-3 py-1.5 rounded-full bg-sage-500/10 text-sage-600 text-base font-semibold flex items-center gap-1.5">
                <Heart size={14} />
                {r}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Peer cards ── */}
      <div className="px-5 flex flex-col gap-5">
        {matches.map((peer, i) => (
          <PeerCard
            key={peer.id}
            peer={peer}
            rank={i + 1}
            onSendVoiceNote={p => setSentPeer(p)}
          />
        ))}
      </div>

      {/* ── No matches fallback (shouldn't happen with 6 profiles) ── */}
      {matches.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
          <span className="text-6xl mb-4">🔍</span>
          <p className="text-2xl font-bold text-charcoal-800 text-center mb-2">
            Abhi dhundh rahe hain…
          </p>
          <p className="text-lg text-charcoal-500 text-center">
            Jald hi aapke liye saathi milenge.
          </p>
        </div>
      )}

      <EmergencyBar onPress={() => setShowEmergency(true)} />

      {/* Sent confirmation modal */}
      {sentPeer && <SentModal peer={sentPeer} onClose={() => setSentPeer(null)} />}
    </div>
  )
}
