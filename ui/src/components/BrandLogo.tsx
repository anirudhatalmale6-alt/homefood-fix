import { Link } from 'react-router-dom'

type BrandLogoProps = {
  /** Header (cream) vs footer (dark) text colors */
  variant?: 'header' | 'footer'
  onNavigate?: () => void
  /** Set false if `logo.png` already includes the wordmark (avoids duplicate “homefood”). */
  showWordmark?: boolean
}

/** Header: `public/logo.png` · Footer: `public/logo-big.png` + optional wordmark */
export function BrandLogo({
  variant = 'header',
  onNavigate,
  showWordmark = true,
}: BrandLogoProps) {
  const isFooter = variant === 'footer'
  const logoSrc = isFooter ? '/logo-big.png' : '/logo.png'

  return (
    <Link
      to="/"
      onClick={onNavigate}
      className="group flex shrink-0 items-center gap-2.5 sm:gap-3"
      aria-label="homefood — home"
    >
      <img
        src={logoSrc}
        alt=""
        width={isFooter ? 220 : 160}
        height={isFooter ? 64 : 48}
        className={`w-auto object-contain object-left ${
          isFooter
            ? `h-11 sm:h-12 ${showWordmark ? 'max-w-[min(100%,20rem)] sm:max-w-[24rem]' : 'max-w-[min(100%,24rem)]'}`
            : `h-9 sm:h-10 ${showWordmark ? 'max-w-[min(100%,14rem)]' : 'max-w-[min(100%,18rem)]'}`
        }`}
      />
      {showWordmark ? (
        <span
          className={`font-display text-lg font-semibold tracking-tight sm:text-xl ${
            variant === 'footer'
              ? 'text-white'
              : 'text-charcoal transition-colors group-hover:text-primary'
          }`}
        >
          homefood
        </span>
      ) : null}
    </Link>
  )
}
