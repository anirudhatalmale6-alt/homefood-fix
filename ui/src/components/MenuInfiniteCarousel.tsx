import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import type { MenuCarouselItem } from '../data/menuCarouselItems'
import { MENU_CAROUSEL_ITEMS } from '../data/menuCarouselItems'
import { MenuItemCard } from './MenuItemCard'

const GAP_PX = 16
const COPIES = 4
/** Center card vs side (layout “2–1–2”) */
const SCALE_CENTER = 1.14
const SCALE_SIDE = 0.88
const OPACITY_SIDE = 0.8
const OPACITY_FAR = 0.35
/** Auto-advance interval (ms) */
const AUTO_ADVANCE_MS = 2500

function smoothstep01(t: number) {
  const x = Math.max(0, Math.min(1, t))
  return x * x * (3 - 2 * x)
}

/** Smooth scale/opacity from distance to viewport center (px). */
function scaleOpacityFromDistance(dist: number, step: number) {
  if (step <= 0) {
    return { scale: SCALE_CENTER, opacity: 1, z: 3 }
  }
  // t ~ 0 at center of a card, ~1 near the next card’s center (one “slot” of motion)
  const t = dist / (step * 0.72)
  let scale: number
  let opacity: number
  if (t <= 1) {
    const s = smoothstep01(t)
    scale = SCALE_CENTER + (SCALE_SIDE - SCALE_CENTER) * s
    opacity = 1 + (OPACITY_SIDE - 1) * s
  } else {
    const s2 = smoothstep01(Math.min(1, t - 1))
    scale = SCALE_SIDE + (0.82 - SCALE_SIDE) * s2
    opacity = OPACITY_SIDE + (OPACITY_FAR - OPACITY_SIDE) * s2
  }
  const z = Math.round(Math.max(1, Math.min(5, 80 - dist / 12)))
  return { scale, opacity, z }
}

type MenuInfiniteCarouselProps = {
  items?: MenuCarouselItem[]
  onAddToOrder?: (id: string) => void
  added?: Record<string, boolean>
}

/**
 * Infinite horizontal slider (GSAP) — ~3 cards per view, center larger, sides scaled + opacity 0.8.
 * Four duplicate runs in the DOM so the last dish flows into a clone of the first (no visible jump).
 * Auto-advances on a timer; drag still kills tweens (interruptible).
 * @see https://demos.gsap.com/demo/infinite-card-slider/
 */
export function MenuInfiniteCarousel({
  items = MENU_CAROUSEL_ITEMS,
  onAddToOrder,
  added = {},
}: MenuInfiniteCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const xRef = useRef(0)
  const dragging = useRef(false)
  const pointerId = useRef<number | null>(null)
  const startClientX = useRef(0)
  const startX = useRef(0)
  const lastClientX = useRef(0)
  const lastT = useRef(0)
  const velocity = useRef(0)

  const [dims, setDims] = useState({ cw: 0, cell: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const len = items.length
  const triple = useMemo(() => {
    const out: (MenuCarouselItem & { uid: string })[] = []
    for (let c = 0; c < COPIES; c++) {
      for (let i = 0; i < len; i++) {
        out.push({ ...items[i], uid: `${items[i].id}-${c}` })
      }
    }
    return out
  }, [items, len])

  const step = dims.cell > 0 ? dims.cell + GAP_PX : 0
  const segment = len * step

  /**
   * Shift `x` by whole sets of slides (invisible jump) so we stay in the middle
   * clones: after the last dish, the next clone of dish 1 is already in the DOM tail.
   */
  const seamlessNormalize = useCallback(
    (x: number) => {
      if (!segment || !step || !dims.cw || !dims.cell) return x
      const C = dims.cw / 2 - dims.cell / 2
      let nx = x
      let i = (C - nx) / step
      const upper = (COPIES - 1) * len
      while (i >= upper - 1e-6) {
        nx += segment
        i -= len
      }
      while (i < len - 1e-6) {
        nx -= segment
        i += len
      }
      return nx
    },
    [dims.cw, dims.cell, len, segment, step],
  )

  const snapX = useCallback(
    (rawX: number) => {
      const { cw, cell } = dims
      if (!cw || !cell || !step) return rawX
      const C = cw / 2 - cell / 2
      const k = Math.round((C - rawX) / step)
      const x = C - k * step
      return seamlessNormalize(x)
    },
    [dims, step, seamlessNormalize],
  )

  const updateCardVisuals = useCallback(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track || !dims.cw || !dims.cell || !step) return

    const centerScreen = viewport.getBoundingClientRect().left + viewport.getBoundingClientRect().width / 2
    const cards = track.querySelectorAll<HTMLElement>('[data-menu-card]')

    cards.forEach((card) => {
      const r = card.getBoundingClientRect()
      const cardCenter = r.left + r.width / 2
      const dist = Math.abs(cardCenter - centerScreen)
      const { scale, opacity, z } = scaleOpacityFromDistance(dist, step)
      gsap.set(card, {
        scale,
        opacity,
        zIndex: z,
        transformOrigin: '50% 50%',
        force3D: true,
      })
    })
  }, [dims, step])

  const setTrackX = useCallback(
    (x: number, skipNormalize = false) => {
      const nx = skipNormalize ? x : seamlessNormalize(x)
      xRef.current = nx
      gsap.set(trackRef.current, { x: nx, force3D: true })
      updateCardVisuals()
    },
    [seamlessNormalize, updateCardVisuals],
  )

  useLayoutEffect(() => {
    const el = viewportRef.current
    if (!el) return

    const measure = () => {
      const cw = el.clientWidth
      const cell = cw > 0 ? (cw - GAP_PX * 2) / 3 : 0
      setDims({ cw, cell })
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!dims.cw || !dims.cell || !trackRef.current || !len) return
    const st = dims.cell + GAP_PX
    const x0 = dims.cw / 2 - dims.cell / 2 - len * st
    xRef.current = x0
    gsap.set(trackRef.current, { x: x0, force3D: true })
    updateCardVisuals()
  }, [dims.cw, dims.cell, len, updateCardVisuals])

  const tweenTo = useCallback(
    (targetX: number) => {
      const end = snapX(targetX)
      gsap.to(trackRef.current, {
        x: end,
        duration: 0.55,
        ease: 'power3.out',
        overwrite: 'auto',
        onUpdate: () => {
          xRef.current = gsap.getProperty(trackRef.current, 'x') as number
          updateCardVisuals()
        },
        onComplete: () => {
          const raw = gsap.getProperty(trackRef.current, 'x') as number
          const settled = seamlessNormalize(Number(raw))
          xRef.current = settled
          setTrackX(settled, true)
        },
      })
    },
    [snapX, setTrackX, updateCardVisuals, seamlessNormalize],
  )

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0 || !dims.cw) return
      const track = trackRef.current
      if (!track) return
      gsap.killTweensOf(track)
      dragging.current = true
      setIsDragging(true)
      pointerId.current = e.pointerId
      startClientX.current = e.clientX
      startX.current = xRef.current
      lastClientX.current = e.clientX
      lastT.current = performance.now()
      velocity.current = 0
      const viewport = viewportRef.current
      if (viewport?.setPointerCapture) viewport.setPointerCapture(e.pointerId)
    },
    [dims.cw],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current || e.pointerId !== pointerId.current) return
      const dx = e.clientX - startClientX.current
      const now = performance.now()
      const dt = Math.max(8, now - lastT.current)
      velocity.current = (e.clientX - lastClientX.current) / dt
      lastClientX.current = e.clientX
      lastT.current = now
      setTrackX(startX.current + dx, true)
    },
    [setTrackX],
  )

  const endDrag = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerId !== pointerId.current) return
      const viewport = viewportRef.current
      if (viewport?.hasPointerCapture?.(e.pointerId)) {
        viewport.releasePointerCapture(e.pointerId)
      }
      pointerId.current = null
      dragging.current = false
      setIsDragging(false)

      const v = velocity.current
      const boost = Math.abs(v) > 0.15 ? v * 220 : 0
      const projected = xRef.current + boost
      tweenTo(projected)
    },
    [tweenTo],
  )

  useEffect(() => {
    if (!step) return
    const id = window.setInterval(() => {
      if (document.hidden) return
      if (dragging.current) return
      tweenTo(xRef.current - step)
    }, AUTO_ADVANCE_MS)
    return () => clearInterval(id)
  }, [step, tweenTo])

  useEffect(() => {
    const onResize = () => updateCardVisuals()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [updateCardVisuals])

  return (
    <div className="w-full">
      <div
        ref={viewportRef}
        className={`relative touch-pan-x overflow-hidden py-6 sm:py-10 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured menu dishes. Auto-advances every few seconds; drag to browse."
      >
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{ gap: GAP_PX, width: 'max-content' }}
        >
          {triple.map(({ uid, ...item }) => (
            <MenuItemCard
              key={uid}
              data-menu-card
              item={item}
              onAddToOrder={onAddToOrder}
              added={added[item.id]}
              className="shrink-0 origin-center will-change-transform"
              style={{
                width: dims.cell > 0 ? dims.cell : 'min(90vw, 280px)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
