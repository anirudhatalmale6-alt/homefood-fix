import { type FormEvent, useState } from 'react'
import { Reveal } from './Reveal'

const inputClass =
  'mt-1 w-full rounded-xl border border-beige bg-white px-4 py-3 text-charcoal shadow-sm outline-none transition duration-200 focus:border-primary focus:ring-2 focus:ring-primary/25'
const labelClass = 'block text-sm font-semibold text-charcoal'

/** Contact — forms, hours, service area */
export function Contact() {
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
    }, 1100)
  }

  return (
    <section
      id="contact"
      className="border-t border-beige bg-beige/35 px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            Get in touch
          </span>
          <h2 id="contact-heading" className="mt-4 font-display text-3xl font-semibold text-charcoal sm:text-4xl">
            Let’s plan your next meal
          </h2>
          <p className="mt-4 text-lg text-charcoal/75">
            Orders, questions, or weekly meal prep—we’re happy to help your household or team eat well.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-5 lg:gap-12">
          <Reveal className="lg:col-span-2" delayMs={60}>
            <div className="rounded-3xl border border-beige bg-cream p-6 shadow-lg sm:p-8">
              <h3 className="font-display text-xl font-semibold text-charcoal">Visit &amp; hours</h3>
              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="font-bold text-charcoal">Phone</dt>
                  <dd>
                    <a className="text-primary hover:underline" href="tel:+15551234567">
                      (555) 123-4567
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-bold text-charcoal">Email</dt>
                  <dd>
                    <a className="text-primary hover:underline" href="mailto:hello@homefood.com">
                      hello@homefood.com
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-bold text-charcoal">Service area</dt>
                  <dd className="text-charcoal/75">
                    Greater Metroville &amp; neighboring towns within ~15 miles. Exact boundaries confirmed at
                    order.
                  </dd>
                </div>
                <div>
                  <dt className="font-bold text-charcoal">Kitchen pickup</dt>
                  <dd className="text-charcoal/75">123 Homestead Lane, Suite 100 · Metroville, ST 00000</dd>
                </div>
                <div>
                  <dt className="font-bold text-charcoal">Hours</dt>
                  <dd className="text-charcoal/75">
                    Tue–Sat: 11am–8pm
                    <br />
                    Sun–Mon: Catering &amp; meal prep by appointment
                  </dd>
                </div>
              </dl>

              <div className="mt-8">
                <p className="text-sm font-semibold text-charcoal">Follow along</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-beige bg-white px-4 py-2 text-sm font-medium text-charcoal transition hover:border-primary/30 hover:text-primary"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-beige bg-white px-4 py-2 text-sm font-medium text-charcoal transition hover:border-primary/30 hover:text-primary"
                  >
                    Facebook
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-3" delayMs={120}>
            <div className="rounded-3xl border border-beige bg-white p-6 shadow-xl sm:p-8">
              <h3 className="font-display text-xl font-semibold text-charcoal">Send a message</h3>
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="co-name">
                      Name
                    </label>
                    <input id="co-name" name="name" type="text" required className={inputClass} autoComplete="name" />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="co-email">
                      Email
                    </label>
                    <input
                      id="co-email"
                      name="email"
                      type="email"
                      required
                      className={inputClass}
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="co-phone">
                    Phone <span className="font-normal text-charcoal/50">(optional)</span>
                  </label>
                  <input id="co-phone" name="phone" type="tel" className={inputClass} autoComplete="tel" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="co-topic">
                    I’m interested in
                  </label>
                  <select id="co-topic" name="topic" className={inputClass} defaultValue="order">
                    <option value="order">Placing an order</option>
                    <option value="meal-prep">Weekly meal prep</option>
                    <option value="delivery">Delivery area / timing</option>
                    <option value="other">Something else</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="co-msg">
                    Message
                  </label>
                  <textarea
                    id="co-msg"
                    name="message"
                    required
                    rows={4}
                    className={`${inputClass} resize-y min-h-[120px]`}
                    placeholder="What are you craving? Dates? Portions?"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full min-h-[48px] items-center justify-center rounded-xl bg-primary px-6 py-3.5 font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-lg disabled:pointer-events-none disabled:opacity-70"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending…
                    </span>
                  ) : (
                    'Send message'
                  )}
                </button>
                <p
                  role="status"
                  aria-live="polite"
                  className={`text-center text-sm font-semibold text-basil transition-all duration-500 ${
                    success ? 'opacity-100' : 'pointer-events-none h-0 overflow-hidden opacity-0'
                  }`}
                >
                  Message sent! We’ll get back to you soon.
                </p>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
