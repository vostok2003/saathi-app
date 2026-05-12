import { Phone } from 'lucide-react'

/**
 * EmergencyBar — sticky bottom bar scoped inside .app-shell.
 * Uses CSS class `emergency-bar-wrap` (sticky, not fixed) so it
 * always aligns with the shell on both mobile and desktop.
 */
export default function EmergencyBar({ onPress }) {
  return (
    <div className="emergency-bar-wrap">
      <button
        onClick={onPress}
        className="
          w-full flex items-center justify-center gap-3
          min-h-[64px] px-6 py-4 rounded-2xl
          bg-rose-600 text-white
          text-xl font-bold tracking-wide
          shadow-[0_4px_20px_rgba(192,57,43,0.40)]
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
