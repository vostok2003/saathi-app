/**
 * OptionCard – a large, tappable answer card for onboarding questions.
 * Designed for elderly users: big text, clear selection state, generous padding.
 */
export default function OptionCard({ icon: Icon, label, sublabel, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={`
        w-full flex items-center gap-4 px-5 py-5 rounded-2xl border-2 text-left
        transition-all duration-200 shadow-card active:scale-[0.98]
        ${selected
          ? 'border-sage-600 bg-sage-500/10 shadow-card-hover'
          : 'border-cream-300 bg-white hover:border-sage-500/50 hover:shadow-card-hover'
        }
      `}
    >
      {/* Icon bubble */}
      <span className={`
        flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl
        ${selected ? 'bg-sage-600 text-white' : 'bg-cream-200 text-charcoal-600'}
        transition-colors duration-200
      `}>
        {Icon ? <Icon size={28} strokeWidth={1.8} /> : null}
      </span>

      {/* Text */}
      <span className="flex-1 min-w-0">
        <span className="block text-xl font-semibold text-charcoal-800 leading-snug">
          {label}
        </span>
        {sublabel && (
          <span className="block text-base text-charcoal-500 mt-0.5 leading-snug">
            {sublabel}
          </span>
        )}
      </span>

      {/* Check indicator */}
      <span className={`
        flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center
        transition-all duration-200
        ${selected ? 'border-sage-600 bg-sage-600' : 'border-charcoal-500/30 bg-transparent'}
      `}>
        {selected && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </span>
    </button>
  )
}
