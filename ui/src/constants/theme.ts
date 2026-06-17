/**
 * Theme names must match `themes[].name` in tailwind.config.cjs (tailwindcss-themer).
 * Default palette applies when no alternate theme class is on <html>.
 */
export const THEME_STORAGE_KEY = 'homefood-theme'

export const THEMES = {
  default: {
    id: 'default',
    label: 'Classic',
    /** <meta name="theme-color"> when this palette is active */
    themeColor: '#c0392b',
    /** tailwindcss-themer class on <html>; omit for defaultTheme */
    className: null as string | null,
  },
  festive: {
    id: 'festive',
    label: 'Festive',
    themeColor: '#9b2335',
    className: 'festive',
  },
} as const

export type ThemeId = keyof typeof THEMES

export const THEME_IDS = Object.keys(THEMES) as ThemeId[]

export function isThemeId(value: string): value is ThemeId {
  return value in THEMES
}

export function resolveThemeId(stored: string | null): ThemeId {
  return stored && isThemeId(stored) ? stored : 'default'
}
