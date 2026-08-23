export function clamp01(v: number) {
  return Math.min(1, Math.max(0, v))
}

/** Local 0-1 progress of `p` within [start, end], clamped. */
export function rangeProgress(p: number, start: number, end: number) {
  if (end === start) return p >= end ? 1 : 0
  return clamp01((p - start) / (end - start))
}

export function smoothstep(x: number) {
  const t = clamp01(x)
  return t * t * (3 - 2 * t)
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

/**
 * 0-1 visibility for a scene window, fading in over the first `edge`
 * fraction and out over the last. Pass `fadeIn: false` for a scene that
 * starts at global progress 0 (already fully visible at page load).
 */
export function sceneVisibility(
  p: number,
  range: [number, number],
  { edge = 0.18, fadeIn = true }: { edge?: number; fadeIn?: boolean } = {},
) {
  const [start, end] = range
  const span = end - start
  const inEdge = start + span * edge
  const outEdge = end - span * edge

  if (p <= start) return fadeIn ? 0 : 1
  if (p < inEdge) return fadeIn ? smoothstep(rangeProgress(p, start, inEdge)) : 1
  if (p <= outEdge) return 1
  if (p < end) return smoothstep(1 - rangeProgress(p, outEdge, end))
  return 0
}
