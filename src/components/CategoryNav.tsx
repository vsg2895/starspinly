import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import type { Category } from '@shared/types/category'

/**
 * StarSpinly category tabs, from sites/starspinly.html (`.filters` / `.tab`):
 * a wrapping row of outlined pills, each carrying its casino count in mono
 * beside the label. The current one FILLS with the star white and puts its
 * count in the deep comet.
 *
 * The resting border is `line-strong`, not the mockup's `--line`: a tab is a
 * CONTROL, and that hairline is 1.58:1 where a control boundary needs 3:1.
 *
 * The fill and the count are an UNLAYERED CLASS (`.tab-on`), not `bg-ink
 * text-cream` on the element. Tailwind's utilities live in `@layer utilities`
 * and lose to every unlayered rule whatever the order, so a `bg-` here would
 * be overruled by `.tab`'s own background and the active tab would ship with
 * its label invisible — which is exactly what happened on a sibling before it
 * was caught in the browser.
 *
 * THE MOCKUP'S COUNTRY SELECT IS NOT HERE. Its filter row opens with an "All
 * Countries" dropdown driven by a hard-coded `geo` field on each casino in its
 * demo data. The API has countries, but nothing scopes a casino LIST by one —
 * /countries/<slug> is its own page with its own rules — so a select here
 * would either do nothing or quietly filter on a field that does not mean what
 * its label says. Removing it also returns the tabs to the full width of the
 * row, which is what lets seven of them wrap onto two lines instead of three.
 *
 * The tabs NAVIGATE rather than filter in place: always the canonical
 * /categories/<slug> route. The query forms (`/?category=`,
 * `/casinos?category=`) are 301'd to it at the edge (lib/seo/redirects.ts), so
 * linking either would spend a redirect per visitor and crawl budget on URLs
 * that resolve elsewhere.
 */
export default function CategoryNav({
  categories,
  selected,
}: {
  categories: Category[]
  selected: string
}) {
  return (
    <nav aria-label="Casino categories" className="mb-[26px]">
      {/* WRAPS rather than scrolling sideways. The mockup's row is
          `flex-wrap`, and with seven categories plus their counts a single
          scrolling line on a phone hides most of the set behind a gesture with
          no affordance saying so. */}
      <ul className="flex flex-wrap gap-2" role="list">
        {categories.map((c) => {
          const active = c.slug === selected
          return (
            <li key={c.id} className="min-w-0">
              <Link
                href={`/categories/${c.slug}`}
                aria-current={active ? 'page' : undefined}
                className={`tab flex min-h-12 items-center gap-2.5 whitespace-nowrap rounded-full px-[18px] text-[15px] font-semibold ${
                  active ? 'tab-on' : 'text-ink-soft'
                }`}
              >
                {/* The category's own icon, as in the Casinos menu. A plain <img>:
                    next/image refuses SVG. alt="" because the label names it. */}
                {c.logo_path && (
                  <img src={resolveImageUrl(c.logo_path)!} alt="" width={18} height={18} className="h-[18px] w-[18px] shrink-0" />
                )}
                <span>{c.name}</span>
                {typeof c.casinos_count === 'number' && (
                  /* The mockup's `.tab .n`: a bare mono figure, not a chip. */
                  <span className={`tab-count font-mono text-[12px] tabular-nums ${active ? '' : 'text-muted'}`}>
                    {c.casinos_count}
                  </span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
