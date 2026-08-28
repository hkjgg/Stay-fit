/**
 * Edge-weighted obsidian tint + blur (reaching black/50 at the extreme
 * edges, fully transparent through the center) layered over every video in
 * the app. Softens the footage for a calmer, more luxury read and obscures
 * any burned-in watermark or social-app end-frame — those sit at the edges
 * of stock/social clips almost without exception — without smearing or
 * darkening the middle of the frame where the actual content needs to stay
 * legible (the hero in particular is meant to read as crystal clear).
 */
export function WatermarkMask() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.5) 100%)' }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          maskImage: 'radial-gradient(ellipse at center, transparent 45%, black 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 45%, black 100%)',
        }}
      />
    </>
  )
}
