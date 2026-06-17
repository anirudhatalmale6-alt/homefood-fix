import { THEMES } from '../constants/theme'
import { useTheme } from '../theme/ThemeProvider'

/** Switches tailwindcss-themer palette via class on <html> (see tailwind.config.cjs). */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { themeId, toggleFestive } = useTheme()
  const active = THEMES[themeId]
  const isFestive = themeId === 'festive'

  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1.5 rounded-xl border border-beige bg-white/80 px-3 py-2 text-sm font-medium text-charcoal shadow-sm transition hover:border-primary/40 hover:text-primary ${className}`}
      onClick={toggleFestive}
      aria-pressed={isFestive}
      aria-label={isFestive ? 'Switch to classic theme' : 'Switch to festive theme'}
      title={`Theme: ${active.label}`}
    >
      <span aria-hidden>{isFestive ? '🎄' : '🍲'}</span>
      <span className="hidden sm:inline">{active.label}</span>
    </button>
  )
}
