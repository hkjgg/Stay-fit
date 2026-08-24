import { motion, useTransform } from 'framer-motion'
import { useSceneOpacity, useSceneLocalProgress } from '../../hooks/useSceneRange'
import { SceneBackdrop } from '../canvas/SceneBackdrop'
import { rangeProgress, smoothstep, lerp } from '../../lib/scroll3d'
import { sceneRange } from '../../lib/constants'

const RANGE = sceneRange('hero')

export function HeroBackdrop() {
  const opacity = useSceneOpacity(...RANGE, 0.25, false)
  return (
    <SceneBackdrop
      opacity={opacity}
      videoSrc="/videos/VID_1.mp4"
      gradient="bg-[radial-gradient(ellipse_at_50%_30%,#1a1a20_0%,#0b0b0e_65%)]"
    />
  )
}

export function HeroContent() {
  const opacity = useSceneOpacity(...RANGE, 0.25, false)
  const local = useSceneLocalProgress(...RANGE)
  const titleY = useTransform(local, (t) => lerp(40, 0, smoothstep(rangeProgress(t, 0, 0.3))))

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex h-full w-full flex-col items-center justify-center px-6 text-center"
    >
      <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange/40 bg-orange/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-orange-soft">
        Stay Fit Fitness Center &middot; Borj El Barajneh
      </span>

      <motion.h1 style={{ y: titleY }} className="font-display leading-[0.85] text-[15vw] sm:text-[11vw] md:text-[9vw]">
        <span className="block text-bone">STAY FIT</span>
      </motion.h1>

      <p className="font-display mt-3 text-[6vw] leading-none text-transparent sm:text-[3.4vw] md:text-[2.4vw]">
        <span className="text-outline">SORE TODAY, </span>
        <span className="bg-gradient-to-r from-orange to-blue bg-clip-text text-transparent">
          STRONG TOMORROW
        </span>
      </p>

      <p className="mt-6 max-w-md text-sm text-bone/60 sm:text-base">
        Heavy lifting, kinetic cardio, and VIP solarium recovery — one obsidian-dark
        floor built for people who train like it matters.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <a
          href="#membership"
          className="rounded-full bg-orange px-7 py-3 text-sm font-semibold uppercase tracking-wide text-obsidian shadow-[0_0_30px_rgba(255,85,0,0.45)] transition hover:scale-105 hover:shadow-[0_0_45px_rgba(255,85,0,0.65)]"
        >
          Book a Free Tour
        </a>
        <a
          href="#reels"
          className="rounded-full border border-bone/25 px-7 py-3 text-sm font-semibold uppercase tracking-wide text-bone/90 backdrop-blur transition hover:border-blue hover:text-blue-soft"
        >
          Watch Inside
        </a>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 flex flex-col items-center gap-2 text-bone/40"
      >
        <span className="text-[10px] uppercase tracking-[0.35em]">Scroll</span>
        <div className="h-9 w-[1px] bg-gradient-to-b from-bone/60 to-transparent" />
      </motion.div>
    </motion.div>
  )
}

export const HERO_RANGE = RANGE
