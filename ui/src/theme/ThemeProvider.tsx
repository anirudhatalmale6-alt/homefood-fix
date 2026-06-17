import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  THEME_IDS,
  THEME_STORAGE_KEY,
  THEMES,
  resolveThemeId,
  type ThemeId,
} from '../constants/theme'

type ThemeContextValue = {
  themeId: ThemeId
  setThemeId: (id: ThemeId) => void
  toggleFestive: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readStoredTheme(): ThemeId {
  if (typeof window === 'undefined') return 'default'
  try {
    return resolveThemeId(localStorage.getItem(THEME_STORAGE_KEY))
  } catch {
    return 'default'
  }
}

function applyThemeToDocument(themeId: ThemeId) {
  const root = document.documentElement
  for (const id of THEME_IDS) {
    const className = THEMES[id].className
    if (className) root.classList.remove(className)
  }
  const active = THEMES[themeId]
  if (active.className) root.classList.add(active.className)

  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (meta) meta.content = active.themeColor
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(readStoredTheme)

  const setThemeId = useCallback((id: ThemeId) => {
    setThemeIdState(id)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, id)
    } catch {
      /* private browsing */
    }
    applyThemeToDocument(id)
  }, [])

  useEffect(() => {
    applyThemeToDocument(themeId)
  }, [themeId])

  const toggleFestive = useCallback(() => {
    setThemeId(themeId === 'festive' ? 'default' : 'festive')
  }, [setThemeId, themeId])

  const value = useMemo(
    () => ({ themeId, setThemeId, toggleFestive }),
    [themeId, setThemeId, toggleFestive],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
