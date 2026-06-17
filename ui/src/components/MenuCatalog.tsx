import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MENU_CAROUSEL_ITEMS } from '../data/menuCarouselItems'
import { MenuItemCard } from './MenuItemCard'
import { Reveal } from './Reveal'

/** Full menu — all items in a responsive grid (3 columns on large screens) */
export function MenuCatalog() {
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
      id="menu"
      className="border-t border-beige bg-cream px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      aria-labelledby="menu-page-heading"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-basil/15 px-4 py-1 text-xs font-bold uppercase tracking-wider text-basil">
            Menu
          </span>
          <h1
            id="menu-page-heading"
            className="mt-4 font-display text-3xl font-semibold text-charcoal sm:text-4xl lg:text-5xl"
          >
            This week’s favorites
          </h1>
          <p className="mt-4 text-lg text-charcoal/75">
            Sample prices and dishes—availability when you order. Ready to eat? Head to contact to place an order.
          </p>
        </Reveal>

        <ul className="mt-12 grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {MENU_CAROUSEL_ITEMS.map((item, i) => (
            <Reveal key={item.id} as="li" delayMs={i * 40} className="h-full">
              <MenuItemCard
                item={item}
                onAddToOrder={onAdd}
                added={!!added[item.id]}
                className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              />
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-14 text-center">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3.5 font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-lg"
          >
            Place an order
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
