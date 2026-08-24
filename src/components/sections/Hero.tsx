import { motion, useTransform } from 'framer-motion'
import { useSceneOpacity, useSceneLocalProgress } from '../../hooks/useSceneRange'
import { SceneBackdrop } from '../canvas/SceneBackdrop'
import { rangeProgress, smoothstep, lerp, edgeGlow } from '../../lib/scroll3d'
import { sceneRange } from '../../lib/constants'

const RANGE = sceneRange('hero')

export function HeroBackdrop() {
  const opacity = useSceneOpacity(...RANGE, 0.25, false)
  const local = useSceneLocalProgress(...RANGE)
  const scale = useTransform(local, (t) => lerp(1.08, 1.0, smoothstep(t)))
  const glow = useTransform(local, (t) => edgeGlow(t))
  return (
    <SceneBackdrop
      opacity={opacity}
      scale={scale}
      glow={glow}
      videoSrc="/videos/VID_1.mp4"
      gradient="bg-[radial-gradient(ellipse_at_50%_30%,#1a1a20_0%,#0b0b0e_65%)]"
    />
  )
}

export function HeroContent() {
  const opacity = useSceneOpacity(...RANGE, 0.25, false)
  const local = useSceneLocalProgress(...RANGE)
  const titleY = useTransform(local, (t) => lerp(30, 0, smoothstep(rangeProgress(t, 0, 0.3))))

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex h-full w-full flex-col items-center justify-center px-6 text-center"
    >
      <motion.div
        style={{ y: titleY }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <h1 className="font-display mix-blend-overlay text-[18vw] leading-[0.85] text-bone sm:text-[13vw] md:text-[10vw]">
          STAY FIT
        </h1>
        <p className="mix-blend-overlay mt-4 text-xs font-semibold uppercase tracking-[0.5em] text-bone sm:text-sm">
          Borj El Barajneh
        </p>
      </motion.div>
    </motion.div>
  )
}

export const HERO_RANGE = RANGE
