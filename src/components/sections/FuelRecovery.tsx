import { motion, useTransform } from 'framer-motion'
import { useSceneOpacity, useSceneLocalProgress } from '../../hooks/useSceneRange'
import { SceneBackdrop } from '../canvas/SceneBackdrop'
import { rangeProgress, smoothstep, lerp, edgeGlow } from '../../lib/scroll3d'
import { sceneRange } from '../../lib/constants'

const RANGE = sceneRange('fuel')
const RIM_CYAN = '#00f3ff'

const PRODUCTS = [
  { name: 'PR Lifestyle Micro Creatine', blurb: 'Pure micronized strength & power' },
  { name: 'BPI Sports Vegan Protein', blurb: '27g plant-based protein per scoop' },
  { name: 'Pre-Workout Energy', blurb: 'Clean caffeine + pump complex' },
  { name: 'Custom Cold Shakes', blurb: 'Built to order at the bar' },
]

export function FuelRecoveryBackdrop() {
  const opacity = useSceneOpacity(...RANGE, 0.16)
  const local = useSceneLocalProgress(...RANGE)
  const scale = useTransform(local, (t) => lerp(1.08, 1.0, smoothstep(t)))
  // Entering the Protein Bar gets the most dramatic glow: a stronger, wider pulse.
  const glow = useTransform(local, (t) => Math.min(1, edgeGlow(t, 0.3) * 1.3))
  return (
    <SceneBackdrop
      opacity={opacity}
      scale={scale}
      glow={glow}
      videoSrc="/videos/VID_2.mp4"
      gradient="bg-[radial-gradient(ellipse_at_50%_45%,#062026_0%,#0b0b0e_70%)]"
      glass
    />
  )
}

export function FuelRecoveryContent() {
  const opacity = useSceneOpacity(...RANGE, 0.16)
  const local = useSceneLocalProgress(...RANGE)
  const titleX = useTransform(local, (t) => lerp(-30, 0, smoothstep(rangeProgress(t, 0, 0.25))))
  const cardsOpacity = useTransform(local, (t) => smoothstep(rangeProgress(t, 0.15, 0.45)))
  const cardsX = useTransform(local, (t) => lerp(-24, 0, smoothstep(rangeProgress(t, 0.15, 0.45))))

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex h-full w-full flex-col justify-center px-6 py-24 md:px-14 md:py-28"
    >
      {/* Left column: heading + glassmorphic spec cards. Right side is left clear
          for the 3D counter + product models rendered behind this content. */}
      <div className="flex w-full max-w-xl flex-col items-start text-left">
        <motion.div style={{ x: titleX }}>
          <span
            className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] backdrop-blur-md"
            style={{ borderColor: `${RIM_CYAN}66`, color: RIM_CYAN, background: 'rgba(255,255,255,0.03)' }}
          >
            Fuel &amp; Recovery Hub
          </span>
          <h2 className="font-display text-[11vw] leading-[0.9] text-bone sm:text-[6vw] md:text-[3.6vw]">
            RECOVERY
            <br />
            &amp; FUEL
            <br />
            <span className="bg-gradient-to-r from-cyan-soft via-cyan to-blue-soft bg-clip-text text-transparent">
              STATION
            </span>
          </h2>
        </motion.div>

        <motion.div style={{ opacity: cardsOpacity, x: cardsX }} className="mt-10 w-full">
          <div className="grid grid-cols-2 gap-3">
            {PRODUCTS.map((product) => (
              <motion.div
                key={product.name}
                whileHover={{ y: -6, borderColor: `${RIM_CYAN}99` }}
                className="rounded-xl border px-4 py-4 backdrop-blur-md transition"
                style={{
                  borderColor: `${RIM_CYAN}40`,
                  background: 'rgba(255,255,255,0.03)',
                  boxShadow: `0 0 24px ${RIM_CYAN}22`,
                }}
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
      </div>
    </motion.div>
  )
}

export const FUEL_RANGE = RANGE
