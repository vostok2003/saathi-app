import { Phone } from 'lucide-react'

/**
 * EmergencyBar – persistent red "Call Family" strip pinned to the bottom.
 * Always visible, always reachable. Critical for elderly safety.
 */
export default function EmergencyBar({ onPress }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 bg-gradient-to-t from-cream-100 to-transparent pointer-events-none">
      <button
        onClick={onPress}
        className="
          pointer-events-auto
          w-full flex items-center justify-center gap-3
          min-h-[64px] px-6 py-4 rounded-2xl
          bg-rose-600 text-white
          text-xl font-bold tracking-wide
          shadow-[0_4px_20px_rgba(192,57,43,0.45)]
          active:scale-[0.97] transition-transform duration-150
        "
        aria-label="Emergency: Call Family"
      >
        <Phone size={26} strokeWidth={2.5} />
        Emergency – Call Family
      </button>
    </div>
  )
}
