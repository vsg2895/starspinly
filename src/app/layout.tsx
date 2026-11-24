import type { Metadata, Viewport } from 'next'
import { Unbounded, Instrument_Sans, JetBrains_Mono } from 'next/font/google'
import Link from 'next/link'
import ScrollToTopOnNavigate from '@/components/ScrollToTopOnNavigate'
import NewsletterForm from '@/components/NewsletterForm'
import SocialIcons from '@/components/SocialIcons'
import CookieConsent from '@/components/CookieConsent'
import ToastProvider from '@/components/ToastProvider'
import CookieSettingsButton from '@/components/CookieSettingsButton'
import Logo from '@/components/Logo'
import { getSocialLinks, hasSpecialOffers, getCategories, getBonusArea } from '@/lib/api'
import { buildOrganizationSchema, buildWebSiteSchema, jsonLdScript, SHARE_IMAGES } from '@/lib/seo'
import { SITE_URL } from '@/lib/config'
import { COPY } from '@/constants/copy'
import NavDropdown from '@/components/NavDropdown'
import FooterNavGroup from '@/components/FooterNavGroup'
import MobileNav from '@/components/MobileNav'
import { resolveImageUrl } from '@/lib/images'
import { LEGAL_PAGES } from '@/constants/legalPages'
import type { SocialLink } from '@shared/types/socialLink'
import './globals.css'

// The three faces of sites/starspinly.html.
//
// Unbounded is a geometric display face with very tight sidebearings and
// almost no contrast — closer to a wordmark than to a text face, which is why
// it only ever sets a heading here. Three weights are loaded and each has a
// job: 400 for the picks card's small heads, 600 for every section <h2> and
// card name, 800 for the hero and the wordmark. `.font-display` pins 600, so
// anything heavier has to ask for it.
//
// JetBrains Mono carries every READOUT: the kickers, the hero's coordinates,
// the column labels, the counts, the question numbers, the patch legends. It
// is a third family rather than a styling of the body face because this design
// is pretending to be an instrument, and a proportional face cannot do that —
// its tabular digits also keep a column of figures from reflowing.
//
// Instrument Sans carries everything read as prose. It is the mockup's own
// body pairing and shares Unbounded's geometry without competing with it.
const unbounded = Unbounded({ variable: '--font-unbounded', subsets: ['latin'], weight: ['400', '600', '800'] })
const instrument = Instrument_Sans({ variable: '--font-instrument', subsets: ['latin'], weight: ['400', '500', '600', '700'] })
const jetbrains = JetBrains_Mono({ variable: '--font-jetbrains', subsets: ['latin'], weight: ['500', '700'] })

/**
 * Subscribe capture: every entry point on this site — the newsletter form and,
 * where the site has one, the timed subscribe modal.
 *
 * The components, the /api/newsletter route and the backend double-opt-in flow
 * are never touched by this; it only decides whether they are rendered. That is
 * the point of a flag rather than deleted markup: turning capture off and back
 * on is one edit, and nothing has to be rebuilt from memory.
 */
const SUBSCRIBE_ENABLED = true

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'StarSpinly'

// Both strings live in COPY so this site's wording is defined in exactly one
// place — the same place the page-level titles and descriptions come from.
// The previous SITE_DESCRIPTION here was byte-identical to a sibling domain's,
// which made this site's default meta/og/twitter description duplicate content
// on every page that falls back to it.
const SITE_TITLE = `${SITE_NAME} — ${COPY.site.titleTail}`
const SITE_DESCRIPTION = `${SITE_NAME} ${COPY.site.description}`

export const metadata: Metadata = {
  // THE origin every relative canonical and og:url in the app resolves
  // against. `SITE_URL` is validated at module load (see lib/config), so the
  // old `|| 'https://…'` literal is gone: a second hardcoded host here is
  // exactly how the canonical and the sitemap drifted onto different hosts.
  metadataBase: new URL(SITE_URL),
  // Root default. Every page overrides it with its own path, so each URL
  // gets a SELF-referencing canonical rather than inheriting the homepage's.
  alternates: { canonical: '/' },
  title: {
    // Home & inner pages set their own; this is the SEO-friendly fallback title.
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  // Terms that describe what THIS site publishes. The generic set that was
  // here was shared with a sibling domain and described neither in particular.
  keywords: [...COPY.site.keywords, SITE_NAME],
  // Tab icon.
  //
  // This used to offer ONLY icon.svg. Browsers that do not take an SVG favicon
  // — Safari most visibly — then had nothing to fall back to, because
  // /favicon.ico 404'd, so they showed a placeholder or a stale cached icon
  // instead of this site's own mark. app/favicon.ico now holds 16/32/48 rasters
  // cut from that same artwork, and Next links it automatically from the file
  // convention, so it is deliberately NOT repeated here.
  //
  // `apple` DOES have to be listed: an explicit icons object suppresses the
  // apple-icon file convention, so app/apple-icon.tsx was generating a 180x180
  // PNG at /apple-icon that no page ever linked to.
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-icon', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    // Relative on purpose: Next resolves it against metadataBase, so og:url
    // and the canonical can never disagree about the host.
    url: '/',
    images: SHARE_IMAGES,
  },
  // The card TYPE only. A title and description here were inherited by every
  // page that does not set `twitter` itself — nearly all of them — so a shared
  // /casinos or /about went out on X under the HOME page's title. With these
  // tags absent, X reads the page's own og:title, og:description and og:image.
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  manifest: '/manifest.webmanifest',
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  // Search-engine ownership verification, supplied per environment. Absent env
  // vars simply produce no tag, so nothing has to be committed to the repo.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    other: {
      ...(process.env.NEXT_PUBLIC_BING_VERIFICATION
        ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION }
        : {}),
      ...(process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION
        ? { 'p:domain_verify': process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION }
        : {}),
    },
  },
}

/**
 * Viewport + theme colour.
 *
 * Next 14 moved these out of `metadata` into their own export; leaving
 * themeColor in `metadata` is silently ignored, which is why the sites had no
 * theme-color at all. `viewport-fit=cover` is deliberately omitted — nothing
 * here draws into the notch area.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0d22',
}

const NAV_LINKS = [
  { href: '/casinos', label: COPY.nav.casinos },
  { href: '/special-offers', label: COPY.nav.specialOffers },
  { href: '/categories', label: COPY.nav.categories },
]

/** A header link — the mockup's `.hdr .nav a`: a flat PILL that takes the
 *  card ground and brightens its label on hover. Nothing on this site is a
 *  rounded rectangle; every control is a full pill. */
const NAV_LINK = 'flex min-h-11 items-center whitespace-nowrap rounded-full px-4 py-2 text-[15px] font-semibold text-ink-soft transition-colors hover:bg-paper hover:text-ink'

const FOOTER_LINK = 'inline-flex min-h-11 min-w-11 items-center text-[15px] font-medium text-night-ink transition-colors hover:text-night-accent'

/** A footer column head — the mockup's `.ftr h4`: mono capitals, widely
 *  tracked, in AQUA (12.67:1 on the footer ground). Aqua is this site's colour
 *  for a reading, and a column head is a label on an instrument. */
const FOOTER_HEAD = 'font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-accent'

// The 11 legal pages split into the footer's three columns, as in the mockup.
// Every page in LEGAL_PAGES lands in exactly one of them.
const FOOTER_EXPLORE = ['about', 'contact']
const FOOTER_LEGAL = ['privacy-policy', 'terms', 'cookie-policy', 'disclaimer']
const FOOTER_POLICIES = ['responsible-gambling', 'affiliate-disclosure', 'editorial-policy', 'aml-policy', 'kyc-policy']

function footerPages(slugs: string[]) {
  return LEGAL_PAGES.filter(({ slug }) => slugs.includes(slug))
}

/** The header dropdown panel, in this site's own palette. A flat panel on the
 *  card ground with a hairline — no shadow, because this design has none. */
const NAV_PANEL = {
  panelClassName: 'bg-paper ring-1 ring-line-2 rounded-[18px] shadow-[0_24px_60px_rgba(0,0,0,0.45)]',
  itemClassName: 'text-ink-soft hover:bg-surface hover:text-ink',
  allItemClassName: 'text-ink hover:bg-surface hover:text-ink',
  arrowClassName: 'text-brand',
}

/** The phone menu (below `lg`), in this site's own palette. The trigger takes
 *  `line-strong` rather than `line`: it is a CONTROL, and the mockup's
 *  hairline is 1.58:1 where a control boundary needs 3:1. The trigger is a
 *  full circle, as the mockup's `.burger` is. */
const NAV_MOBILE = {
  triggerClassName: 'rounded-full border border-line-strong text-ink hover:bg-paper hover:text-ink',
  panelClassName: 'bg-surface border-line',
  rowClassName: 'text-ink hover:bg-paper hover:text-ink',
  rowExpandedClassName: 'bg-paper text-ink',
  allClassName: 'text-ink hover:bg-paper hover:text-ink',
  childClassName: 'text-ink-soft hover:bg-paper hover:text-ink',
  guideClassName: 'border-line',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  /*
   * Widened to `string` deliberately.
   *
   * COPY is `as const`, so this would otherwise carry the LITERAL type of
   * whatever address is written in copy.ts — and TypeScript then rejects
   * `!== ''` as a comparison that can never be true. The check is not
   * pointless: a freshly cloned site ships with this blank, and the footer has
   * to omit the whole <address> element rather than print an empty one.
   */
  const postalAddress: string = COPY.footer.postalAddress

  let socialLinks: SocialLink[] = []
  try {
    socialLinks = (await getSocialLinks()).data
  } catch {
    socialLinks = []
  }

  // "Special Offers" only earns its slot in the nav when this site actually has
  // a visible offer to show; with none, the link would lead to an empty page,
  // so both the header and the footer drop it.
  const showSpecialOffers = await hasSpecialOffers()
  const navLinks = NAV_LINKS.filter(({ href }) => href !== '/special-offers' || showSpecialOffers)

  // Children for the Casinos and Bonuses entries, header and footer
  // alike. Each carries the icon its chip shows, resolved here on the server so
  // the client menus never need the storage URL. A failed fetch yields no
  // items, and the entry then stays the plain link it always was.
  const categoryMenuItems = await getCategories()
    .then((res) => res.data.map((c) => ({ slug: c.slug, name: c.name, icon: resolveImageUrl(c.logo_path) })))
    .catch(() => [])
  // Bonus types with at least one visible offer on this site (the API drops
  // empty ones). getBonusArea already falls back to [] on failure.
  const bonusMenuItems = (await getBonusArea()).map((section) => ({
    slug: section.slug,
    name: section.name,
    icon: resolveImageUrl(section.icon_path),
  }))

  // Site-wide structured data, rendered once here so every page carries it.
  // Next.js manages the document <head> (manual <head> tags in a root layout are
  // discouraged), so per the framework's JSON-LD guide the <script> is rendered
  // in the layout body — crawlers read JSON-LD from anywhere in the document.
  // The `<` escaping keeps the payload XSS-safe.
  //
  // Two nodes, cross-referenced by @id: the publisher (Organization) and the
  // site (WebSite). socialLinks is already fetched above for the footer, so
  // `sameAs` costs no extra request.
  const siteGraph = [buildOrganizationSchema(socialLinks), buildWebSiteSchema()]

  return (
    <html lang="en" className={`${instrument.variable} ${unbounded.variable} ${jetbrains.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {/* Opens every page at its top — see the component. */}
        <ScrollToTopOnNavigate />
        <ToastProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript(siteGraph),
          }}
        />
        {/* THE TOP BAR — the mockup's `.topbar`, and this site's primary
            subscribe point. The deeper ground, a line of copy at the left and
            the field at the right, ABOVE the sticky header rather than inside
            it.

            This is why the header has room: on the siblings the form fights
            the nav for the same 1200px row and gets dropped below `xl`,
            leaving a phone with the band above the footer as its only way in.
            Here the bar is its own row, so the form is present at EVERY
            width — the mockup hides only the sentence beside it, which is
            what has to give when the row narrows. */}
        {SUBSCRIBE_ENABLED && (
          <div className="border-b border-line bg-surface">
            <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-5 gap-y-3 px-4 py-2.5 sm:px-[22px]">
              <p className="hidden min-w-0 flex-1 text-[14px] text-ink-soft md:block">
                <b className="font-mono mr-2 font-bold uppercase tracking-[0.1em] text-brand">{COPY.newsletter.barLead}</b>
                {COPY.newsletter.barTail}
              </p>
              {/* `compact` = no intro: the sentence beside it is the intro.
                  `tone="bar"` is the mockup's `.hsub` — field and key inside
                  ONE outlined pill. */}
              <NewsletterForm compact tone="bar" className="w-full md:w-auto md:flex-[0_1_420px]" />
            </div>
          </div>
        )}

        {/* Header — the mockup's `.hdr`: the page ground at 88% behind a blur,
            closed by one hairline, with the brand at its left and the nav at
            its right.

            NO FORM HERE. The top bar above carries it at every width — see the
            comment there — so the header is the mark and the nav and nothing
            else, which is how the mockup draws it. */}
        <header className="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-4 py-3 sm:px-[22px] sm:py-4">
            <Logo taglineClassName="hidden sm:block" />
            <nav aria-label="Main navigation" className="hidden lg:block">
              <ul className="flex items-center gap-1" role="list">
                {navLinks.map(({ href, label }) =>
                  href === '/casinos' && categoryMenuItems.length > 0 ? (
                    <NavDropdown key={href} label={label} href={href} allLabel={COPY.nav.allCasinos} itemBasePath="/categories" items={categoryMenuItems} triggerClassName={NAV_LINK} {...NAV_PANEL} />
                  ) : href === '/special-offers' && bonusMenuItems.length > 0 ? (
                    <NavDropdown key={href} label={label} href={href} allLabel={COPY.nav.allOffers} itemBasePath="/bonuses" items={bonusMenuItems} triggerClassName={NAV_LINK} {...NAV_PANEL} />
                  ) : (
                    <li key={href}>
                      <Link href={href} className={NAV_LINK}>
                        {label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>



            {/* Below lg the nav strip above is hidden and this menu replaces it. */}
            <MobileNav
              links={navLinks}
              hideFrom="lg"
              groups={{
                '/casinos': { allLabel: COPY.nav.allCasinos, items: categoryMenuItems, itemBasePath: '/categories' },
                '/special-offers': { allLabel: COPY.nav.allOffers, items: bonusMenuItems, itemBasePath: '/bonuses' },
              }}
              theme={NAV_MOBILE}
            />
          </div>
        </header>

        <div className="flex-1">{children}</div>

        {/* Subscribe, a SECOND time, directly above the footer.

            The mockup has only the top bar, and the top bar scrolls away: on
            a page this long, someone who reads to the end has no way in
            without going back up. So the band stays — but quiet, on the
            deeper ground between two hairlines, because the footer below it
            is a third ground again and three loud blocks in a row is how a
            page stops having an ending.

            There is no MARQUEE here. The sibling this was built from runs its
            phrases past on a loop; that is its device, and the whole point of
            eleven domains serving one catalogue is that a reader comparing
            two of them does not meet the same block twice. */}
        {SUBSCRIBE_ENABLED && (
          <section className="mt-[110px] border-y border-line bg-surface" aria-label="Newsletter">
            <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 py-14 sm:px-[22px] md:grid-cols-2">
              <div className="min-w-0">
                <span className="font-mono mb-3 block text-[12.5px] uppercase tracking-[0.14em] text-accent">
                  {COPY.newsletter.bandKicker}
                </span>
                <h2 className="font-display text-[clamp(28px,3.6vw,44px)] text-ink">
                  {COPY.newsletter.bandTitle}
                </h2>
                <p className="mt-3 max-w-[460px] text-[16.5px] text-ink-soft">{COPY.newsletter.bandSubtitle}</p>
              </div>
              {/* `compact` = no intro: the band carries the heading itself. */}
              <NewsletterForm compact className="min-w-0" />
            </div>
          </section>
        )}

        {/* Footer — the mockup's `.ftr`: full bleed and one step DARKER than
            the page (#120A19), carrying the brand and its line, Explore /
            Legal / Policies, the 18+ panel and the legal bar.

            The footer is the mockup's own `.ftr` ground — one step OFF the
            page rather than darker than it, because this page's ground is
            already the darkest value in the palette and there is nothing
            below it to go to. */}
        <footer className="deep-panel text-night-ink">
          <div className="mx-auto max-w-[1200px] px-4 pb-7 pt-[60px] sm:px-[22px]">
            <div className="flex flex-wrap justify-between gap-10">
              <div className="max-w-[360px] flex-[1_1_300px]">
                {/* The Logo component itself, so the mark and wordmark here can
                    never drift from the header's. */}
                <Logo onDark />
                <p className="mt-4 text-[15px] text-night-ink">{COPY.footer.tagline}</p>
                {socialLinks.length > 0 && (
                  <div className="mt-5">
                    <p className={`${FOOTER_HEAD} mb-2.5`}>Follow us</p>
                    <SocialIcons links={socialLinks} onDark />
                  </div>
                )}
              </div>

              <div className="grid flex-[2_1_480px] grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-6">
                <div>
                  <p className={FOOTER_HEAD}>Explore</p>
                  <ul className="mt-2.5 flex flex-col">
                    {navLinks.map(({ href, label }) =>
                      href === '/casinos' && categoryMenuItems.length > 0 ? (
                        <FooterNavGroup key={href} label={label} href={href} allLabel={COPY.nav.allCasinos} itemBasePath="/categories" items={categoryMenuItems} linkClassName={FOOTER_LINK} guideClassName="border-night-line" />
                      ) : href === '/special-offers' && bonusMenuItems.length > 0 ? (
                        <FooterNavGroup key={href} label={label} href={href} allLabel={COPY.nav.allOffers} itemBasePath="/bonuses" items={bonusMenuItems} linkClassName={FOOTER_LINK} guideClassName="border-night-line" />
                      ) : (
                        <li key={href}>
                          <Link href={href} className={FOOTER_LINK}>{label}</Link>
                        </li>
                      ),
                    )}
                    {footerPages(FOOTER_EXPLORE).map(({ slug, label }) => (
                      <li key={slug}><Link href={`/${slug}`} className={FOOTER_LINK}>{label}</Link></li>
                    ))}
                  </ul>
                </div>
                <nav aria-label="Legal">
                  <p className={FOOTER_HEAD}>Legal</p>
                  <ul className="mt-2.5 flex flex-col">
                    {footerPages(FOOTER_LEGAL).map(({ slug, label }) => (
                      <li key={slug}><Link href={`/${slug}`} className={FOOTER_LINK}>{label}</Link></li>
                    ))}
                    <li>
                      <CookieSettingsButton className={FOOTER_LINK} />
                    </li>
                  </ul>
                </nav>
                <nav aria-label="Policies">
                  <p className={FOOTER_HEAD}>Policies</p>
                  <ul className="mt-2.5 flex flex-col">
                    {footerPages(FOOTER_POLICIES).map(({ slug, label }) => (
                      <li key={slug}><Link href={`/${slug}`} className={FOOTER_LINK}>{label}</Link></li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>

            {/* The 18+ mark and the legal line, on one rule — the mockup's
                `.legal`. Not `aria-hidden`: the sentence beside it never says
                the age, so a screen reader needs the "18+" too.

                The mark is the mockup's `.age`, a COMET RING with comet
                numerals set in mono — 6.22:1 on this ground, over the 4.5 the
                figures need and the 3:1 the ring needs. A ring rather than a
                filled disc, because every circle on this site is drawn in line
                rather than fill. */}
            <div className="mt-11 flex flex-wrap items-center justify-between gap-4 border-t border-night-line pt-[22px] text-[14px] text-night-ink">
              <p className="flex min-w-0 flex-[1_1_320px] items-center gap-2.5">
                <span className="font-mono grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full border-[1.5px] border-comet text-[11.5px] font-bold text-comet">18+</span>
                <span>
                  <b className="text-ink">Gamble responsibly.</b> {COPY.footer.disclaimer}
                </span>
              </p>
            </div>

            <div className="font-mono mt-4 flex flex-wrap justify-between gap-3 text-[13px] text-night-muted">
              <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
              {/* Rendered only when an address exists: a freshly cloned site
                  ships with this blank, and an empty <address> is worse than
                  none. `not-italic` is load-bearing — Preflight does not reset
                  the tag's italic default. */}
              {postalAddress !== '' && <address className="not-italic">{postalAddress}</address>}
            </div>
          </div>
        </footer>

        <CookieConsent />
        </ToastProvider>
      </body>
    </html>
  )
}
