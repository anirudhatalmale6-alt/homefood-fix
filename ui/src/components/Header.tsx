import { useId, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { BrandLogo } from './BrandLogo'
import { ThemeToggle } from './ThemeToggle'
import { useScrollNav } from '../hooks/useScrollNav'
import { useAuth } from '../auth/AuthContext'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/menu', label: 'Menu' },
  { to: '/order', label: 'Order' },
  { to: '/catering', label: 'Catering' },
  { to: '/contact', label: 'Contact' },
]

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `nav-link rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'text-primary' : ''}`

export function Header() {
  const scrolled = useScrollNav(16)
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const { user, ready, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'border-beige/80 bg-cream/95 py-2 shadow-md backdrop-blur-md'
          : 'border-transparent bg-cream/90 py-3 shadow-none backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:gap-4 lg:px-8">
        <div className="flex min-w-0 flex-col gap-0.5">
          <BrandLogo onNavigate={() => setOpen(false)} />
          <span className="hidden text-xs font-medium text-charcoal/60 sm:block">
            Homemade meals · Fresh · Local
          </span>
        </div>

        <nav className="hidden flex-1 justify-center gap-0.5 lg:flex xl:gap-1" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass} onClick={() => setOpen(false)}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 sm:gap-3 lg:flex">
          <ThemeToggle />
          {ready && user ? (
            <>
              <span className="max-w-[8rem] truncate text-sm text-charcoal/80 xl:max-w-[10rem]" title={user.email}>
                Hi, {user.name.split(' ')[0]}
              </span>
              <button
                type="button"
                className="rounded-xl border border-beige px-3 py-2 text-sm font-semibold text-charcoal transition hover:border-primary/40"
                onClick={async () => {
                  await logout()
                  navigate('/')
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-charcoal transition hover:text-primary"
            >
              Sign in
            </Link>
          )}
          <Link
            to="/order"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-lg"
          >
            Order now
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-beige bg-white/80 text-charcoal shadow-sm transition hover:border-primary/40 hover:text-primary lg:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          {open ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      <div
        id={menuId}
        className={`lg:hidden ${open ? 'pointer-events-auto max-h-[85vh] opacity-100' : 'pointer-events-none max-h-0 opacity-0'} overflow-hidden border-t border-beige bg-cream transition-all duration-300 ease-out`}
      >
        <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-3 text-base font-medium ${isActive ? 'bg-beige text-primary' : 'text-charcoal hover:bg-beige'}`
              }
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-beige pt-4">
            <ThemeToggle className="w-full justify-center" />
            {ready && user ? (
              <>
                <p className="px-3 text-sm text-charcoal/70">{user.email}</p>
                <button
                  type="button"
                  className="rounded-xl border border-beige py-3 text-center font-semibold text-charcoal"
                  onClick={async () => {
                    setOpen(false)
                    await logout()
                    navigate('/')
                  }}
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-xl border border-beige py-3 text-center font-semibold text-charcoal"
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
            )}
            <Link
              to="/register"
              className="text-center text-sm font-medium text-primary hover:underline"
              onClick={() => setOpen(false)}
            >
              Create an account
            </Link>
            <Link
              to="/order"
              className="rounded-xl bg-primary py-3 text-center font-semibold text-white shadow-md"
              onClick={() => setOpen(false)}
            >
              Order now
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
