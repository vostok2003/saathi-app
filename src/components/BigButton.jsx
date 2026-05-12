/**
 * BigButton – primary CTA button.
 * Minimum 64px height, full-width by default, large text.
 */
export default function BigButton({
  children,
  onClick,
  disabled = false,
  variant = 'primary',   // 'primary' | 'secondary' | 'danger'
  icon: Icon,
  className = '',
}) {
  const base = `
    w-full flex items-center justify-center gap-3
    min-h-[64px] px-6 py-4 rounded-2xl
    text-xl font-semibold tracking-wide
    transition-all duration-200 active:scale-[0.97]
    disabled:opacity-40 disabled:cursor-not-allowed
    shadow-card
  `

  const variants = {
    primary:   'bg-sage-600 text-white hover:bg-sage-700 active:bg-sage-700',
    secondary: 'bg-cream-200 text-charcoal-800 border-2 border-cream-300 hover:bg-cream-300',
    danger:    'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-700',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={26} strokeWidth={2} />}
      {children}
    </button>
  )
}
