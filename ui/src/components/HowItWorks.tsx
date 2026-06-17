import { Reveal } from './Reveal'

const steps = [
  { n: '1', title: 'Choose your meal or service', text: 'Browse daily plates, meal prep, catering, or custom trays.' },
  { n: '2', title: 'Place your order or request catering', text: 'Tell us quantities, dates, and any dietary notes.' },
  { n: '3', title: 'Pay securely', text: 'Card, PayPal, cash on pickup, or Zelle/Venmo for approved local orders.' },
  { n: '4', title: 'Pick up or receive local delivery', text: 'We confirm timing and keep you updated along the way.' },
  { n: '5', title: 'Enjoy fresh family-made food', text: 'Heat, serve, and savor—more time around the table.' },
]

/** How it works — simple funnel steps */
export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-t border-beige bg-beige/40 px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-accent/35 px-4 py-1 text-xs font-bold uppercase tracking-wider text-charcoal">
            Simple process
          </span>
          <h2 id="how-heading" className="mt-4 font-display text-3xl font-semibold text-charcoal sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-charcoal/75">Five quick steps from craving to comfort.</p>
        </Reveal>

        <ol className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
            <Reveal key={s.n} as="li" delayMs={i * 80} className="relative h-full">
              <div className="flex h-full flex-col rounded-2xl border border-beige bg-cream p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-white shadow-md">
                  {s.n}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-charcoal">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
