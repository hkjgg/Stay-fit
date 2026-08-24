import { motion, useTransform } from 'framer-motion'
import { useSceneOpacity, useSceneLocalProgress } from '../../hooks/useSceneRange'
import { SceneBackdrop } from '../canvas/SceneBackdrop'
import { rangeProgress, smoothstep, lerp } from '../../lib/scroll3d'
import { sceneRange } from '../../lib/constants'

const RANGE = sceneRange('fuel')

const PRODUCTS = [
  { name: 'Whey Isolate', blurb: 'Fast-absorbing, 27g protein per scoop' },
  { name: 'Monohydrate Creatine', blurb: 'Pure micronized strength & power' },
  { name: 'Pre-Workout Energy', blurb: 'Clean caffeine + pump complex' },
  { name: 'Custom Cold Shakes', blurb: 'Built to order at the bar' },
]

export function FuelRecoveryBackdrop() {
  const opacity = useSceneOpacity(...RANGE, 0.16)
  return (
    <SceneBackdrop
      opacity={opacity}
      videoSrc="/videos/VID_1.mp4"
      gradient="bg-[radial-gradient(ellipse_at_50%_45%,#062026_0%,#0b0b0e_70%)]"
      glass
    />
  )
}

export function FuelRecoveryContent() {
  const opacity = useSceneOpacity(...RANGE, 0.16)
  const local = useSceneLocalProgress(...RANGE)
  const titleY = useTransform(local, (t) => lerp(30, 0, smoothstep(rangeProgress(t, 0, 0.25))))
  const cardsOpacity = useTransform(local, (t) => smoothstep(rangeProgress(t, 0.15, 0.45)))
  const cardsY = useTransform(local, (t) => lerp(28, 0, smoothstep(rangeProgress(t, 0.15, 0.45))))

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex h-full w-full flex-col items-center justify-between px-6 py-24 text-center md:py-28"
    >
      <div />

      <motion.div style={{ y: titleY }}>
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-soft">
          Fuel &amp; Recovery Hub
        </span>
        <h2 className="font-display text-[10vw] leading-[0.88] text-bone sm:text-[5.5vw] md:text-[4.4vw]">
          PURE FUEL.
          <br />
          <span className="bg-gradient-to-r from-cyan-soft via-cyan to-blue-soft bg-clip-text text-transparent">
            MAXIMUM RECOVERY.
          </span>
        </h2>
      </motion.div>

      <motion.div style={{ opacity: cardsOpacity, y: cardsY }} className="w-full max-w-4xl">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PRODUCTS.map((product) => (
            <motion.div
              key={product.name}
              whileHover={{ y: -6, borderColor: 'rgba(0,229,255,0.6)' }}
              className="glass rounded-xl border border-cyan/15 px-4 py-4 text-left shadow-[0_0_24px_rgba(0,229,255,0.08)] transition"
            >
              <p className="text-sm font-semibold text-bone">{product.name}</p>
              <p className="mt-1 text-xs text-bone/50">{product.blurb}</p>
            </motion.div>
          ))}
        </div>

        <motion.a
          href="#membership"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="animate-pulse-slow relative mt-8 inline-block rounded-full bg-cyan px-8 py-3 text-sm font-semibold uppercase tracking-wide text-obsidian shadow-[0_0_35px_rgba(0,229,255,0.55)]"
        >
          Order at the Bar
        </motion.a>
      </motion.div>
    </motion.div>
  )
}

export const FUEL_RANGE = RANGE
