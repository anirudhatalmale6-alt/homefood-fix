import type { ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Stagger delay in ms for card grids */
  delayMs?: number
  as?: 'div' | 'section' | 'article' | 'li'
}

/**
 * Scroll-triggered fade + slight upward motion.
 * Adds `is-visible` when the element intersects the viewport.
 */
export function Reveal({
  children,
  className = '',
  delayMs = 0,
  as: Tag = 'div',
}: RevealProps) {
  const { ref, visible } = useInView()

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: visible ? `${delayMs}ms` : '0ms' }}
    >
      {children}
    </Tag>
  )
}
