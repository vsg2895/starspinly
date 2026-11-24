/**
 * Frequently asked questions for this site.
 *
 * Rendered VISIBLY on the home page and emitted as FAQPage structured data from
 * this same array. Google requires the two to match; markup-only FAQ is a
 * guidelines violation, which is why the page maps over this constant rather
 * than duplicating the text.
 *
 * The wording is unique to this site: these answers are indexable page content,
 * and they are exactly the kind of text an answer engine quotes. Here they
 * argue one thing — that a figure means nothing on its own, only against the
 * same reference every other figure beside it was measured from, and that the
 * whole job is holding that reference still. Its siblings answer the
 * neighbouring questions (affliliate: what an offer is worth in money;
 * slottering: the slot rules; bettingbetway: which casino to trust;
 * bonanzasmile: the catch in a bonus; gladjackpot: how the money gets out;
 * luckycatsmile: that luck is the wrong word; spinsunny: when you get to read
 * the small print) and none of them may be echoed.
 *
 * NOTHING BELOW CLAIMS A FIGURE THIS SITE CANNOT SHOW. The mockup's FAQ opens
 * with "we open real accounts, deposit, claim the bonus and request a
 * withdrawal" and closes with "we publish the times we observed". Neither
 * ships, in any wording: nothing in this project records a funded account or a
 * timed payment. The second question below is asked precisely so the answer can
 * say so outright, and the last one answers the payout question honestly, by
 * naming whose commitment the figure actually is.
 */
export const FAQ_ITEMS = [
  {
    question: 'How do you rank casinos?',
    answer:
      'By measuring the same four things for every operator and letting the comparison do the ranking. Which regulator the licence names; the wagering multiplier and what it is applied to; the ceiling on a withdrawal and the window the cashier page commits to; and the expiry on the offer. Recorded in the same units from each operator’s own pages, so that two casinos set side by side are actually being compared rather than just listed together.',
  },
  {
    question: 'Do you actually play at these casinos?',
    answer:
      'No, and we will not print a figure we did not measure. Everything here is read from what the operator publishes — the terms page, the banking page, the licence — and quoted so it can be checked against the source. A comparison site that claims its own deposits and withdrawals is asking to be believed about the one thing nobody can verify, and a chart that cannot be checked is just an opinion with gridlines.',
  },
  {
    question: 'Why does a bigger bonus not mean a better position?',
    answer:
      'Because the size of a bonus is how bright it looks from where you are standing, and that is mostly a measure of how hard it is being marketed. A 400% offer behind a 50x wagering requirement on deposit plus bonus, capped at £100 and expiring in seven days, is a smaller thing than a 100% offer at 25x on the bonus alone with ninety days to clear it. The headline is the only part of that designed to be read quickly. Position is what is left once the rest is measured.',
  },
  {
    question: 'What makes one wagering requirement worse than another?',
    answer:
      'The multiplier is only half of it. 30x on the bonus alone and 30x on deposit plus bonus are different obligations behind the same number, and a requirement that excludes the games with the best published returns is harder than it looks. A low multiplier beside a seven-day expiry can be worse than a high one with ninety days. We record the multiplier, what it applies to, which games count and how long you have, because the combination is the offer.',
  },
  {
    question: 'Why does the licence decide so much here?',
    answer:
      'Because it decides what happens when something goes wrong. A licence names the body you can complain to, the rules the operator agreed to follow and, in most jurisdictions, a free dispute service that can order a payment. Without one there is no route at all beyond the operator’s own support desk, and no figure on the rest of the chart is worth much. We name the regulator on every review so the claim can be checked rather than taken on trust.',
  },
  {
    question: 'Do you earn money from these links?',
    answer:
      'Yes. We may earn a commission when someone signs up through a link on this site, and that is how it is funded. It does not buy a position: every operator is measured the same way against the same reference, and a casino that quietly tightens its terms moves down the chart whether or not it pays us.',
  },
] as const
