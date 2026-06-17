import { Reveal } from './Reveal'

/** About — family story and trust */
export function About() {
  return (
    <section
      id="about"
      className="border-t border-beige bg-cream px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal as="div" className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-block rounded-full bg-accent/20 px-4 py-1 text-xs font-bold uppercase tracking-wider text-charcoal">
              Our story
            </span>
            <h2
              id="about-heading"
              className="mt-4 font-display text-3xl font-semibold text-charcoal sm:text-4xl"
            >
              A kitchen built on family, flavor, and community
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/80">
              homefood started around our own dinner table—U.S. citizens with talented family
              cooks who believe everyone deserves a wholesome, homemade-style meal without the stress of
              shopping, chopping, and cleanup.
            </p>
            <p className="mt-4 leading-relaxed text-charcoal/80">
              We prepare food in small batches using fresh ingredients and time-tested family recipes. From
              busy weeknights to office lunches and celebrations, we cook with the same care we serve our
              loved ones—clean preparation, consistent taste, and friendly service you can count on.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -left-4 -top-4 h-24 w-24 rounded-3xl bg-accent/30 blur-2xl" aria-hidden />
            <div className="relative overflow-hidden rounded-3xl border border-beige bg-beige/50 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80"
                alt="Family cooking together in a bright home kitchen with fresh vegetables on the counter"
                className="aspect-[4/3] w-full object-cover"
                width={900}
                height={675}
                loading="lazy"
              />
            </div>
            <blockquote className="mt-6 rounded-2xl border border-beige bg-white p-6 shadow-md">
              <p className="font-display text-lg text-charcoal">
                “We are not a faceless chain—we are your neighbors, feeding your neighborhood.”
              </p>
              <footer className="mt-3 text-sm font-medium text-primary">— The homefood family team</footer>
            </blockquote>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
