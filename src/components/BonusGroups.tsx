import Link from 'next/link'
import { COPY } from '@/constants/copy'
import SpecialOfferCard, { OFFER_GRID } from '@/components/SpecialOfferCard'
import type { BonusSection } from '@/lib/api'

/**
 * The home page's Bonuses — the mockup's `.subh` + `.offers` pairs: one
 * display-face subhead per bonus type, TRAILED BY A RULE that runs to the
 * right edge, over a grid of that type's mission patches.
 *
 * The trailing rule is a flex child rather than a border, so it fills whatever
 * the heading leaves rather than needing a width nobody can know. It is the
 * mockup's `.subh::after` and it is doing real work on this page: the sections
 * below the hero have no ground of their own — they are the sky — so a run of
 * subheads with nothing between them would float.
 *
 * Built in this site's own language rather than the sibling sites' — which is
 * the point, since they all serve the same catalogue and a reader comparing
 * them should not meet the same block four times.
 *
 * Each subhead carries the type's name, this site's own `offers_count` for it,
 * and a link to the type's page. The count is resolved server-side over the
 * unlimited set, so it is the number of offers of this kind on the whole site
 * rather than the number of cards under it.
 *
 * Every type's offers are in the server HTML, and each group keeps the
 * `#bonus-<slug>` anchor the planets land on.
 *
 * Each grid is its own `offer-grid`, so the three-tone cycle RESTARTS per
 * type: the colours are rhythm within a run of cards, and a cycle carried
 * across group boundaries would make the first patch of each group a different
 * colour for no reason a reader could name.
 */
export default function BonusGroups({ sections }: { sections: BonusSection[] }) {
  if (sections.length === 0) return null

  return (
    <div className="flex flex-col gap-11">
      {sections.map((section) => (
        <section
          key={section.id}
          id={`bonus-${section.slug}`}
          aria-labelledby={`bonus-${section.slug}-heading`}
          className="scroll-mt-28"
        >
          <div className="mb-[18px] flex flex-wrap items-center gap-x-3.5 gap-y-2">
            <h3 id={`bonus-${section.slug}-heading`} className="font-display min-w-0 text-[20px] text-ink sm:text-[22px]">
              <span className="[overflow-wrap:anywhere]">{section.name}</span>
              <span className="sr-only">
                {' '}— {section.offers_count} {section.offers_count === 1 ? COPY.bonusCategory.countOne : COPY.bonusCategory.countMany}
              </span>
            </h3>
            <span aria-hidden className="font-mono text-[12.5px] text-muted tabular-nums">{section.offers_count}</span>
            {/* The mockup's `.subh::after`. */}
            <span aria-hidden className="h-px min-w-6 flex-1 bg-line" />
            <Link
              href={`/bonuses/${section.slug}`}
              className="-my-3 inline-flex min-h-11 items-center py-3 text-[14.5px] font-semibold text-brand transition-colors hover:text-brand-dark"
            >
              {COPY.home.seeMore}<span className="sr-only"> {section.name}</span> <span aria-hidden className="ml-1">→</span>
            </Link>
          </div>
          {section.description && <p className="mb-[18px] max-w-[640px] text-[15px] text-ink-soft">{section.description}</p>}
          <div className={OFFER_GRID}>
            {section.offers.map((offer) => (
              <SpecialOfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
