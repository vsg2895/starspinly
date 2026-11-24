import Image from 'next/image'
import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import { COPY } from '@/constants/copy'
import type { CasinoWithAttachment } from '@shared/types/casino'

/** How many region chips a card shows before collapsing the rest into a count. */
const REGIONS_SHOWN = 3

/**
 * Exported so the home page's picks list shows the same stars as a card.
 *
 * GOLD, the brand value itself — #FFD86B is 11.93:1 on the card ground, so a
 * filled star and an empty one are never in doubt. This is the first site in
 * the network where the mockup's own star colour needed no raising: a dark
 * ground gives it room every light sibling had to take away.
 */
export function Stars({ rating, onDark = false }: { rating: number; onDark?: boolean }) {
  // `Math.round` rather than a partial star: the ratings are whole or half
  // numbers and a half-filled glyph at 15px reads as a rendering fault.
  const filled = Math.round(rating)
  const on = onDark ? 'text-night-accent' : 'text-gold'
  const off = onDark ? 'text-line-2' : 'text-line-2'

  return (
    <span
      className="inline-flex items-center tracking-[2px] text-[15px] leading-none"
      role="img"
      aria-label={`${rating} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < filled ? on : off} aria-hidden>
          ★
        </span>
      ))}
    </span>
  )
}

/**
 * The grid the cards sit in — the mockup's `.list`: TWO across on a wide
 * screen, one below 680px. Callers render `<ol className={CASINO_LIST}>`; the
 * order of the list is the ranking.
 *
 * `casino-list` is what drives the three-tone cycle on the orbits' satellites
 * (globals.css). It is on the LIST rather than inside the card because
 * `:nth-child` can only be written where the siblings are.
 */
export const CASINO_LIST = 'casino-list grid grid-cols-1 gap-5 min-[56.25rem]:grid-cols-2'

/**
 * A casino as an OBSERVATORY PLATE — `.cc` in sites/starspinly.html: a panel
 * opening on the logo held inside a dashed ORBIT with one lit satellite, the
 * name and score beside it, a ghost rank numeral at the right, then the
 * welcome bonus in its own well and the regions under it.
 *
 * The orbit is the device that makes this a chart rather than a listing: the
 * satellite's colour AND position both shift across the grid, so no two
 * neighbouring plates look alike and the page reads as a set of different
 * observations rather than a repeated template. See `.orbit` in globals.css.
 *
 * `rank` decides the "Brightest pick" badge and fills the ghost numeral gold.
 * The numeral is `aria-hidden` and always will be: the list order already IS
 * the ranking, and a screen reader hearing "zero one" before every name learns
 * nothing it did not already have from the list.
 *
 * The mockup's `.facts` row prints MIN. DEPOSIT, PAYOUT and AVAILABLE. The
 * first two are not shipped — no column in the API holds either, and a payout
 * time is the one figure this site has promised not to invent. The third is
 * real, so the regions stay and take the whole row.
 */
export default function CasinoCard({
  casino,
  rank,
}: {
  casino: CasinoWithAttachment
  rank?: number
}) {
  // The casino's "Image" (logo), NOT the wide "Banner Image" used big on the
  // casino page. Falls back to the banner if there is no Image.
  const image = resolveImageUrl(casino.image_path ?? casino.banner_image)

  const regions = casino.countries ?? []
  const shownRegions = regions.slice(0, REGIONS_SHOWN)
  const extraRegions = regions.length - shownRegions.length
  const isLeader = rank === 1

  return (
    <li className={`rw flex flex-col overflow-hidden rounded-[28px] ${isLeader ? 'rw-top' : ''}`}>
      <div className="flex items-center gap-4 px-5 pb-5 pt-6 sm:gap-5 sm:px-6">
        {/* The orbit. A FIXED size at every breakpoint, never `auto`: operator
            artwork ranges from square to wide banner, and an auto box sizes
            itself to whichever it happens to get. */}
        <div className="orbit grid h-[86px] w-[86px] flex-none place-items-center sm:h-[104px] sm:w-[104px]">
          {/* The plate. WHITE because operator logos arrive with their own
              white ground baked into the file — see `.clogo`. */}
          <span className="clogo grid h-16 w-16 place-items-center overflow-hidden rounded-full p-2 text-center sm:h-[78px] sm:w-[78px] sm:p-2.5">
            {image ? (
              <Image src={image} alt={`${casino.name} logo`} width={220} height={220} sizes="78px" className="max-h-[50px] w-full object-contain" />
            ) : (
              <span className="font-display text-[11px] font-extrabold leading-[1.05] text-cream [overflow-wrap:anywhere] sm:text-[12.5px]">{casino.name}</span>
            )}
          </span>
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          {isLeader && (
            <span className="font-mono self-start rounded-full bg-brand px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-brand-ink">
              {COPY.casinos.topPick}
            </span>
          )}
          <h3 className="font-display text-[21px] text-ink [overflow-wrap:anywhere] sm:text-[clamp(22px,2.4vw,27px)]">{casino.name}</h3>
          <p className="flex items-center gap-2.5">
            <Stars rating={casino.rating} />
            <span aria-hidden className="font-mono text-[14px] font-bold text-ink tabular-nums">{casino.rating.toFixed(1)}</span>
          </p>
        </div>

        {/* The ghost numeral, hidden below `lg` exactly as the mockup hides it:
            at that width the row has already given its third column up to keep
            the name readable. */}
        {rank !== undefined && (
          <span aria-hidden className="rank font-display ml-auto hidden self-start text-[44px] font-extrabold leading-[0.9] lg:block">
            {String(rank).padStart(2, '0')}
          </span>
        )}
      </div>

      {/* The welcome bonus in its own well, led by the site's star mark.
          Dropped entirely when the operator has none, rather than left as an
          empty box. */}
      {casino.bonuses && (
        <div className="mx-5 flex items-center gap-3.5 rounded-[18px] border border-line bg-surface px-[18px] py-4 sm:mx-6">
          <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true" focusable="false" className="shrink-0">
            <circle cx="17" cy="17" r="16" fill="none" stroke="var(--color-line-2)" />
            <path d="M17 8c.9 4.6 3.4 7.1 8 8-4.6.9-7.1 3.4-8 8-.9-4.6-3.4-7.1-8-8 4.6-.9 7.1-3.4 8-8z" fill="var(--color-brand)" />
          </svg>
          <span className="min-w-0">
            <small className="font-mono mb-[3px] block text-[11px] uppercase tracking-[0.12em] text-accent">Welcome bonus</small>
            <b className="block text-[16.5px] font-bold leading-[1.3] text-ink [overflow-wrap:anywhere] sm:text-[18px]">{casino.bonuses}</b>
          </span>
        </div>
      )}

      {shownRegions.length > 0 && (
        <div className="mt-[18px] px-5 sm:px-6">
          <p className="font-mono mb-2 text-[10.5px] uppercase tracking-[0.1em] text-muted">Available</p>
          <ul className="flex flex-wrap gap-1.5" aria-label="Accepts players from">
            {shownRegions.map((country) => (
              <li key={country.id} className="rounded-full bg-win-bg px-2.5 py-1 text-[12.5px] font-semibold text-win">
                {country.name}
              </li>
            ))}
            {extraRegions > 0 && (
              /* A count, not a tooltip: the full list is on the review page,
                 and a hover affordance is invisible on a phone. */
              <li className="rounded-full border border-line px-2.5 py-1 text-[12.5px] font-semibold text-muted">+{extraRegions} more</li>
            )}
          </ul>
        </div>
      )}

      {/* The actions. `mt-auto` ends every card in a row on its buttons, but it
          is NOT the gap above them — it is whatever slack the card has left,
          which is zero on the tallest card in the row. The `pt-6` is the
          floor, and `mt-auto` only ever adds to it. */}
      <div className="mt-auto flex flex-col gap-2.5 px-5 pb-6 pt-6 min-[26rem]:flex-row min-[26rem]:items-center sm:px-6">
        <a
          href={casino.attachment.affiliate_url}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="btn-or min-h-[46px] flex-1 px-5 text-[15px]"
        >
          {COPY.casinos.visitCasino}
        </a>
        <Link href={`/casinos/${casino.slug}`} className="inline-flex min-h-11 items-center justify-center whitespace-nowrap px-2.5 text-[14.5px] font-semibold text-brand transition-colors hover:text-brand-dark">
          {COPY.casinos.readReview} <span aria-hidden className="ml-1">→</span>
        </Link>
      </div>
    </li>
  )
}
