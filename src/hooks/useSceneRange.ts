import { useTransform } from 'framer-motion'
import { useScrollScene } from './useScrollScenes'
import { rangeProgress, smoothstep } from '../lib/scroll3d'

/**
 * Maps the global scene-wrapper progress (0-1) into a local 0-1 progress
 * for a single scene's [start, end] window, clamped outside that window.
 *
 * Uses the function-callback form of useTransform (a plain per-frame JS
 * computation) rather than the keyframe-array form: dozens of these hooks
 * across the page all subscribe to the same shared `progress` MotionValue,
 * and the array form's internal "accelerate" fast path does not correctly
 * isolate multiple concurrent subscribers on one source value in the
 * installed framer-motion version — it was observed bleeding a *different*
 * transform's keyframes into this one. The callback form has no such path.
 */
export function useSceneLocalProgress(start: number, end: number) {
  const { progress } = useScrollScene()
  return useTransform(progress, (p) => rangeProgress(p, start, end))
}

/**
 * Content fade helper: fades in over the first `edge` fraction of the
 * scene window and fades out over the last `edge` fraction. Pass
 * `fadeIn: false` for the very first scene, which is already fully on
 * screen at page load and shouldn't require scrolling to appear.
 */
export function useSceneOpacity(start: number, end: number, edge = 0.18, fadeIn = true) {
  const { progress } = useScrollScene()
  const span = end - start
  const fadeInEnd = start + span * edge
  const fadeOutStart = end - span * edge

  return useTransform(progress, (p) => {
    if (p <= start) return fadeIn ? 0 : 1
    if (p < fadeInEnd) return fadeIn ? smoothstep(rangeProgress(p, start, fadeInEnd)) : 1
    if (p <= fadeOutStart) return 1
    if (p < end) return smoothstep(1 - rangeProgress(p, fadeOutStart, end))
    return 0
  })
}
