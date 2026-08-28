import { useIsMobile } from '../../hooks/useIsMobile'

/**
 * Edge-weighted obsidian tint + blur (reaching black/50 at the extreme
 * edges, fully transparent through the center) layered over every video in
 * the app. Softens the footage for a calmer read and obscures any burned-in
 * watermark or social-app end-frame — those sit at the edges of
 * stock/social clips almost without exception — without smearing or
 * darkening the middle of the frame where the actual content needs to stay
 * legible (the hero in particular is meant to read as crystal clear).
 *
 * The blur radius drops sharply on phones: a full-bleed backdrop-filter over
 * playing video is one of the most expensive things a mobile GPU can be asked
 * to do, and the masking effect survives the reduction fine.
 */
export function WatermarkMask() {
  const isMobile = useIsMobile()
  const blur = isMobile ? 3 : 10
  const fade = 'radial-gradient(ellipse at center, transparent 45%, black 100%)'

  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.5) 100%)' }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          maskImage: fade,
          WebkitMaskImage: fade,
        }}
      />
    </>
  )
}
