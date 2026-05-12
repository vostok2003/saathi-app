/**
 * ProgressDots – shows which onboarding step the user is on.
 * Large dots for easy visibility.
 */
export default function ProgressDots({ total, current }) {
  return (
    <div className="flex items-center justify-center gap-3 py-2" role="progressbar"
      aria-valuenow={current + 1} aria-valuemin={1} aria-valuemax={total}
      aria-label={`Step ${current + 1} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i === current
              ? 'w-5 h-5 bg-sage-600'
              : i < current
              ? 'w-4 h-4 bg-sage-400'
              : 'w-4 h-4 bg-cream-300 border-2 border-charcoal-500/20'
          }`}
        />
      ))}
    </div>
  )
}
