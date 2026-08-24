import { motion, useTransform } from 'framer-motion'
import { useSceneOpacity, useSceneLocalProgress } from '../../hooks/useSceneRange'
import { SceneBackdrop } from '../canvas/SceneBackdrop'
import { rangeProgress, smoothstep, lerp } from '../../lib/scroll3d'
import { sceneRange } from '../../lib/constants'

const RANGE = sceneRange('heavy')
const FEATURES = ['Olympic Platforms', 'Free Weights to 50kg', 'Power Racks & Chains', 'Bodycore Coaching']

export function HeavyLiftingBackdrop() {
  const opacity = useSceneOpacity(...RANGE)
  return (
    <SceneBackdrop
      opacity={opacity}
      videoSrc="/videos/VID_2.mp4"
      gradient="bg-[radial-gradient(ellipse_at_20%_50%,#0d1a33_0%,#0b0b0e_70%)]"
    />
  )
}

export function HeavyLiftingContent() {
  const opacity = useSceneOpacity(...RANGE)
  const local = useSceneLocalProgress(...RANGE)
  const x = useTransform(local, (t) => lerp(-60, 0, smoothstep(rangeProgress(t, 0, 0.3))))

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 flex h-full w-full items-center px-8 md:px-20">
      <motion.div style={{ x }} className="max-w-xl">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue/40 bg-blue/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-blue-soft">
          Heavy Lifting Zone
        </span>
        <h2 className="font-display text-[11vw] leading-[0.88] text-bone sm:text-[6vw] md:text-[5vw]">
          BUILT ON
          <br />
          <span className="bg-gradient-to-r from-blue-soft to-blue bg-clip-text text-transparent">IRON.</span>
        </h2>
        <p className="mt-6 max-w-md text-bone/60">
          Bodycore strength training on Olympic platforms with power racks, chain-loaded
          presses, and heavy-duty plates built for real progressive overload.
        </p>
        <ul className="mt-8 grid grid-cols-2 gap-3">
          {FEATURES.map((f) => (
            <li
              key={f}
              className="flex items-center gap-2 rounded-lg border border-blue/15 bg-blue/5 px-3 py-2 text-sm text-bone/80"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-soft" />
              {f}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  )
}

export const HEAVY_RANGE = RANGE
