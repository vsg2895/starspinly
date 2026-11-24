import Link from 'next/link'

/**
 * StarSpinly brand mark, from sites/starspinly.html: a four-pointed STAR
 * inside a ringed dial, with the cardinal ticks lit gold, the diagonals left
 * dim, and a small comet-orange spark breaking the circle at the top right.
 * A sextant and a star chart at once, which is the name.
 *
 * Inlined SVG rather than an image: it renders instantly with no extra request
 * and stays crisp at any size. The artwork is aria-hidden; the Link's name is
 * its visible text.
 *
 * THE WORDMARK IS THE SAME ON BOTH GROUNDS, which is unusual for this network
 * — every light sibling has to swap a colour for the footer. Here the footer
 * is one step off the same dark page rather than an inversion of it, so gold
 * is 13.98:1 on one and 12.81:1 on the other and nothing needs to change. The
 * `onDark` prop is kept because the shared layout passes it and because the
 * focus ring's offset colour still differs.
 *
 * The `.com` is the mockup's own `<i>`: a mono tail at 12px in the muted
 * periwinkle, which is what makes the wordmark read as a plotted label rather
 * than a logo. It is inside the link's text, so the accessible name is
 * "starspinly.com home" — which is what it is.
 *
 * `taglineClassName` lets a caller hide the tagline where the header runs out
 * of room, rather than shipping a second, shorter logo.
 */
export default function Logo({
  className = '',
  taglineClassName = '',
  onDark = false,
}: {
  className?: string
  taglineClassName?: string
  onDark?: boolean
}) {
  return (
    <Link
      href="/"
      className={`inline-flex min-h-11 shrink-0 items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
        onDark ? 'focus-visible:ring-offset-navy' : 'focus-visible:ring-offset-cream'
      } ${className}`.trim()}
    >
      <svg viewBox="0 0 48 48" className="h-11 w-11 shrink-0 sm:h-[46px] sm:w-[46px]" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
        {/* The dial. */}
        <circle cx="24" cy="24" r="22" fill="#171c42" stroke="#ffd86b" strokeWidth="1.5" />
        {/* Cardinal ticks, lit. */}
        <g stroke="#ffd86b" strokeWidth="3" strokeLinecap="round" opacity="0.9">
          <path d="M24 6.5v2.5M24 39v2.5M6.5 24H9M39 24h2.5" />
        </g>
        {/* Diagonal ticks, dim — the mockup's own hierarchy: four lit, four not. */}
        <g stroke="#3a4385" strokeWidth="2.5" strokeLinecap="round">
          <path d="M11.6 11.6l1.8 1.8M34.6 34.6l1.8 1.8M11.6 36.4l1.8-1.8M34.6 13.4l1.8-1.8" />
        </g>
        {/* The star, and the hole punched through its centre. */}
        <path d="M24 12.5c1.2 6.6 4.9 10.3 11.5 11.5-6.6 1.2-10.3 4.9-11.5 11.5-1.2-6.6-4.9-10.3-11.5-11.5 6.6-1.2 10.3-4.9 11.5-11.5z" fill="#ffd86b" />
        <circle cx="24" cy="24" r="2.2" fill="#0a0d22" />
        {/* The spark, breaking the dial at the top right. */}
        <path d="M36 6.5c.4 2.2 1.5 3.3 3.7 3.7-2.2.4-3.3 1.5-3.7 3.7-.4-2.2-1.5-3.3-3.7-3.7 2.2-.4 3.3-1.5 3.7-3.7z" fill="#ff6b3d" />
      </svg>

      <span className="flex flex-col leading-none">
        <span className="font-display text-[20px] font-extrabold tracking-[-0.03em] text-ink sm:text-[22px]">
          star<span className="text-brand">spinly</span>
          <i className="font-mono ml-[3px] text-[12px] font-medium not-italic tracking-normal text-muted">.com</i>
        </span>
        <span className={`font-mono mt-[6px] text-[11px] uppercase tracking-[0.1em] text-muted ${taglineClassName}`.trim()}>
          Casinos charted
        </span>
        {/* The link's name is its visible text plus this — no aria-label that
            could disagree with what is on screen. */}
        <span className="sr-only"> home</span>
      </span>
    </Link>
  )
}
