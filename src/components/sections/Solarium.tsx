import { motion, useTransform } from 'framer-motion'
import { useSceneOpacity, useSceneLocalProgress } from '../../hooks/useSceneRange'
import { SceneBackdrop } from '../canvas/SceneBackdrop'
import { rangeProgress, smoothstep, lerp } from '../../lib/scroll3d'
import { sceneRange } from '../../lib/constants'

const RANGE = sceneRange('solarium')

export function SolariumBackdrop() {
  const opacity = useSceneOpacity(...RANGE, 0.22)
  return (
    <SceneBackdrop
      opacity={opacity}
      videoSrc="/videos/VID_2.mp4"
      gradient="bg-[radial-gradient(ellipse_at_50%_60%,#0d1a33_0%,#1a0d05_55%,#0b0b0e_85%)]"
    />
  )
}

export function SolariumContent() {
  const opacity = useSceneOpacity(...RANGE, 0.22)
  const local = useSceneLocalProgress(...RANGE)
  const y = useTransform(local, (t) => lerp(40, 0, smoothstep(rangeProgress(t, 0, 0.3))))

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex h-full w-full flex-col items-center justify-end px-6 pb-20 text-center md:pb-28"
    >
      <motion.div style={{ y }} className="max-w-xl">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-bone/25 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-bone/80">
          Solarium &amp; Recovery
        </span>
        <h2 className="font-display text-[11vw] leading-[0.88] text-bone sm:text-[6vw] md:text-[5vw]">
          GLOW. RECOVER.
          <br />
          <span className="bg-gradient-to-r from-blue-soft via-bone to-orange-soft bg-clip-text text-transparent">
            REPEAT.
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-md text-bone/60">
          Step into the VIP UV Solarium suite — full-body glow sessions paired with
          recovery lounges to bring your body back online after every session.
        </p>
        <a
          href="#membership"
          className="mt-8 inline-block rounded-full border border-bone/30 bg-gradient-to-r from-blue/20 to-orange/20 px-7 py-3 text-sm font-semibold uppercase tracking-wide text-bone backdrop-blur transition hover:scale-105 hover:border-bone/60"
        >
          Reserve VIP Solarium
        </a>
      </motion.div>
    </motion.div>
  )
}

export const SOLARIUM_RANGE = RANGE
