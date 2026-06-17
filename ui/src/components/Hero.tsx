import { Link } from 'react-router-dom'
import { useParallaxOffset } from '../hooks/useParallaxOffset'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=80'

/** Wide background for parallax (larger than card image for depth) */
const HERO_PARALLAX_BG =
  'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=2000&q=80'

/** Hero — first impression, parallax background, headline, CTAs, hero imagery */
export function Hero() {
  const { sectionRef, offsetY } = useParallaxOffset(0.32)

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative overflow-hidden bg-cream"
      aria-labelledby="hero-heading"
    >
      {/* Parallax background image (moves slower than scroll) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <img
          src={HERO_PARALLAX_BG}
          alt=""
          width={2000}
          height={1200}
          fetchPriority="high"
          className="absolute left-1/2 top-1/2 h-[120%] w-full min-w-full max-w-none object-cover object-center"
          style={{
            transform: `translate(-50%, calc(-50% + ${offsetY}px))`,
            willChange: 'transform',
          }}
        />
      </div>

      {/* Readability: warm cream wash + soft gradients over the photo */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-br from-cream/93 via-cream/80 to-beige/70" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,_rgba(244,180,0,0.12)_0%,_transparent_55%)]" />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-full max-w-xl bg-gradient-to-r from-charcoal/55 via-charcoal/30 to-transparent sm:max-w-2xl lg:max-w-[calc(50%+2rem)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-24">
        <div className="relative max-w-xl">
          <p className="animate-hero-title mb-4 inline-flex items-center gap-2 rounded-full border border-white/40 bg-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md backdrop-blur-sm sm:text-sm">
            <span className="h-2 w-2 shrink-0 rounded-full bg-accent shadow-[0_0_0_2px_rgba(255,255,255,0.35)]" aria-hidden />
            Family-owned · Local · Fresh daily
          </p>
          <h1
            id="hero-heading"
            className="animate-hero-title font-display text-4xl font-semibold leading-[1.12] text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.55),0_4px_28px_rgba(0,0,0,0.35)] sm:text-5xl lg:text-[3.25rem] xl:text-6xl"
          >
            Fresh Homemade Meals, Made with Family Love
          </h1>
          <p className="animate-hero-sub mt-5 text-lg leading-relaxed text-cream/95 [text-shadow:0_1px_3px_rgba(0,0,0,0.65),0_2px_16px_rgba(0,0,0,0.35)] sm:text-xl">
            A family-owned food business serving delicious daily meals, catering, and weekly meal prep
            for our local community.
          </p>
          <div className="animate-hero-cta mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/order"
              className="inline-flex min-h-[48px] min-w-[160px] items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-primary-hover hover:shadow-xl"
            >
              Order Now
            </Link>
            <Link
              to="/catering"
              className="inline-flex min-h-[48px] min-w-[180px] items-center justify-center rounded-xl border-2 border-white/90 bg-white/95 px-8 py-3.5 text-base font-semibold text-primary shadow-lg backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-xl"
            >
              Request Catering
            </Link>
          </div>
          <p className="mt-6 text-sm italic text-cream/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">
            “Homemade meals, fresh ingredients, and family love in every bite.”
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="animate-hero-image relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-charcoal/10 sm:aspect-[5/6] lg:aspect-square">
            <img
              src={HERO_IMAGE}
              alt="Beautifully plated homemade meal with fresh herbs and vegetables on a rustic wooden table"
              className="h-full w-full object-cover"
              width={800}
              height={800}
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/35 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-6">
              <p className="font-display text-lg font-semibold text-charcoal">Rotating weekly menu</p>
              <p className="mt-1 text-sm text-charcoal/70">
                Individual & family portions · Pickup & local delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
