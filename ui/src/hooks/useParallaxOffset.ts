import { useEffect, useRef, useState } from 'react'

/**
 * Vertical parallax offset (px) for a background layer.
 * Tied to window scroll; dampened so the image moves slower than the page.
 */
export function useParallaxOffset(strength = 0.28) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [offsetY, setOffsetY] = useState(0)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const update = () => {
      if (reduceMotion.matches) {
        setOffsetY(0)
        return
      }
      const el = sectionRef.current
      if (!el) return
      const scrollY = window.scrollY
      const rect = el.getBoundingClientRect()
      const sectionTop = scrollY + rect.top
      // Movement relative to where the section sits in the document
      const delta = scrollY - sectionTop
      setOffsetY(delta * strength)
    }

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        update()
      })
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    reduceMotion.addEventListener('change', update)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      reduceMotion.removeEventListener('change', update)
      cancelAnimationFrame(raf)
    }
  }, [strength])

  return { sectionRef, offsetY }
}
