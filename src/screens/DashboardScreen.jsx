import { useState } from 'react'
import {
  BookOpen, Users, MessageCircle,
  Sun, Bell, ChevronRight,
} from 'lucide-react'
import EmergencyBar from '../components/EmergencyBar'

/* ── Feature card data ── */
const FEATURES = [
  {
    id: 'wisdom',
    icon: BookOpen,
    iconBg: 'bg-amber-400/15',
    iconColor: 'text-amber-500',
    borderColor: 'border-amber-400/30',
    title: 'Share Your Wisdom',
    subtitle: 'Young people are asking for life advice. Record a voice note.',
    badge: '3 new questions',
    badgeBg: 'bg-amber-400/20 text-amber-500',
  },
  {
    id: 'peers',
    icon: Users,
    iconBg: 'bg-sage-500/15',
    iconColor: 'text-sage-600',
    borderColor: 'border-sage-500/30',
    title: 'Meet Your Peers',
    subtitle: 'Connect with 3 people who share your health constraints and hobbies.',
    badge: '3 matches waiting',
    badgeBg: 'bg-sage-500/20 text-sage-600',
  },
  {
    id: 'saathi',
    icon: MessageCircle,
    iconBg: 'bg-blue-400/15',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-400/30',
    title: 'Saathi – Your AI Friend',
    subtitle: 'Tap to talk to someone right now.',
    badge: 'Always available',
    badgeBg: 'bg-blue-400/20 text-blue-600',
  },
]

/* ── Greeting based on time of day ── */
function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Suprabhat'   // Good morning
  if (h < 17) return 'Namaste'
  if (h < 20) return 'Shubh Sandhya' // Good evening
  return 'Shubh Ratri'              // Good night
}

  /* ── Emergency modal — scoped inside shell ── */
function EmergencyModal({ onClose }) {
  return (
    <div className="absolute inset-0 z-[100] flex items-end justify-center bg-black/50 px-4 pb-4"
      role="dialog" aria-modal="true" aria-label="Emergency call options">
      <div className="w-full bg-white rounded-3xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-charcoal-800 mb-1">Call for Help</h2>
        <p className="text-lg text-charcoal-500 mb-6">Who would you like to reach?</p>

        <div className="flex flex-col gap-3">
          {[
            { label: '📞  Call Son – Arjun',    number: '+91 98765 43210' },
            { label: '📞  Call Daughter – Priya', number: '+91 87654 32109' },
            { label: '🚑  Ambulance (112)',       number: '112' },
          ].map(c => (
            <a key={c.number} href={`tel:${c.number}`}
              className="flex items-center justify-between px-5 py-4 rounded-2xl bg-cream-100 border-2 border-cream-300 active:bg-cream-200 transition-colors">
              <span className="text-xl font-semibold text-charcoal-800">{c.label}</span>
              <ChevronRight size={22} className="text-charcoal-500" />
            </a>
          ))}
        </div>

        <button onClick={onClose}
          className="mt-5 w-full min-h-[56px] rounded-2xl bg-cream-200 text-charcoal-700 text-xl font-semibold active:bg-cream-300 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function DashboardScreen({ user, onNavigate }) {
  const [showEmergency, setShowEmergency] = useState(false)

  return (
    <div className="min-h-full bg-cream-100 flex flex-col pb-emergency screen-enter relative">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 pt-8 pb-4">
        <div>
          <p className="text-lg text-charcoal-500 font-medium">{getGreeting()},</p>
          <h1 className="text-3xl font-bold text-charcoal-800 leading-tight">
            {user.name} 🙏
          </h1>
        </div>
        <button className="w-12 h-12 rounded-xl bg-white border border-cream-300 flex items-center justify-center shadow-card relative" aria-label="Notifications">
          <Bell size={22} className="text-charcoal-600" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-rose-600" aria-hidden="true" />
        </button>
      </div>

      {/* ── Daily quote / mood strip ── */}
      <div className="mx-5 mb-6 px-5 py-4 rounded-2xl bg-white border border-cream-300 shadow-card fade-up fade-up-1">
        <div className="flex items-start gap-3">
          <Sun size={22} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-lg text-charcoal-700 italic leading-snug">
            "The older I grow, the more I listen to people who don't talk much."
          </p>
        </div>
        <p className="text-base text-charcoal-500 mt-2 ml-9">— Germain G. Glidden</p>
      </div>

      {/* ── Feature cards ── */}
      <div className="px-5 flex flex-col gap-4">
        {FEATURES.map((f, i) => {
          const Icon = f.icon
          return (
            <button
              key={f.id}
              onClick={() => onNavigate(f.id)}
              className={`
                fade-up fade-up-${i + 2}
                w-full flex items-center gap-4 px-5 py-5 rounded-2xl
                bg-white border-2 ${f.borderColor}
                shadow-card active:shadow-card-hover active:scale-[0.98]
                transition-all duration-200 text-left
              `}
              aria-label={`${f.title}: ${f.subtitle}`}
            >
              {/* Icon */}
              <span className={`flex-shrink-0 w-16 h-16 rounded-2xl ${f.iconBg} flex items-center justify-center`}>
                <Icon size={32} className={f.iconColor} strokeWidth={1.8} />
              </span>

              {/* Text */}
              <span className="flex-1 min-w-0">
                <span className="block text-xl font-bold text-charcoal-800 leading-snug">
                  {f.title}
                </span>
                <span className="block text-base text-charcoal-500 mt-1 leading-snug">
                  {f.subtitle}
                </span>
                {/* Badge */}
                <span className={`inline-block mt-2 px-3 py-0.5 rounded-full text-sm font-semibold ${f.badgeBg}`}>
                  {f.badge}
                </span>
              </span>

              <ChevronRight size={22} className="flex-shrink-0 text-charcoal-400" />
            </button>
          )
        })}
      </div>

      {/* Emergency bar */}
      <EmergencyBar onPress={() => setShowEmergency(true)} />

      {/* Emergency modal */}
      {showEmergency && <EmergencyModal onClose={() => setShowEmergency(false)} />}
    </div>
  )
}
