import { ImageResponse } from 'next/og'
import { SHARE_IMAGE_ALT } from '@/lib/seo'

/**
 * Dynamic Open Graph / Twitter card image.
 *
 * Until now no og:image existed anywhere while twitter:card was set to
 * `summary_large_image`, so every share of these pages rendered as an empty
 * card — the single most visible SEO/social gap on the site. Generating it here
 * means it can never drift out of sync with the site name, and needs no binary
 * asset committed to the repo.
 *
 * Next.js links this file automatically on the home page only. Every other
 * page sets its own `openGraph`, which REPLACES the layout's (metadata
 * merges shallowly) and drops this card — so those pages restate it via
 * `SHARE_IMAGES` in lib/seo, which also holds the alt text below.
 */
export const alt = SHARE_IMAGE_ALT
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/** The three plotted dots, at the same rank-is-radius rule the hero uses. */
const DOTS = [
  { x: 744, y: 196, r: 11, color: '#ffd86b' },
  { x: 430, y: 236, r: 9, color: '#f4efe3' },
  { x: 968, y: 118, r: 9, color: '#b9a6ff' },
]

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          // The page ground. The STARFIELD is not reproduced: it is four
          // 1px radial gradients on a 220px tile, and Satori rasterises each
          // one into a visible grey square rather than a point. Three plotted
          // dots carry the idea better at card size anyway, which is what the
          // hero's chart does with them too.
          background: '#0a0d22',
          color: '#f4efe3',
          fontFamily: 'sans-serif',
        }}
      >
        {/* The plot. Absolutely placed rather than drawn in SVG, because
            Satori renders a div with a border-radius more predictably than it
            renders an inline <svg> with filters — and a glow here is a second
            ring, not a blur. */}
        {DOTS.map((d) => (
          <div
            key={d.x}
            style={{
              display: 'flex',
              position: 'absolute',
              left: d.x - d.r,
              top: d.y - d.r,
              width: d.r * 2,
              height: d.r * 2,
              borderRadius: d.r,
              background: d.color,
              boxShadow: `0 0 0 ${d.r}px rgba(255,255,255,0.08)`,
            }}
          />
        ))}

        <div
          style={{
            display: 'flex',
            fontSize: 24,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: '#7fe3d6',
            border: '1px solid #3a4385',
            borderRadius: 999,
            padding: '12px 30px',
            fontFamily: 'monospace',
          }}
        >
          One scale · Re-surveyed weekly
        </div>
        {/* Satori needs an EXPLICIT display on any element with more than one
            child — the wordmark is two coloured spans, so this one says flex
            rather than relying on the browser default it never sees. */}
        <div
          style={{
            display: 'flex',
            fontSize: 98,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginTop: 28,
            padding: '0 60px',
          }}
        >
          {/* One word in two colours, so the two spans must touch exactly.
              Gold is 13.98:1 on this ground and carries text in both
              directions, which is why it needs no deeper variant here. */}
          <span>star</span><span style={{ color: '#ffd86b' }}>spinly</span>
        </div>
        <div style={{ display: 'flex', fontSize: 26, marginTop: 28, color: '#a9aed3', fontFamily: 'monospace' }}>
          18+ · Gamble responsibly
        </div>
      </div>
    ),
    size,
  )
}
