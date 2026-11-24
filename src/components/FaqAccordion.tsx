type Item = { readonly question: string; readonly answer: string }

/**
 * The home FAQ, from sites/starspinly.html (`.faq` / `.fq`): a FLIGHT LOG.
 * One column of rows parted by hairlines, each opening on a mono question
 * number — Q.01, Q.02 — with the question beside it and a ringed plus mark at
 * the right that rotates 45° into a cross and fills GOLD.
 *
 * Rules rather than cards, which is the mockup's own `.faq` / `.fq` pair: the
 * list is closed at the top by a border on the container and at the bottom by
 * one per row. Nothing here is a panel, so there is no card to stretch and no
 * `self-start` to write.
 *
 * One column, not the siblings' two: the mockup puts this section in its
 * `.narrow` 820px track, and these answers run to four or five lines each —
 * two columns of them at 1200px would set a wall of small text across the full
 * width, which is the one place on the page that wants to be read rather than
 * scanned.
 *
 * The question is set in INSTRUMENT SANS, not the display face. Unbounded is a
 * geometric display type with almost no contrast: it carries a four-word
 * heading and defeats a nine-word question, and the mockup makes the same
 * exception here (`.fq summary h3{font-family:var(--body)}`).
 *
 * THE NUMBERS ARE GENERATED, not stored in the FAQ constant — they are a
 * position in a list, and a question moved in that file must not carry a stale
 * "Q.03" with it.
 *
 * The mark is drawn from two pseudo-elements rather than a "+" character. A
 * glyph's cross-bar sits off-centre in most faces, which is invisible until it
 * rotates 45° and the × comes out lopsided. The rotation and the fill are
 * `.pm` in globals.css, driven by `details[open]`.
 *
 * Native `<details>`, no client state: every answer is in the server HTML,
 * open or closed — which the FAQPage schema built from the same array needs.
 * `[&::-webkit-details-marker]:hidden` and `list-none` drop the browser's own
 * triangle so only this mark shows.
 */
export default function FaqAccordion({ items }: { items: readonly Item[] }) {
  return (
    <div className="max-w-[860px] border-t border-line">
      {items.map((item, i) => (
        <details key={item.question} open={i === 0} className="group border-b border-line">
          <summary className="grid cursor-pointer list-none grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-4 px-1 py-6 [&::-webkit-details-marker]:hidden sm:grid-cols-[60px_minmax(0,1fr)_auto]">
            <span aria-hidden className="font-mono text-[13px] text-muted group-open:text-brand">
              Q.{String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="text-[18px] font-semibold leading-[1.3] text-ink transition-colors [overflow-wrap:anywhere] group-hover:text-brand sm:text-[20px]">
              {item.question}
            </h3>
            {/* Decoration: the <summary> already announces its own state. */}
            <span
              aria-hidden
              className="pm relative grid h-[38px] w-[38px] flex-none place-items-center rounded-full text-ink
                before:absolute before:h-[1.5px] before:w-3.5 before:rounded-sm before:bg-current before:content-['']
                after:absolute after:h-[1.5px] after:w-3.5 after:rotate-90 after:rounded-sm after:bg-current after:content-['']"
            />
          </summary>
          {/* Indented to the question's left edge on a wide screen, nearly
              flush on a phone — the mockup's own `.fq p{padding-left:80px}`
              with its 56px override, because 80px of indent on a 320px column
              would leave the answer in a gutter. */}
          <p className="px-1 pb-[26px] pl-[56px] text-[16px] leading-[1.7] text-ink-soft sm:pl-20 sm:pr-[60px] sm:text-[16.5px]">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  )
}
