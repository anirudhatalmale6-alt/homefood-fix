import { Link } from 'react-router-dom'
import { BrandLogo } from './BrandLogo'

/** Footer — links, payments, legal */
export function Footer() {
  return (
    <footer className="border-t border-beige bg-charcoal text-cream">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <BrandLogo variant="footer" />
            <p className="mt-4 text-sm leading-relaxed text-cream/75">
              Homemade meals, fresh ingredients, and family love in every bite. Local pickup &amp; delivery.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-accent">Quick links</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link className="text-cream/80 transition hover:text-white" to="/#about">
                  About
                </Link>
              </li>
              <li>
                <Link className="text-cream/80 transition hover:text-white" to="/services">
                  Services
                </Link>
              </li>
              <li>
                <Link className="text-cream/80 transition hover:text-white" to="/menu">
                  Menu
                </Link>
              </li>
              <li>
                <Link className="text-cream/80 transition hover:text-white" to="/order">
                  Order
                </Link>
              </li>
              <li>
                <Link className="text-cream/80 transition hover:text-white" to="/catering">
                  Catering
                </Link>
              </li>
              <li>
                <Link className="text-cream/80 transition hover:text-white" to="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-accent">Services</p>
            <ul className="mt-4 space-y-2 text-sm text-cream/80">
              <li>Daily homemade meals</li>
              <li>Event &amp; office catering</li>
              <li>Weekly meal prep</li>
              <li>Custom orders &amp; trays</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-accent">Contact</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a className="text-cream/80 hover:text-white" href="tel:+15551234567">
                  (555) 123-4567
                </a>
              </li>
              <li>
                <a className="text-cream/80 hover:text-white" href="mailto:hello@homefood.com">
                  hello@homefood.com
                </a>
              </li>
              <li className="text-cream/70">123 Homestead Lane, Metroville, ST</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-cream/60">We accept</p>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6" aria-label="Payment methods">
            <li>
              <span className="payment-badge inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition duration-200 hover:scale-105">
                <svg className="h-6 w-9" viewBox="0 0 36 24" fill="none" aria-hidden>
                  <rect width="36" height="24" rx="4" fill="#1A1F71" />
                  <path d="M15 17l2-10h3l-2 10h-3zm8.5-10l-.3 1.8-.2 1.1s-.5-.6-1.3-.6c-1.2 0-2 .7-2 1.6 0 .9.8 1.3 1.4 1.6.6.3 1 .5 1 .9 0 .5-.6.7-1.1.7-.8 0-1.2-.2-1.8-.6l-.3 2c.5.2 1.3.4 2.1.4 2.2 0 3.6-1.1 3.6-2.7 0-1.8-2.5-1.9-2.5-2.7 0-.3.3-.5.9-.5.5 0 1 .2 1.2.3l.2-1.3z" fill="#F9A533" />
                </svg>
                Credit card
              </span>
            </li>
            <li>
              <span className="payment-badge inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition duration-200 hover:scale-105">
                <svg className="h-6 w-9" viewBox="0 0 36 24" fill="none" aria-hidden>
                  <rect width="36" height="24" rx="4" fill="#1434CB" />
                  <rect x="14" y="7" width="8" height="10" rx="1" fill="#F7B600" />
                </svg>
                Debit card
              </span>
            </li>
            <li>
              <span className="payment-badge inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition duration-200 hover:scale-105">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#0070BA" aria-hidden>
                  <path d="M7.076 21.337H2.47a.641.641 0 01-.57-.988L12.43.652a.641.641 0 011.14 0l10.53 19.697a.641.641 0 01-.57.988h-4.605a.641.641 0 01-.59-.388L12 5.711 7.666 20.95a.641.641 0 01-.59.388z" />
                </svg>
                PayPal
              </span>
            </li>
            <li>
              <span className="payment-badge inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition duration-200 hover:scale-105">
                Cash on pickup
              </span>
            </li>
            <li>
              <span className="payment-badge inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition duration-200 hover:scale-105">
                Zelle / Venmo
              </span>
            </li>
          </ul>
          <p className="mt-3 text-center text-xs text-cream/55">
            Zelle and Venmo available for approved local orders—ask when you check out.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-cream/55 sm:flex-row">
          <p>© {new Date().getFullYear()} homefood. All rights reserved.</p>
          <p className="text-cream/45">Crafted with React &amp; Tailwind CSS</p>
        </div>
      </div>
    </footer>
  )
}
