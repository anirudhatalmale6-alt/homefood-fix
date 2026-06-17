import { Reveal } from './Reveal'

const reasons = [
  { title: 'Fresh ingredients', text: 'Produce and proteins selected for peak flavor—never an afterthought.' },
  { title: 'Family recipes', text: 'Seasoned cooks and dishes that taste like home, not a commissary line.' },
  { title: 'Clean preparation', text: 'Organized kitchen practices you can feel good serving to your crew.' },
  { title: 'Affordable pricing', text: 'Honest portions and fair pricing for families, students, and teams.' },
  { title: 'Friendly service', text: 'Warm communication from order to pickup or delivery.' },
  { title: 'Reliable pickup & delivery', text: 'Clear windows and updates so you’re never guessing.' },
  { title: 'Custom orders', text: 'Cultural favorites, party trays, and special requests when we can swing it.' },
]

/** Why choose us — trust bullets */
export function WhyChooseUs() {
  return (
    <section
      id="why-us"
      className="border-t border-beige bg-cream px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="why-heading"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            Why homefood
          </span>
          <h2 id="why-heading" className="mt-4 font-display text-3xl font-semibold text-charcoal sm:text-4xl">
            The details that make every bite trustworthy
          </h2>
        </Reveal>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <Reveal key={r.title} as="li" delayMs={i * 70}>
              <article className="group h-full rounded-2xl border border-beige bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/25 text-primary transition-transform duration-300 group-hover:scale-105">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="font-display text-lg font-semibold text-charcoal">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{r.text}</p>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
