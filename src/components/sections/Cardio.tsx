import { motion, useTransform } from 'framer-motion'
import { useSceneOpacity, useSceneLocalProgress } from '../../hooks/useSceneRange'
import { SceneBackdrop } from '../canvas/SceneBackdrop'
import { rangeProgress, smoothstep, lerp } from '../../lib/scroll3d'
import { sceneRange } from '../../lib/constants'

const RANGE = sceneRange('cardio')
const STATS = [
  { label: 'Treadmills & Bikes', value: '20+' },
  { label: 'HIIT Circuits / wk', value: '12' },
  { label: 'Avg. Heart-Rate Zone', value: '160bpm' },
]

export function CardioBackdrop() {
  const opacity = useSceneOpacity(...RANGE)
  return (
    <SceneBackdrop
      opacity={opacity}
      videoSrc="/videos/cardio.mp4"
      gradient="bg-[radial-gradient(ellipse_at_80%_50%,#331a0d_0%,#0b0b0e_70%)]"
    />
  )
}

export function CardioContent() {
  const opacity = useSceneOpacity(...RANGE)
  const local = useSceneLocalProgress(...RANGE)
  const x = useTransform(local, (t) => lerp(60, 0, smoothstep(rangeProgress(t, 0, 0.3))))

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex h-full w-full items-center justify-end px-8 text-right md:px-20"
    >
      <motion.div style={{ x }} className="max-w-xl">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange/40 bg-orange/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-orange-soft">
          Cardio &amp; Kinetic Zone
        </span>
        <h2 className="font-display text-[11vw] leading-[0.88] text-bone sm:text-[6vw] md:text-[5vw]">
          CHASE THE
          <br />
          <span className="bg-gradient-to-r from-orange to-orange-soft bg-clip-text text-transparent">
            PULSE.
          </span>
        </h2>
        <p className="mt-6 ml-auto max-w-md text-bone/60">
          Treadmill rows, kinetic HIIT circuits, and heart-rate synced classes that turn
          every rep into a data point — fast, loud, and built for speed.
        </p>
        <div className="mt-8 flex justify-end gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-right">
              <div className="font-display text-3xl text-orange-soft">{s.value}</div>
              <div className="text-xs uppercase tracking-wide text-bone/50">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export const CARDIO_RANGE = RANGE
