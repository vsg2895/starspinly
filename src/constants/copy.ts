/**
 * All user-facing and SEO-facing wording for this site.
 *
 * The KEY STRUCTURE is identical across every site in the network — same
 * groups, same keys, same order — so the apps stay interchangeable and a
 * component written for one works on all of them.
 *
 * The WORDS are deliberately unique to this site. That is not decoration: the
 * brands are separate domains serving the same catalogue, and if they shipped
 * the same titles, descriptions and headings, Google would treat them as
 * duplicate content and suppress all but one. Every string that reaches a
 * <title>, a meta description, an <h1>/<h2> or a JSON-LD field must therefore
 * read differently here than on the sibling sites.
 *
 * starspinly's angle: APPARENT MAGNITUDE IS NOT ABSOLUTE MAGNITUDE. The number
 * on a casino's banner is how bright it LOOKS from where you are standing, and
 * that is mostly a function of how hard it is being marketed at you. What it
 * actually is — the position it holds once every operator is measured the same
 * way, from the same distance, against the same fixed reference — is a
 * different number, and nothing on an operator's own site will ever tell you
 * it. This site does one thing: it puts every casino on one chart, with one
 * scale, and re-surveys it every week. A loud bonus and a good casino are two
 * different measurements, and a chart is the only thing that can tell them
 * apart.
 *
 * Its siblings answer the neighbouring questions — affliliate decodes an offer
 * in MONEY, slottering reads the SLOT rules, bettingbetway ranks CASINOS on
 * their terms, bonanzasmile names the CATCH, gladjackpot asks how the money
 * gets OUT, luckycatsmile argues LUCK IS THE WRONG WORD, spinsunny moves the
 * small print INTO DAYLIGHT — and none of them may be echoed. The nearest
 * neighbours are luckycatsmile and spinsunny, and the lines hold: one argues
 * about WHICH numbers decide a casino and one about WHEN you are allowed to
 * see them, where this one is about the only thing neither covers — that a
 * number means nothing until it is measured against the same reference as
 * every other number beside it.
 *
 * ── Three lines this file does not cross ────────────────────────────────────
 * 1. The mockup's lead says "we sign up, deposit, play and cash out at every
 *    casino we list", its offers section says "from casinos we've tested", and
 *    its FAQ promises "the times we observed". NONE OF IT SHIPS, in any
 *    wording: nothing in this project records a funded account, a played bonus
 *    or a timed withdrawal, and a review site inventing its own test results is
 *    the one failure that cannot be walked back. What the site can honestly say
 *    is that it measures every operator the same way against what each one
 *    publishes — which is a stronger claim than a vague one about testing,
 *    because a reader can check it.
 * 2. The mockup also sells "casinos and sportsbooks". The API serves casinos,
 *    so every line here says casinos.
 * 3. The mockup prints a "Min. deposit" and an "Avg. payout time" per casino,
 *    per picks row and in its review panel. There is no column for either, so
 *    no wording promises one; those slots carry the rating and the regions,
 *    which are real.
 */
export const COPY = {
  // SEO identity. These three reach the <title>, the meta description and the
  // keywords tag on EVERY page that does not set its own — which is most of
  // them — so they are the strings most likely to be read as duplicate content
  // if a sibling domain ships the same words.
  site: {
    titleTail: 'Casinos on One Chart',
    description:
      'measures every casino it lists the same way, against the same fixed reference, and re-surveys the chart every week — so a loud bonus and a good casino stop looking like the same thing.',
    keywords: [
      'online casinos compared side by side',
      'casino ranking methodology',
      'how casino bonuses compare',
      'licensed online casinos ranked',
      'independent casino comparison',
    ],
  },
  nav: {
    casinos: 'Casinos',
    // The page lists every visible bonus, flat and ungrouped, so the menu says
    // what is behind it. winpalack keeps "Special Offers": its page is the
    // grouped bonus-area view and is a different thing.
    specialOffers: 'Bonuses',
    categories: 'Categories',
    // First row inside the header and footer dropdowns: the parent's own page.
    allCasinos: 'All Casinos',
    allOffers: 'All Offers',
  },
  home: {
    bonus: 'Bonuses',
    seeMore: 'See more',
    seeAllBonuses: 'Show all',
    /**
     * The VISIBLE heading over the bonus-type row.
     *
     * The row used to carry no heading at all — the chips were taken to
     * speak for themselves. They do not: arriving mid-page at a band of
     * unlabelled buttons between the hero and the casino list, there is
     * nothing saying what the set IS, and nothing a screen reader can
     * announce for the landmark beyond a generic label nobody wrote for
     * this page.
     *
     * Worded differently on every domain, like every other <h2> here:
     * eleven sites serve one catalogue, and a shared heading is
     * duplicate content.
     */
    bonusTypesTitle: 'Browse by bonus type',
    // The mockup's two coordinates above the hero heading, which is the one
    // place this design says what it is. The number is the week's survey, not
    // a count of anything — the mockup's own "Sky chart № 47" with a figure
    // that would have to be invented, so it says the thing that is true.
    heroEyebrow: 'One scale · Re-surveyed weekly',
    // Split in three so the JSX can set the middle phrase in gold, which is
    // the hero's whole device.
    heroHeadline: 'Every casino on',
    heroHighlight: 'one chart.',
    heroHeadlineTail: '',
    heroSubtitle:
      'The number on a casino’s banner is how bright it looks from where you are standing, and that is mostly a measure of how hard it is being marketed. We plot every operator we list against the same fixed reference — the wagering, the limits, the terms and the licence, read the same way for all of them — so what a casino actually is stops being a matter of who shouted loudest.',
    podiumAll: 'See full rankings',
    topCasinosTitle: 'Casinos, plotted',
    topCasinosSubtitle: 'The whole field on one scale, ordered by where each operator lands on it. Filter by category.',
    featuredCasinos: 'See top casinos',
    specialOffers: 'Browse bonuses',
    viewAll: 'View all',
    // Leads the home <title>; the year and brand are appended in page.tsx.
    homeTitle: 'Online Casinos Measured On One Scale',
    faqTitle: 'Frequently asked questions',
    faqSubtitle: 'What we measure, what we will not claim, and how a casino moves on the chart.',
    metaDescription:
      'Online casinos plotted on a single scale — the wagering, the limits, the terms and the licence, read the same way for every operator and re-surveyed every week.',
    // ── The "How a casino is placed" band ─────────────────────────────────
    // Three steps, numbered, because they ARE a sequence: each one happens
    // after the one before it. Numbering a set that is not ordered is
    // decoration; numbering this one is information.
    methodTitle: 'How a casino gets its position',
    methodSubtitle: 'Three passes, the same three for every operator, in this order.',
    methodSteps: [
      {
        no: '01',
        verb: 'Sight',
        title: 'The licence, before anything else',
        body:
          'Which authority the operator names, what that authority actually requires of it, and whether there is a free dispute service behind the claim. An operator that names no regulator does not get a position on the chart at all — it gets the bottom of it.',
      },
      {
        no: '02',
        verb: 'Measure',
        title: 'The same four figures, every time',
        body:
          'The wagering multiplier and what it applies to, the ceiling on a withdrawal, the window the cashier page commits to, and the expiry on the offer. Read from the operator’s own pages, recorded in the same units, so two casinos can be set beside each other and mean the same thing.',
      },
      {
        no: '03',
        verb: 'Re-survey',
        title: 'Weekly, and after any change',
        body:
          'Terms are revised quietly and offers lapse without an announcement. The chart is re-read every week: lapsed bonuses come off it, rewritten terms are measured again from the top, and a casino moves when its own pages move — up as readily as down.',
      },
    ],
    methodLabel: 'Method',
    // Under the three stages: the cycle closes back on the first.
    methodLoop: 'And back to the first sighting whenever an operator rewrites its terms',
    // ── The hero's reading panel ─────────────────────────────────────────
    // The mockup prints a payout time and a minimum deposit beside each pick.
    // Neither exists in the API, so the panel says what IS being read.
    meterLabel: 'This week’s reading',
    meterScope: 'Brightest three',
    meterNote: 'Position on the chart, not the size of the banner.',
  },
  casinos: {
    pageTitle: 'The Whole Chart',
    pageDescription:
      'Every casino we list, each shown with the bonus it is running, the figures its own pages publish, and where that places it against the rest of the field.',
    // H2 over the offers block on a casino page. The literal 'Special Offers'
    // was hardcoded in the component on all six sites — an identical H2 on
    // every review page in the network.
    offersHeading: 'Bonuses Running Here',
    // Tail of the summary-panel H2: `{casino.name} at a glance`.
    glanceHeadingTail: 'at a glance',
    moreHeading: 'Others on the same chart',
    reviewTitleTail: 'Terms, Limits And Licence',
    reviewSignature: 'Every figure here read from this operator’s own terms and banking pages, in the same units as every other casino on the chart.',
    reviewSummary: 'measured on the same scale as every other operator here — the wagering, the limits, the terms and the regulator, read from its own pages rather than its banner.',
    // The badge on the leading casino card. A PHRASE, not a numeral: the list
    // order already is the ranking, and a "1" on every card invites reading it
    // as a score. The mockup's own wording.
    topPick: 'Brightest pick',
    visitCasino: 'Open Casino',
    readReview: 'Read review',
    rating: 'Star score',
    noResults: 'No casinos match this filter yet. Try another category.',
  },
  /**
   * The page behind one bonus type (/bonuses/[slug]).
   *
   * `metaSuffix` is appended to the type's name when the admin wrote no
   * description, so the meta line is still specific to the page rather than
   * boilerplate shared by eight of them.
   */
  bonusCategory: {
    metaSuffix: 'every bonus of this kind on the chart right now, with whose offer it is and the terms that decide what it is actually worth.',
    countOne: 'offer',
    countMany: 'offers',
  },

  specialOffers: {
    pageTitle: 'Every Bonus On The Chart',
    pageDescription:
      'Every bonus in one place, each with the casino behind it and the wagering, the cap and the expiry recorded wherever the operator states them.',
    // Appended to an offer's (shared) bonus text so the sibling sites do not
    // ship an identical meta description for the same offer.
    offerMetaSuffix: 'Read from the operator’s own terms page before it went on the chart.',
    claim: 'Claim Bonus',
    noResults: 'No bonuses to show right now.',
  },
  categories: {
    pageTitle: 'Casinos By Category',
    pageDescription: 'The same three passes behind every list — pick the category you came for.',
    // Meta-description tail for a single category page. Category records are
    // shared master data, so this is what keeps the nine sites distinct there.
    categoryMetaSuffix: 'measured on one scale: the wagering, the limits, the terms and the licence, read the same way for every operator in the group.',
    noResults: 'Nothing to show here yet.',
  },
  newsletter: {
    title: 'Star alerts.',
    subtitle: 'One email a week: what moved on the chart, and whose terms moved under it.',
    placeholder: 'Your email address',
    button: 'Subscribe',
    // The two halves of the line beside the TOP BAR's field — the mockup's own
    // "Star alerts · New casinos and rising bonuses, once a week." Split so
    // the lead can take the gold while the rest stays in the reading grey.
    barLead: 'Star alerts',
    barTail: 'New casinos and rising bonuses, once a week.',
    // The quiet band above the footer — the site's second capture point, so
    // its heading is a real <h2> rather than the form's own label.
    bandKicker: 'Weekly survey',
    bandTitle: 'One email when the chart moves.',
    bandSubtitle: 'New reviews, the bonuses worth claiming this week, and every change of position — one short email, no filler.',
    // Shown while the address is being checked. The subscribe request waits on
    // a live address-validation call, so the button has to say so rather than
    // just dimming for a second or two.
    checking: 'Checking…',
    // The spam line is NOT optional wording. This is a double opt-in list: an
    // unconfirmed subscriber never receives anything again, and the verify mail
    // is the single most likely message to be filtered — new sender, one link,
    // no history. Telling people where to look is the difference between a
    // signup and a dead row.
    success:
      'Nearly there — check your inbox and confirm your address to finish. '
      + 'If nothing arrives, it may be sitting in spam or junk.',
    // Shown when the API reports email_sent=false — the site is still
    // collecting addresses but its sending is switched off in the admin.
    // Promising an inbox (and a spam folder to search) for mail that will
    // never arrive is worse than not collecting the address at all.
    successNoEmail:
      'You’re on the list. We are not sending confirmation emails from this site at the moment.',
    error: 'That did not send. Please try again.',
  },
  footer: {
    // Short brand blurb in the footer's first column. The mockup gives that
    // column 1.6fr of a four-track grid — roughly 360px — so this runs to two
    // or three lines there by design, unlike the two-column siblings where the
    // same string had to stay on one.
    tagline:
      'Independent casino reviews and rankings, measured on one scale from each operator’s own terms and banking pages. We may earn a commission from links on this site; it never changes a score or a position.',
    // Registered postal address, shown beside the copyright line. A physical
    // address in the footer is what mailbox providers and the gambling
    // affiliate compliance checks both look for, and it must match the address
    // used in the email templates.
    //
    // Supplied 2026-11-23, and written to this site's `registered_address`
    // in the same change (`php artisan sites:set-legal-identity <slug>
    // --address=...`). THE TWO MUST STAY IDENTICAL: that column is what the
    // legal pages and the email templates print, and two different addresses
    // for one brand is a compliance problem, not a typo. The footer omits the
    // whole <address> element while this is blank, which is why it was.
    postalAddress: '44 Chestnut Road, Cambridge, CB4 1XY, United Kingdom',
    disclaimer:
      'Gambling is for adults aged 18 or over and carries real financial risk. Set deposit limits, never chase losses, and only stake what you can afford to lose.',
  },
  errors: {
    notFound: 'That page is not here.',
    apiError: 'Could not load this content. Please try again in a moment.',
  },
  reviews: {
    heading: 'What Players Report',
    empty: 'No reports yet — be the first to say how it went.',
    formTitle: 'Add Your Report',
    formIntro: 'Your report appears on this page as soon as you post it.',
    nameLabel: 'Your name',
    emailLabel: 'Email (optional, never published)',
    ratingLabel: 'Rating',
    titleLabel: 'Headline (optional)',
    bodyLabel: 'Your report',
    namePlaceholder: 'First name or nickname',
    emailPlaceholder: 'you@example.com',
    titlePlaceholder: 'One line on whether it matched what was advertised',
    bodyPlaceholder: 'How did it actually go — wagering, cap, verification, withdrawal?',
    submit: 'Post Report',
    // Two outcomes, because the site can run pre- or post-moderation
    // (Sites -> Publish reviews immediately). The API reports which one
    // applied; promising the wrong one is a promise the page then breaks.
    success: 'Thanks — your report is now live. Scroll up to see it.',
    successPending: 'Thanks — your report has been submitted and will appear once approved.',
    error: 'That did not send. Please check the form and try again.',
    ratingSummary: (avg: number, total: number) =>
      `${avg.toFixed(1)} out of 5 from ${total} ${total === 1 ? 'report' : 'reports'}`,
  },
  // Labels on the phone-only hide / show toggle above each chip list.
  collapse: {
    casinoCategories: 'Casino categories',
    bonusTypes: 'Bonus types',
  },
} as const
