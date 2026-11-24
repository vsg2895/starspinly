import Image from 'next/image'
import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import type { SpecialOffer } from '@shared/types/specialOffer'

/**
 * The bonus type whose cards carry a Claim button.
 *
 * WHY A TYPE AND NOT THE LINK. Claim used to appear on any offer that happened
 * to carry an affiliate URL, which made the card's primary action a property of
 * the data rather than an editorial decision: filing a bonus under "Free Spins"
 * or "Cashback" still produced a Claim button, because those offers have links
 * too. Claim now means one thing — this is a Special Offer — and whether the
 * offer has a link of its own no longer decides it.
 */
export const CLAIMABLE_BONUS_CATEGORY = 'special-offers'

/**
 * The grid offer cards sit in — the mockup's `.offers`:
 * `minmax(min(100%,330px),1fr)`.
 *
 * `offer-grid` is what drives the three-tone cycle on the patches
 * (globals.css). A CSS `:nth-child` cycle is right HERE and wrong on the bonus
 * types: a patch's colour is rhythm and carries no meaning, so repainting when
 * the set changes costs nothing.
 */
export const OFFER_GRID = 'offer-grid grid grid-cols-1 gap-[18px] sm:grid-cols-[repeat(auto-fill,minmax(min(100%,330px),1fr))]'

/** Up to two initials, for a casino with no logo artwork. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/**
 * An offer card for the listing grids — `.offer` in sites/starspinly.html: a
 * MISSION PATCH. A panel carrying a bordered disc with a dashed inner ring and
 * the bonus type set across it in mono capitals, like the crew badge on a
 * flight suit, with the operator and the amount beside it.
 *
 * The patch's three tones cycle by position — see OFFER_GRID. All three are
 * over 9:1 on the panel, so the type is readable in every one of them and the
 * colour is pure rhythm.
 *
 * THE TYPE IS THE PATCH, which is why the eyebrow above the amount carries the
 * OPERATOR rather than the type: printing the same words twice, once rotated
 * into a disc and once in a line beneath it, is the kind of duplication that
 * reads as a bug. The patch is `aria-hidden` and the type is given to a screen
 * reader once, in the body, where it is in reading order.
 *
 * `logo` is ACCEPTED AND UNUSED, on purpose. A casino page passes its own logo
 * down because the offers it lists arrive without their casino attached, and
 * every sibling's card paints that mark somewhere. This one does not: the
 * patch occupies the only round slot on the card, and the operator is named in
 * words above the amount instead. The prop stays in the signature so a caller
 * written against any site in the network still compiles.
 */
export default function SpecialOfferCard({ offer }: { offer: SpecialOffer; logo?: string | null }) {
  const casinoName = offer.casino?.name ?? ''
  const kind = offer.bonus_category_name ?? 'Bonus'
  // Claim is a property of the bonus TYPE, not of whether a link happens
  // to be filled in. See CLAIMABLE_BONUS_CATEGORY.
  const claimable = offer.bonus_category_slug === CLAIMABLE_BONUS_CATEGORY

  return (
    /* The patch sits beside the terms, and drops ABOVE them below 26rem: at
       320px an 88px disc in a side column leaves the amount in a gutter. */
    <article className="offer relative grid grid-cols-1 items-center gap-5 rounded-[24px] p-[22px] min-[26rem]:grid-cols-[auto_minmax(0,1fr)]">
      {/* THE PATCH GROWS WITH THE TYPE, at exactly the width the readability
          floor changes it.

          globals.css raises every `text-[10.5px]` to 14px at <=1024px, because
          10.5px body-ish text on a phone is unreadable. That rule and this
          patch were fighting: a legend sized to fit 72px at 10.5px arrives on
          a phone at 14px needing 92px, and the longest type in the catalogue
          — "Tournament", ten characters — broke mid-word into "TOURNAMEN"
          over a lone "T".

          Making the two agree is the fix, and it is one `lg:` apart: 112px
          while the floor is in force (96px of text, and 10 characters at 14px
          need 92.4), 88px above it (72px of text, and 10 characters at 10.5px
          need 69.3). Both have room to spare, neither evades the floor, and
          there is no second size table to keep in step with it. `break-words`
          is the safety net for a type longer than any in the catalogue — and
          deliberately NOT `anywhere`, which breaks greedily mid-word even when
          the word would have fitted on a line of its own. */}
      <span aria-hidden className="patch grid h-[112px] w-[112px] flex-none place-items-center lg:h-[88px] lg:w-[88px]">
        <span className="font-mono px-1.5 text-center text-[10.5px] font-bold uppercase leading-[1.3] tracking-[0.06em] break-words">
          {kind}
        </span>
      </span>

      <div className="flex min-w-0 flex-col gap-1.5">
        {/* The patch above carries the TYPE and is hidden from assistive
            tech, so the type is announced here instead, once. */}
        <span className="sr-only">{kind}. </span>
        {casinoName && (
          <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink-soft [overflow-wrap:anywhere]">{casinoName}</span>
        )}
        <h3 className="font-display text-[19px] leading-[1.2] text-ink [overflow-wrap:anywhere] sm:text-[20px]">
          <Link href={`/special-offers/${offer.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {offer.bonuses || offer.title}
          </Link>
        </h3>
        {/* When the headline above is the AMOUNT, the offer's own name still
            has to appear somewhere — otherwise two different offers of the
            same size are indistinguishable in a grid. */}
        {offer.bonuses && <p className="text-[14px] text-ink-soft [overflow-wrap:anywhere]">{offer.title}</p>}

        <div className="relative z-10 mt-1.5 flex flex-wrap items-center justify-between gap-2.5">
          <span
            className="text-[15px] leading-none tracking-[2px] text-gold"
            role="img"
            aria-label={`${offer.rating} out of 5`}
          >
            {'★'.repeat(offer.rating)}
            <span className="text-line-2" aria-hidden>
              {'★'.repeat(5 - offer.rating)}
            </span>
          </span>
          {/*
            * Claim belongs to the Special Offers bonus type and to nothing else.
            *
            *   Special Offers + link   →  Claim → the casino
            *   Special Offers, NO link →  Claim, leading to the offer's own page,
            *                              where the terms and the operator are.
            *   any other bonus type    →  "See offer", the plain way in.
            */}
          {claimable ? (
            offer.affiliate_url ? (
              <a href={offer.affiliate_url} target="_blank" rel="nofollow sponsored noopener" className="btn-or min-h-11 whitespace-nowrap px-4 text-sm">Claim</a>
            ) : (
              // No affiliate URL of its own: the offer's page is the only place
              // that can lead to the operator. An internal link, so no sponsored rel.
              <Link href={`/special-offers/${offer.slug}`} className="btn-or min-h-11 whitespace-nowrap px-4 text-sm">Claim</Link>
            )
          ) : (
            <Link href={`/special-offers/${offer.slug}`} className="inline-flex min-h-11 items-center whitespace-nowrap text-[14.5px] font-semibold text-brand transition-colors hover:text-brand-dark">
              See offer <span aria-hidden className="ml-1">→</span>
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}

/**
 * An offer as a row inside a group: the logo, whose offer it is, its name and
 * amount, and on the right the way in. The whole row opens the offer (the
 * title link is stretched over it) and takes the deeper ground on hover.
 *
 * The SAME Claim rule as the card: Claim only for the Special Offers type —
 * to the casino when the offer has a link, to its own page when it has none.
 * Any other type shows "Details →".
 *
 * `heading` is the title's level: `h4` under a group card's `h3` (the home
 * page), `h3` where the rows sit straight under a section's `h2`.
 */
export function OfferRow({ offer, logo: logoOverride, heading: Heading = 'h4' }: { offer: SpecialOffer; logo?: string | null; heading?: 'h3' | 'h4' }) {
  const logo = logoOverride ?? resolveImageUrl(offer.casino?.image_path ?? offer.image_path)
  const claimable = offer.bonus_category_slug === CLAIMABLE_BONUS_CATEGORY
  const kicker = offer.casino?.name ?? offer.bonus_category_name ?? ''

  return (
    <li className="of relative grid grid-cols-[52px_minmax(0,1fr)] items-center gap-x-3.5 gap-y-2.5 border-b border-line px-4 py-3.5 last:border-b-0 sm:grid-cols-[52px_minmax(0,1fr)_auto] sm:px-5">
      {/* The plate stays WHITE: operator logos arrive with their own white
          ground baked in, and any other fill behind one shows as a hard
          rectangle inside the circle. */}
      <span aria-hidden className="flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-full bg-white p-1.5 text-xs font-bold text-cream">
        {logo ? (
          <Image src={logo} alt="" width={104} height={104} sizes="52px" className="h-full w-full object-contain" />
        ) : (
          initials(kicker || offer.title)
        )}
      </span>
      <div className="min-w-0">
        {kicker && <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">{kicker}</p>}
        <Heading className="text-[15px] font-bold leading-[1.3] text-ink [overflow-wrap:anywhere]">
          <Link href={`/special-offers/${offer.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {offer.title}
          </Link>
        </Heading>
        {offer.bonuses && <p className="text-sm font-bold text-brand [overflow-wrap:anywhere]">{offer.bonuses}</p>}
      </div>
      <div className="relative z-10 col-span-2 flex items-center justify-end gap-3 sm:col-span-1">
        {claimable ? (
          offer.affiliate_url ? (
            <a href={offer.affiliate_url} target="_blank" rel="nofollow sponsored noopener" className="btn-or min-h-11 px-4 text-sm">Claim</a>
          ) : (
            // No affiliate URL of its own: the offer's page is the only place
            // that can lead to the operator. An internal link, so no sponsored rel.
            <Link href={`/special-offers/${offer.slug}`} className="btn-or min-h-11 px-4 text-sm">Claim</Link>
          )
        ) : (
          <span aria-hidden className="text-[13px] font-bold text-brand">Details →</span>
        )}
      </div>
    </li>
  )
}
