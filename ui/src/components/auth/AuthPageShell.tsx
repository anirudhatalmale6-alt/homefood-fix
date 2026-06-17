import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

type AuthPageShellProps = {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthPageShell({ title, subtitle, children, footer }: AuthPageShellProps) {
  return (
    <div className="min-h-svh bg-cream px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto w-full max-w-md">
        <p className="text-center font-display text-xl font-semibold text-primary sm:text-2xl">
          <Link to="/" className="transition hover:text-primary-hover">
            homefood
          </Link>
        </p>
        <div className="mt-8 rounded-3xl border border-beige bg-white p-6 shadow-xl sm:p-8">
          <h1 className="font-display text-2xl font-semibold text-charcoal">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm text-charcoal/70">{subtitle}</p> : null}
          <div className="mt-6">{children}</div>
        </div>
        {footer ? <div className="mt-6 text-center text-sm text-charcoal/70">{footer}</div> : null}
      </div>
    </div>
  )
}
