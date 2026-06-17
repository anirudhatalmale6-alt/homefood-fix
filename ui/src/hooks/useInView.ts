import { useCallback, useEffect, useRef, useState } from 'react'

/** Fires once when the element enters the viewport (for scroll-reveal). */
export function useInView(options?: IntersectionObserverInit) {
  const [el, setEl] = useState<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)
  const optsRef = useRef(options)

  useEffect(() => {
    optsRef.current = options
  }, [options])

  const ref = useCallback((node: HTMLElement | null) => {
    setEl(node)
  }, [])

  useEffect(() => {
    if (!el || visible) return

    const showIfAlreadyInView = (): boolean => {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setVisible(true)
        return true
      }
      return false
    }

    if (showIfAlreadyInView()) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -48px 0px',
        ...optsRef.current,
      },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [el, visible])

  return { ref, visible }
}
