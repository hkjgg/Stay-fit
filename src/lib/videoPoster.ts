/**
 * Builds a tiny inline-SVG gradient as a `data:` URI for use as a video
 * `poster`.
 *
 * Browsers paint the poster before the first frame decodes, and keep it up if
 * the video never plays at all — which is exactly what happens on iOS Low
 * Power Mode, where autoplay is blocked outright. Without one, those devices
 * get a black rectangle where the footage should be. Generating the poster
 * rather than shipping a JPEG keeps it a few hundred bytes, inlined into the
 * bundle, with no extra network request on the devices least able to afford
 * one.
 */
export function gradientPoster(from: string, to: string) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9" preserveAspectRatio="none">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>` +
    `</linearGradient></defs>` +
    `<rect width="16" height="9" fill="url(#g)"/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/** Per-zone poster gradients, keyed to each scene's existing color grade so the
 *  fallback reads as an intentional backdrop rather than a missing asset. */
export const POSTERS = {
  /** Heavy Lifting — cold steel blue. */
  iron: gradientPoster('#16223d', '#0b0b0e'),
  /** Cardio & Kinetic — warm ember. */
  pulse: gradientPoster('#3a1d0d', '#0b0b0e'),
  /** Fuel & Recovery — deep teal. */
  fuel: gradientPoster('#07242b', '#0b0b0e'),
  /** Hero — neutral obsidian. */
  hero: gradientPoster('#1c1c22', '#0b0b0e'),
} as const
