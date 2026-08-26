import { motion, useTransform } from 'framer-motion'
import { useSceneOpacity, useSceneLocalProgress } from '../../hooks/useSceneRange'
import { SceneBackdrop } from '../canvas/SceneBackdrop'
import { HeroDust } from '../canvas/HeroDust'
import { rangeProgress, smoothstep, lerp } from '../../lib/scroll3d'
import { sceneRange } from '../../lib/constants'

const RANGE = sceneRange('hero')

export function HeroBackdrop() {
  const opacity = useSceneOpacity(...RANGE, 0.25, false)
  const local = useSceneLocalProgress(...RANGE)
  const scale = useTransform(local, (t) => lerp(1.08, 1.0, smoothstep(t)))
  return (
    <>
      {/* No `glow` bloom here on purpose — the hero is the first scene, with no
          prior scene to cross-fade from, so the bloom just read as a stray
          glowing ring/swirl sitting under the wordmark at page load. */}
      <SceneBackdrop
        opacity={opacity}
        scale={scale}
        videoSrc="/videos/VID_1.mp4"
        gradient="bg-[radial-gradient(ellipse_at_50%_30%,#1a1a20_0%,#0b0b0e_65%)]"
        clear
        playbackRate={0.85}
      />
      <HeroDust local={local} />
    </>
  )
}

export function HeroContent() {
  const opacity = useSceneOpacity(...RANGE, 0.25, false)
  const local = useSceneLocalProgress(...RANGE)

  // Docks the wordmark from center-stage to a top-left mark over the first
  // 40% of the hero scroll, then holds — the indicator reveals once docked.
  const dock = useTransform(local, (t) => smoothstep(rangeProgress(t, 0, 0.4)))
  const titleTop = useTransform(dock, (d) => `${lerp(50, 8, d)}%`)
  const titleLeft = useTransform(dock, (d) => `${lerp(50, 6, d)}%`)
  const titleTranslateX = useTransform(dock, (d) => `${lerp(-50, 0, d)}%`)
  const titleTranslateY = useTransform(dock, (d) => `${lerp(-50, 0, d)}%`)
  // Docked scale is larger than before (0.55 vs. the old 0.4) so the wordmark
  // stays clearly readable once pinned top-left.
  const titleScale = useTransform(dock, (d) => lerp(1, 0.55, d))
  const indicatorOpacity = useTransform(dock, [0.75, 1], [0, 1])

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 h-full w-full">
      <motion.h1
        style={{
          top: titleTop,
          left: titleLeft,
          x: titleTranslateX,
          y: titleTranslateY,
          scale: titleScale,
          transformOrigin: 'top left',
        }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(0,243,255,0.15)',
            '0 0 48px rgba(0,243,255,0.45)',
            '0 0 20px rgba(0,243,255,0.15)',
          ],
        }}
        transition={{ boxShadow: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' } }}
        className="absolute whitespace-nowrap rounded-3xl border border-bone/10 bg-white/[0.04] px-6 py-2 font-display text-[18vw] leading-[0.85] text-transparent backdrop-blur-[4px] [-webkit-text-stroke:1.5px_rgba(245,243,238,0.92)] [text-shadow:0_0_25px_rgba(255,85,0,0.4),0_0_55px_rgba(0,229,255,0.3)] sm:text-[13vw] md:text-[10vw]"
      >
        STAY FIT
      </motion.h1>

      {/* Positioned well clear of the docked title's larger footprint (0.55 scale,
          top-left anchored) so the two never overlap once both are settled. */}
      <motion.div
        style={{ opacity: indicatorOpacity, top: '30%', left: '6%' }}
        className="absolute flex flex-col gap-2"
      >
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-bone/85 sm:text-sm">
          <span className="h-1.5 w-1.5 shrink-0 animate-pulse-slow rounded-full bg-cyan" />
          Open Now &middot; 06:00 AM &ndash; 12:00 AM
        </div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-bone/40">
          Scroll to Explore Zones &darr;
        </div>
      </motion.div>
    </motion.div>
  )
}

export const HERO_RANGE = RANGE
