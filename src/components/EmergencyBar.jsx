import { Phone } from 'lucide-react'

/**
 * EmergencyBar – persistent red "Call Family" strip pinned to the bottom.
 * Uses a sticky wrapper inside #root so it respects the 480px mobile shell.
 */
export default function EmergencyBar({ onPress }) {
  return (
    /*
     * sticky-bar sits at the bottom of the scroll container (#root).
     * We use a portal-like trick: the bar is rendered at the end of each
     * screen's DOM, but visually "sticks" via fixed positioning scoped to
     * the nearest containing block — which is #root (overflow-x: hidden
     * creates a new containing block in most browsers).
     *
     * For full cross-browser safety we use fixed + JS-computed left/width
     * via CSS custom properties set on #root. Simpler: just use fixed and
     * cap width to match #root's max-width.
     */
    <div
      className="fixed bottom-0 z-50 w-full px-4 pb-5 pt-2 pointer-events-none"
      style={{ maxWidth: '480px', left: '50%', transform: 'translateX(-50%)' }}
    >
      <div className="bg-gradient-to-t from-[#FAF7F0] via-[#FAF7F0]/80 to-transparent absolute inset-0 pointer-events-none" />
      <button
        onClick={onPress}
        className="
          relative pointer-events-auto
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
