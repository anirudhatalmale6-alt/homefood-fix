import { Reveal } from './Reveal'

const reviews = [
  {
    quote:
      'We ordered the family salmon tray for a Sunday dinner—everything arrived hot, labeled, and honestly better than most restaurants nearby. Instant repeat customers.',
    name: 'Danielle M.',
    role: 'Local parent · 3 kids',
  },
  {
    quote:
      'Our office of fourteen does Wednesday lunch with homefood. Portions are consistent, vegetarian options are thoughtful, and invoicing is painless.',
    name: 'Marcus T.',
    role: 'Operations lead · downtown office',
  },
  {
    quote:
      'They catered our daughter’s birthday in the church hall. Setup was tidy, the food looked beautiful, and guests kept asking who made the pulled pork.',
    name: 'Elena R.',
    role: 'Birthday & community event',
  },
]

/** Testimonials — social proof */
export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="border-t border-beige bg-cream px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="reviews-heading"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-basil/15 px-4 py-1 text-xs font-bold uppercase tracking-wider text-basil">
            Customer love
          </span>
          <h2 id="reviews-heading" className="mt-4 font-display text-3xl font-semibold text-charcoal sm:text-4xl">
            Kind words from neighbors like you
          </h2>
        </Reveal>

        <ul className="mt-14 grid gap-6 lg:grid-cols-3">
          {reviews.map((t, i) => (
            <Reveal key={t.name} as="li" delayMs={i * 100}>
              <figure className="flex h-full flex-col rounded-2xl border border-beige bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/15 hover:shadow-lg">
                <div className="flex gap-1 text-accent" aria-hidden>
                  {Array.from({ length: 5 }).map((_, si) => (
                    <svg key={si} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-4 flex-1">
                  <p className="text-charcoal/85 leading-relaxed">“{t.quote}”</p>
                </blockquote>
                <figcaption className="mt-6 border-t border-beige pt-4">
                  <cite className="not-italic font-semibold text-charcoal">{t.name}</cite>
                  <p className="text-sm text-charcoal/60">{t.role}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
