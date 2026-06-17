import { type FormEvent, useState } from 'react'
import { Reveal } from './Reveal'

const inputClass =
  'mt-1 w-full rounded-xl border border-beige bg-white px-4 py-3 text-charcoal shadow-sm outline-none transition duration-200 focus:border-primary focus:ring-2 focus:ring-primary/25'
const labelClass = 'block text-sm font-semibold text-charcoal'

/** Catering — copy + request form */
export function CateringSection() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    window.setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      ;(e.target as HTMLFormElement).reset()
    }, 1200)
  }

  return (
    <section
      id="catering"
      className="border-t border-beige bg-beige/35 px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="catering-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <span className="inline-block rounded-full bg-accent/30 px-4 py-1 text-xs font-bold uppercase tracking-wider text-charcoal">
              Events & offices
            </span>
            <h2
              id="catering-heading"
              className="mt-4 font-display text-3xl font-semibold text-charcoal sm:text-4xl"
            >
              Catering that feels personal—not prefab
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/80">
              From office lunches to birthdays, church gatherings, and cozy family parties, we build menus
              around your headcount, dietary notes, and the vibe you want. Tell us the date, the crowd, and
              what you love—we’ll follow up with options and a clear quote.
            </p>
            <ul className="mt-8 space-y-3 text-charcoal/80">
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
                Small-event friendly portions and trays
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
                Office-ready packaging and labeling
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
                Flexible pickup or coordinated delivery windows
              </li>
            </ul>
          </Reveal>

          <Reveal delayMs={120}>
            <div className="rounded-3xl border border-beige bg-cream p-6 shadow-xl sm:p-8">
              <h3 className="font-display text-xl font-semibold text-charcoal">Catering request</h3>
              <p className="mt-1 text-sm text-charcoal/65">We typically reply within one business day.</p>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
                <div>
                  <label className={labelClass} htmlFor="cat-name">
                    Name
                  </label>
                  <input id="cat-name" name="name" type="text" required className={inputClass} autoComplete="name" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="cat-phone">
                      Phone
                    </label>
                    <input
                      id="cat-phone"
                      name="phone"
                      type="tel"
                      required
                      className={inputClass}
                      autoComplete="tel"
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="cat-email">
                      Email
                    </label>
                    <input
                      id="cat-email"
                      name="email"
                      type="email"
                      required
                      className={inputClass}
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="cat-date">
                      Event date
                    </label>
                    <input id="cat-date" name="eventDate" type="date" required className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="cat-guests">
                      Number of guests
                    </label>
                    <input
                      id="cat-guests"
                      name="guests"
                      type="number"
                      min={1}
                      required
                      className={inputClass}
                      placeholder="e.g. 25"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="cat-prefs">
                    Food preferences
                  </label>
                  <textarea
                    id="cat-prefs"
                    name="preferences"
                    rows={3}
                    className={`${inputClass} resize-y min-h-[96px]`}
                    placeholder="Cuisine style, dietary needs, must-haves…"
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="cat-msg">
                    Message
                  </label>
                  <textarea
                    id="cat-msg"
                    name="message"
                    rows={3}
                    className={`${inputClass} resize-y min-h-[96px]`}
                    placeholder="Venue, timing, budget range…"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full min-h-[48px] items-center justify-center rounded-xl bg-primary px-6 py-3.5 font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-lg disabled:pointer-events-none disabled:opacity-70"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <svg
                        className="h-5 w-5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending…
                    </span>
                  ) : (
                    'Submit catering request'
                  )}
                </button>

                <div
                  role="status"
                  aria-live="polite"
                  className={`rounded-xl border border-basil/30 bg-basil/10 px-4 py-3 text-sm font-medium text-charcoal transition-all duration-500 ${
                    success ? 'pointer-events-auto max-h-40 opacity-100' : 'pointer-events-none max-h-0 overflow-hidden opacity-0'
                  }`}
                >
                  Thank you! Your catering request was received. We’ll contact you shortly to confirm
                  details.
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
