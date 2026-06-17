import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from './Reveal'
import { MenuInfiniteCarousel } from './MenuInfiniteCarousel'

/** Home — featured dishes carousel + link to full menu page */
export function HomeFeaturedMenu() {
  const [added, setAdded] = useState<Record<string, boolean>>({})
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const onAdd = useCallback((id: string) => {
    setAdded((prev) => ({ ...prev, [id]: true }))
    if (timers.current[id]) clearTimeout(timers.current[id])
    timers.current[id] = setTimeout(() => {
      setAdded((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
    }, 1600)
  }, [])

  return (
    <section
      id="menu-preview"
      className="border-t border-beige bg-cream px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="menu-preview-heading"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-basil/15 px-4 py-1 text-xs font-bold uppercase tracking-wider text-basil">
            Sample menu
          </span>
          <h2
            id="menu-preview-heading"
            className="mt-4 font-display text-3xl font-semibold text-charcoal sm:text-4xl"
          >
            A taste of this week’s favorites
          </h2>
          <p className="mt-4 text-lg text-charcoal/75">
            Auto-advances every 2.5 seconds—drag anytime to browse. See every dish on the menu page. Prices are
            samples; availability when you order.
          </p>
        </Reveal>

        <Reveal className="mt-10 sm:mt-14" delayMs={80}>
          <MenuInfiniteCarousel onAddToOrder={onAdd} added={added} />
        </Reveal>

        <Reveal className="mt-10 text-center sm:mt-12">
          <Link
            to="/menu"
            className="inline-flex items-center justify-center rounded-xl border-2 border-primary bg-transparent px-8 py-3.5 font-semibold text-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-beige hover:shadow-md"
          >
            View full menu
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
