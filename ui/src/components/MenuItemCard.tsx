import type { ComponentPropsWithoutRef } from 'react'
import type { MenuCarouselItem } from '../data/menuCarouselItems'

type MenuItemCardProps = {
  item: MenuCarouselItem
  onAddToOrder?: (id: string) => void
  added?: boolean
} & ComponentPropsWithoutRef<'article'>

/** Dish card — shared by carousel and full menu grid */
export function MenuItemCard({
  item,
  onAddToOrder,
  added = false,
  className = '',
  ...articleProps
}: MenuItemCardProps) {
  const base =
    'flex flex-col overflow-hidden rounded-2xl border border-beige bg-white shadow-lg sm:rounded-3xl'
  return (
    <article className={`${base} ${className}`.trim()} {...articleProps}>
      <div className="relative aspect-[4/3] overflow-hidden bg-beige/50">
        <img
          src={item.image}
          alt={item.imageAlt}
          className="h-full w-full object-cover"
          width={480}
          height={360}
          loading="lazy"
          draggable={false}
        />
        {item.badge ? (
          <span className="absolute left-2 top-2 rounded-full bg-basil px-2 py-0.5 text-[10px] font-bold text-white shadow sm:left-3 sm:top-3 sm:px-3 sm:text-xs">
            {item.badge}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-sm font-semibold leading-snug text-charcoal sm:text-base">
            {item.name}
          </h3>
          <span className="shrink-0 rounded-md bg-beige px-1.5 py-0.5 text-xs font-bold text-primary sm:text-sm">
            {item.price}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-charcoal/70 sm:text-sm">
          {item.description}
        </p>
        {onAddToOrder ? (
          <button
            type="button"
            onClick={(ev) => {
              ev.stopPropagation()
              onAddToOrder(item.id)
            }}
            className={`mt-2 inline-flex min-h-[40px] items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold transition sm:mt-3 sm:rounded-xl sm:text-sm ${
              added ? 'bg-basil text-white' : 'bg-primary text-white hover:bg-primary-hover'
            }`}
          >
            {added ? 'Added' : 'Add to Order'}
          </button>
        ) : null}
      </div>
    </article>
  )
}
