import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBonusArea, getCategories, getCategory, getSpecialOffers } from '@/lib/api'
import type { BonusSection } from '@/lib/api'
import { buildItemListSchema, buildWebPageSchema, jsonLdScript, buildFaqSchema, SHARE_IMAGES } from '@/lib/seo'
import { COPY } from '@/constants/copy'
import { FAQ_ITEMS } from '@/constants/faq'
import CasinoCard, { CASINO_LIST, Stars } from '@/components/CasinoCard'
import BonusCategoryNav from '@/components/BonusCategoryNav'
import BonusGroups from '@/components/BonusGroups'
import CategoryNav from '@/components/CategoryNav'
import FaqAccordion from '@/components/FaqAccordion'
import SpecialOfferCard, { OFFER_GRID } from '@/components/SpecialOfferCard'
import type { Category } from '@shared/types/category'
import type { CasinoWithAttachment } from '@shared/types/casino'
import type { SpecialOffer } from '@shared/types/specialOffer'
import { SITE_URL } from '@/lib/config'
import { casinosHeading } from '@/lib/categories'

/** Offers shown per bonus type in the home page's Bonuses section — one row. */
const HOME_BONUSES_PER_CATEGORY = 3

/**
 * Where the three picks sit on the hero's sky chart, as percentages of the
 * disc.
 *
 * DISTANCE FROM THE CENTRE IS RANK — 16, 31 and 45 per cent out — so the
 * figure encodes the one thing this page actually knows about these three.
 * The ANGLES are fixed and arbitrary, picked to make a legible asterism; the
 * only constraint on them is that all three must land in the chart's UPPER
 * half, because the picks card covers everything from 46% down and a dot
 * plotted under it is a dot nobody sees. Nothing is claimed by the angles.
 *
 * Computed once here rather than per render, and fixed rather than derived
 * from the ratings: the ratings on this network are frequently all 5.0, which
 * would stack three dots on one point and read as a rendering fault.
 *
 * The whole figure is `aria-hidden` and every casino on it is also a real row
 * in the card below, so nothing is reachable only through the picture.
 */
const CHART_DOTS = [
  { left: 55.5, top: 35.0 },
  { left: 20.1, top: 42.0 },
  { left: 84.5, top: 21.1 },
] as const

/** The three dot tones, and the matching numeral colour on the row below —
 *  the mockup's `.sdot` / `.sdot.s2` / `.sdot.s3` and its `.t3n` overrides.
 *  The pairing is the point: a dot and its row share a number AND a colour. */
const CHART_DOT_TONE = ['sdot', 'sdot-2', 'sdot-3'] as const
const CHART_NUM_TONE = ['text-brand', 'text-ink', 'text-lilac'] as const

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? ''
const YEAR = new Date().getFullYear()

type Props = { searchParams: Promise<{ category?: string; page?: string }> }

// Resolve the selected category (default = first/highest-priority) for the home casinos section.
async function resolveCategory(searchParams: Props['searchParams']) {
  const sp = await searchParams
  const categories = (await getCategories()).data
  const selected =
    sp.category && categories.some((c) => c.slug === sp.category) ? sp.category : categories[0]?.slug
  return { categories: categories as Category[], selected }
}

export async function generateMetadata(): Promise<Metadata> {
  const title = `${COPY.home.homeTitle} ${YEAR} | ${SITE_NAME}`
  const description = COPY.home.metaDescription
  return {
    title,
    description,
    alternates: { canonical: '/' },
    openGraph: { type: 'website', url: '/', siteName: SITE_NAME, title, description, images: SHARE_IMAGES },
    twitter: { card: 'summary_large_image', title, description, images: SHARE_IMAGES },
  }
}

export default async function HomePage({ searchParams }: Props) {
  /*
   * THE HOME PAGE HAS ONE PAGE, so `?page=2` is a page past the end.
   *
   * Nothing here is paginated (the full list is /casinos), yet `/?page=2` and
   * every other number a crawler guessed answered 200 with the whole home page
   * and an `index` robots tag: a duplicate of `/` at a URL of its own. A 404
   * says it is not a page at all, the rule every paginated listing here applies
   * past its last page. `?page=1` never reaches this: proxy.ts 301s it to `/`.
   */
  if (Math.max(1, Number((await searchParams).page) || 1) > 1) notFound()

  const { categories, selected } = await resolveCategory(searchParams)

  const [categoryRes, offersRes, anyOffersRes, bonusRes] = await Promise.allSettled([
    selected ? getCategory(selected) : Promise.resolve(null),
    getSpecialOffers(selected, 6),
    // Site-wide, unfiltered, limit 1 — just "does a visible offer exist at all?".
    // Runs alongside the others, so it costs no extra round-trip of latency, and
    // the public endpoint already excludes offers whose visibility is off.
    getSpecialOffers(undefined, 1),
    // The bonus TYPES: the chip row under the hero AND the per-type Bonuses
    // section further down, so each type brings its first
    // HOME_BONUSES_PER_CATEGORY offers (one full row of the three-up grid).
    // The chips only read names, marks and counts, which the server counts
    // over the unlimited set. allSettled means a site without the Bonus area
    // renders neither, and falls back to the plain Special offers grid.
    getBonusArea(HOME_BONUSES_PER_CATEGORY),
  ])

  // Empty when the site does not publish the Bonus area, or when the
  // request failed — the strip renders nothing either way.
  const bonusSections: BonusSection[] = bonusRes.status === 'fulfilled' ? bonusRes.value : []

  const catData =
    categoryRes.status === 'fulfilled' && categoryRes.value ? categoryRes.value.data : null
  const casinos: CasinoWithAttachment[] = catData?.casinos ?? []
  const activeCategory = catData?.category ?? null
  // "See More" is only an affordance when there is actually more: compare the
  // category's full count against the rows this page received, rather than
  // hard-coding the page size on both sides where the two could drift apart.
  const hasMoreCasinos = (catData?.meta?.total ?? 0) > casinos.length
  // Offers are already scoped to the selected category and capped by the backend (?category=&limit=).
  const topOffers: SpecialOffer[] = offersRes.status === 'fulfilled' ? offersRes.value.data : []

  // Whether ANY special offer is visible on this site. Drives the hero CTA:
  // a button leading to an empty page is worse than no button. On a failed
  // request this stays false, so the CTA hides rather than promising content
  // that may not be there.
  const anyOffersVisible: boolean =
    anyOffersRes.status === 'fulfilled' && anyOffersRes.value.data.length > 0

  // Organization schema is emitted site-wide from the root layout; the home
  // page only adds its page-specific ItemList of top casinos.
  //
  // The list is the SELECTED category, not the whole catalogue, so it is named
  // and addressed as that category — it previously claimed the generic name
  // "Top Casinos at <brand>" and pointed at /casinos, describing neither the
  // rows below it nor a URL that renders them.
  const listSchema = buildItemListSchema(
    activeCategory ? `${activeCategory.name} — ${COPY.home.topCasinosTitle}` : COPY.home.topCasinosTitle,
    selected ? `${SITE_URL}/categories/${selected}` : `${SITE_URL}/casinos`,
    casinos.map((c, i) => ({ position: i + 1, name: c.name, url: `${SITE_URL}/casinos/${c.slug}` })),
  )

  const graph = [
    buildWebPageSchema({
      // Mirrors the actual <title>. The previous "Best Online Casinos <year>"
      // was generic boilerplate shipped identically by the sibling domains and
      // matched neither this page's title nor its H1.
      name: `${COPY.home.homeTitle} ${YEAR}`,
      url: SITE_URL,
      description: COPY.home.metaDescription,
    }),
    listSchema,
    // Same array the section below renders — markup-only FAQ is a violation.
    buildFaqSchema(SITE_URL, FAQ_ITEMS),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(graph) }} />

      <main>
        {/* Hero — the mockup's opening: the page itself (the starfield on the
            body shows straight through, so the hero declares no ground) with
            the claim at the left and the SKY CHART at the right, the week's
            three brightest casinos plotted on it and the picks card floating
            over its lower half.

            `.slab` keeps its name so the shared class vocabulary holds across
            the network; here it is nothing but the closing hairline. */}
        <section className="slab py-14 sm:py-[72px] lg:pb-[90px] lg:pt-20">
          <div className="relative z-[1] mx-auto max-w-[1200px] px-4 sm:px-[22px]">
            <div className="grid grid-cols-1 items-center gap-12 min-[56.25rem]:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] min-[56.25rem]:gap-12">
              <div>
                {/* AQUA, because this label is the one claim on the page that
                    something is current — and aqua is this site's colour for a
                    reading. The dot pulses, and stops under reduced motion. */}
                <p className="live font-mono inline-flex items-center gap-2.5 text-[12.5px] uppercase tracking-[0.12em] text-accent">
                  {COPY.home.heroEyebrow}
                </p>
                <h1 className="font-display mt-[22px] text-[40px] font-extrabold text-balance text-ink sm:text-[clamp(42px,6vw,80px)]">
                  {COPY.home.heroHeadline}{' '}
                  <em className="not-italic text-brand">{COPY.home.heroHighlight}</em>
                  {COPY.home.heroHeadlineTail && <> {COPY.home.heroHeadlineTail}</>}
                </h1>
                <p className="mt-6 max-w-[520px] text-[17px] text-ink-soft sm:text-[19px]">{COPY.home.heroSubtitle}</p>
                <div className="mt-[34px] flex flex-wrap gap-3">
                  <Link href="/casinos" className="btn-or btn-gold min-h-[54px] px-7 text-[16px]">
                    {COPY.home.featuredCasinos}
                  </Link>
                  {anyOffersVisible && (
                    <Link href="/special-offers" className="btn-ln btn-on-dark min-h-[54px] px-7 text-[16px]">
                      {COPY.home.specialOffers}
                    </Link>
                  )}
                </div>
              </div>

              {/* THE SKY CHART. The mockup defines `.chart`, `.sdot` and
                  `.chart-label` in full and then never renders them — its
                  hero markup is the picks card alone. They are built here
                  because they are the idea the whole design is named for: a
                  list of three is a list, and a list of three PLOTTED is a
                  chart.

                  WHAT THE PLOT MEANS. Each dot's distance from the centre is
                  its RANK — the leader nearest the middle, the third furthest
                  out — so the figure encodes the one thing this page actually
                  knows about the three. The ANGLES are fixed and arbitrary,
                  chosen to make a legible asterism; nothing is claimed by
                  them. The whole figure is `aria-hidden`, and every casino on
                  it is also a real row in the card below, so nothing is
                  reachable only through the picture.

                  The card's shadow is the one shadow on this site, and it is
                  doing a real job: it is what lifts the card off the chart
                  behind it, which on a ground this dark nothing else could. */}
              {casinos.length >= 3 && (
                <div className="relative mx-auto w-full max-w-[480px]">
                  <div aria-hidden className="chart">
                    {/* The constellation, joining the three in rank order.
                        `vector-effect` keeps the line one pixel at any size
                        the disc is given, which a scaled stroke would not. */}
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                      <polyline
                        points={CHART_DOTS.map((d) => `${d.left},${d.top}`).join(' ')}
                        fill="none"
                        stroke="var(--color-line-2)"
                        strokeWidth="1"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                    {/* The mockup's `.chart-label`: a mono caption knocking a
                        hole in the outer ring it sits on. */}
                    <span className="font-mono absolute left-1/2 top-[18px] -translate-x-1/2 whitespace-nowrap bg-surface px-2 text-[11.5px] uppercase tracking-[0.14em] text-muted">
                      {COPY.home.meterLabel}
                    </span>
                    {CHART_DOTS.map((d, i) => (
                      <span
                        key={d.left}
                        className={`absolute -ml-[9px] -mt-[9px] h-[18px] w-[18px] rounded-full ${CHART_DOT_TONE[i]}`}
                        style={{ left: `${d.left}%`, top: `${d.top}%` }}
                      >
                        {/* The numeral sits on whichever side has room: a
                            dot in the right half would push its label past
                            the rim of the disc and out of the column. */}
                        <b
                          className={`font-mono absolute top-1/2 -translate-y-1/2 text-[12px] font-bold text-ink-soft ${
                            d.left < 50 ? 'left-[26px]' : 'right-[26px]'
                          }`}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </b>
                      </span>
                    ))}
                  </div>

                  {/* Pushed down over the chart's lower half. The chart is a
                      square, so a percentage margin here is a fraction of its
                      own height and the overlap holds at every width. */}
                  <aside className="hard-gold relative z-10 mt-[46%] rounded-[22px] px-[18px] py-2" aria-labelledby="podium-heading">
                    <h2 id="podium-heading" className="font-mono mb-1 mt-3 text-[12.5px] font-medium uppercase tracking-[0.14em] text-accent">
                      {COPY.home.meterScope}
                    </h2>

                    {/* The mockup's `.t3` rows. A rank numeral stays HERE —
                        the network prints none on a casino CARD, but this list
                        is three long and titled as picks, so the position is
                        the content, and it is the same numeral the dot above
                        carries. The right-hand slot takes the RATING: the
                        mockup puts a payout time and a minimum deposit there
                        and no column in the API holds either. */}
                    <ol>
                      {casinos.slice(0, 3).map((c, i) => (
                        <li key={c.id} className="border-t border-line first:border-t-0">
                          <Link href={`/casinos/${c.slug}`} className="group grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-3 py-3">
                            <span aria-hidden className={`font-mono text-[13px] font-bold ${CHART_NUM_TONE[i]}`}>
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="min-w-0">
                              {/* WRAPS rather than truncating: at 320px this
                                  column has about 150px, enough to turn "7 Bit
                                  Casino" into "7 Bit Casi…", and a list of
                                  picks whose names are cut off identifies
                                  nothing. */}
                              <b className="block text-[16px] font-bold text-ink transition-colors [overflow-wrap:anywhere] group-hover:text-brand">{c.name}</b>
                              <span className="mt-1 flex items-center gap-2">
                                <Stars rating={c.rating} />
                              </span>
                            </span>
                            <span className="font-mono rounded-full bg-brand px-2.5 py-1 text-[12px] font-bold text-brand-ink tabular-nums">
                              <span className="sr-only">Rating </span>★ {c.rating.toFixed(1)}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ol>

                    <p className="border-t border-line py-3 text-[13px] text-muted">{COPY.home.meterNote}</p>
                  </aside>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 01 — the board. Category tabs in the mockup's filter bar, then the
            casinos as tickets. */}
        <section className="pt-16 sm:pt-[88px]" aria-labelledby="top-casinos-heading">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-[22px]">
            <SectionHead
              no="01" kicker="Rankings"
              id="top-casinos-heading"
              title={COPY.home.topCasinosTitle}
              subtitle={COPY.home.topCasinosSubtitle}
              more={casinos.length > 0 ? { href: '/casinos', label: COPY.home.viewAll, sr: ' casinos' } : undefined}
            />

            {categories.length > 0 && selected && (
              <CategoryNav categories={categories} selected={selected} />
            )}

            {casinos.length === 0 ? (
              <p className="rounded-[6px] border border-dashed border-line-strong p-10 text-center text-muted">
                {COPY.casinos.noResults}
              </p>
            ) : (
              <ol className={CASINO_LIST}>
                {casinos.map((casino, i) => (
                  <CasinoCard key={casino.id} casino={casino} rank={i + 1} />
                ))}
              </ol>
            )}

            {activeCategory && hasMoreCasinos && (
              <div className="mt-6 flex justify-center">
                <Link href={`/categories/${selected}`} className="btn-ln min-h-12 px-[22px] text-[15px]">
                  See more casinos<span className="sr-only"> — {casinosHeading(activeCategory.name)}</span> <span aria-hidden>→</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* 02 — the bonus types, as one hairline grid. Renders nothing at all
            without a Bonus area. */}
        {bonusSections.length > 0 && (
          <section className="pt-16 sm:pt-[88px]" aria-labelledby="bonus-types-heading">
            <div className="mx-auto max-w-[1200px] px-4 sm:px-[22px]">
              <SectionHead no="02" kicker="Constellations" id="bonus-types-heading" title={COPY.home.bonusTypesTitle} />
              <BonusCategoryNav sections={bonusSections} />
            </div>
          </section>
        )}

        {/* 03 — the offers. One mono subhead per type over a grid of coupons,
            built from the same getBonusArea payload as the grid above. A site
            without the Bonus area keeps the flat grid instead. */}
        {bonusSections.length > 0 ? (
          <section className="pt-16 sm:pt-[88px]" aria-labelledby="bonus-heading">
            <div className="mx-auto max-w-[1200px] px-4 sm:px-[22px]">
              <SectionHead
                no="03" kicker="Offers"
                id="bonus-heading"
                title={COPY.home.bonus}
                more={{ href: '/special-offers', label: COPY.home.seeAllBonuses, sr: '' }}
              />
              <BonusGroups sections={bonusSections} />
            </div>
          </section>
        ) : topOffers.length > 0 && (
          <section className="pt-16 sm:pt-[88px]" aria-labelledby="offers-heading">
            <div className="mx-auto max-w-[1200px] px-4 sm:px-[22px]">
              <SectionHead
                no="03" kicker="Offers"
                id="offers-heading"
                title={COPY.home.specialOffers}
                more={{ href: '/special-offers', label: COPY.home.viewAll, sr: ' special offers' }}
              />
              <div className={OFFER_GRID}>
                {topOffers.map((offer) => (
                  <SpecialOfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 04 — how a casino gets on the board. Not in the mockup, which ends
            at the FAQ; kept because it is the page's only account of where the
            ranking comes from, and an affiliate site that ranks operators
            without publishing its method is asking to be taken on trust. */}
        <section className="pt-16 sm:pt-[88px]" aria-labelledby="method-heading">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-[22px]">
            <SectionHead no="04" kicker="Method" id="method-heading" title={COPY.home.methodTitle} subtitle={COPY.home.methodSubtitle} />
            <ol className="grid grid-cols-1 gap-3.5 sm:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
              {COPY.home.methodSteps.map((step) => (
                <li key={step.no} className="step rounded-[6px] p-[26px]">
                  <p className="flex items-center gap-3 font-mono text-[12.5px] uppercase tracking-[0.14em] text-brand">
                    <span aria-hidden className="grid h-9 w-9 place-items-center rounded-[4px] border border-line text-[13px] font-bold">{step.no}</span>
                    {step.verb}
                  </p>
                  <h3 className="mt-4 font-display text-[21px] text-ink">{step.title}</h3>
                  <p className="mt-2.5 text-[15px] text-ink-soft">{step.body}</p>
                </li>
              ))}
            </ol>
            <p className="mt-5 flex items-center gap-3 text-sm font-semibold text-muted">
              <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5" />
              </svg>
              <span>{COPY.home.methodLoop}</span>
            </p>
          </div>
        </section>

        {/* 05 — the FAQ, as the mockup lays it out: the head on the left,
            STICKY beside the questions, which stack in one column on the
            right. Every answer is in the HTML, open or closed, which the
            FAQPage schema above requires.

            The head unsticks below `54rem`, where the two columns become one:
            a sticky element in a single-column flow pins the heading over the
            answers the reader is scrolling through. */}
        <section className="pt-16 sm:pt-[88px]" aria-labelledby="faq-heading">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-[22px]">
            <div className="grid grid-cols-1 items-start gap-10 min-[54rem]:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] min-[54rem]:gap-14">
              <div className="min-[54rem]:sticky min-[54rem]:top-[110px]">
                <SectionHead no="05" kicker="Flight log" id="faq-heading" title={COPY.home.faqTitle} subtitle={COPY.home.faqSubtitle} stacked />
              </div>
              <FaqAccordion items={FAQ_ITEMS} />
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

/**
 * The mockup's `.sec-head`: a mono section number, the heading and its line,
 * and an optional link to the full list — on one row from `sm`, stacked below
 * it, because three tracks in 320px leaves the middle one about 90px wide.
 *
 * A local component rather than one in components/: every site in the network
 * heads its sections differently, and this shape is this design's own. Nothing
 * else renders it, so it lives where it is used.
 *
 * `stacked` drops the third track for the FAQ, whose head sits in its own
 * column and has no "view all" to carry.
 */
function SectionHead({
  no,
  kicker,
  id,
  title,
  subtitle,
  more,
  stacked = false,
}: {
  no: string
  kicker: string
  id: string
  title: string
  subtitle?: string
  more?: { href: string; label: string; sr: string }
  stacked?: boolean
}) {
  return (
    <div
      className={`mb-[30px] flex flex-wrap items-end gap-x-5 gap-y-3 ${
        stacked ? '' : 'justify-between'
      }`}
    >
      <div className="min-w-0">
        {/* The mockup's `.kicker`: the section number and its name on one mono
            line in AQUA, ABOVE the heading rather than beside it. Above,
            because this design's headings run to five or six words and a
            marker in a left-hand track beside a heading that wraps drifts down
            level with its second line and reads as part of the sentence. */}
        <span aria-hidden className="font-mono mb-3 block text-[12.5px] uppercase tracking-[0.14em] text-accent">
          {no} — {kicker}
        </span>
        <h2 id={id} className="font-display text-[30px] text-ink sm:text-[clamp(30px,4.2vw,50px)]">
          {title}
        </h2>
        {subtitle && <p className="mt-2.5 max-w-[620px] text-[17px] text-ink-soft">{subtitle}</p>}
      </div>
      {more && (
        <Link href={more.href} className="inline-flex min-h-11 items-center font-semibold text-brand transition-colors hover:text-brand-dark sm:pb-1">
          {more.label}{more.sr && <span className="sr-only">{more.sr}</span>} <span aria-hidden className="ml-1">→</span>
        </Link>
      )}
    </div>
  )
}
