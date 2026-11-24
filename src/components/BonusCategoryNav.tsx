import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import { COPY } from '@/constants/copy'
import type { BonusSection } from '@/lib/api'

/**
 * The catch-all heading, which the mix deliberately leaves out.
 *
 * Every offer not filed under a real type lands under "Special Offers", so it
 * is not a type at all — it is the whole area, already reachable from the nav
 * and the offers page. Hidden here rather than in the admin: the admin's
 * "Shown" switch would also remove it from the menu and the sections.
 */
export const CATCH_ALL_SLUG = 'special-offers'

/**
 * "Browse by bonus type", from sites/starspinly.html (`.btypes` / `.btype`):
 * a row of PLANETS. Each type is a card capped by a full 999px dome over
 * square feet, carrying its icon on a lit disc that wears a TILTED RING —
 * drawn as a pseudo-element inset past the disc on the horizontal only and
 * rotated 18°, which is the whole trick and the reason it reads as a planet
 * rather than as a circled icon.
 *
 * Six across on a wide screen, three on a tablet, two on a phone: the mockup's
 * own ladder. A GRID rather than a wrapping flex row, because these cards are
 * centred and the dome has to be the same width on every one of them — an
 * uneven last row would break the line they make across the band.
 *
 * The three disc tints cycle by position and the page ground reads on all
 * three (13.98 / 9.11 / 12.67), which is what the icons are drawn in. There is
 * no per-TYPE colour: a type is marked by its place in the row, not by a
 * swatch, because the row's order is the API's and changes when one is hidden.
 *
 * This component renders NO HEADING. The section's head — its kicker, title
 * and "view all" — is drawn by the page's own `SectionHead`, and a second
 * <h2> carrying the same id as that one is a duplicate id, not a heading.
 *
 * Each card opens that type's own page. The counts are the SITE's — active,
 * claimable, owned by a casino attached here — resolved server-side. Renders
 * nothing when the site has no Bonus area or every type is empty.
 */
export default function BonusCategoryNav({ sections }: { sections: BonusSection[] }) {
  const types = sections.filter((section) => section.slug !== CATCH_ALL_SLUG)
  if (types.length === 0) return null

  return (
    <ul className="btypes-grid grid grid-cols-2 gap-3.5 min-[46rem]:grid-cols-3 min-[67.5rem]:grid-cols-6" role="list">
      {types.map((section) => (
        <li key={section.id} className="min-w-0">
          <Link
            href={`/bonuses/${section.slug}`}
            className="btype flex h-full flex-col items-center gap-3.5 px-3.5 pb-[22px] pt-[26px] text-center text-ink"
          >
            {/* The ring is drawn OUTSIDE the disc, so the disc needs room
                around it that no sibling claims — hence the gap above rather
                than a margin on the plate itself. */}
            <span aria-hidden className="btype-plate grid h-[70px] w-[70px] shrink-0 place-items-center">
              {/* The type's own icon, as in the Bonus menu. A plain <img>:
                  next/image refuses SVG. alt="" because the label names it. */}
              {section.icon_path && (
                <img src={resolveImageUrl(section.icon_path)!} alt="" width={28} height={28} className="h-7 w-7" />
              )}
            </span>
            <b className="min-w-0 text-[15.5px] font-bold leading-[1.25] [overflow-wrap:anywhere]">
              {section.name}
            </b>
            <span className="font-mono text-[12px] text-muted">
              {section.offers_count} {section.offers_count === 1 ? COPY.bonusCategory.countOne : COPY.bonusCategory.countMany}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
