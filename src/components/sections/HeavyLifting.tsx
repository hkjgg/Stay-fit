import { motion, useTransform, type MotionValue } from 'framer-motion'
import { useSceneOpacity, useSceneLocalProgress } from '../../hooks/useSceneRange'
import { SceneBackdrop } from '../canvas/SceneBackdrop'
import { DynamicVideo } from '../canvas/DynamicVideo'
import { useIsMobile } from '../../hooks/useIsMobile'
import { rangeProgress, smoothstep, lerp, edgeGlow } from '../../lib/scroll3d'
import { sceneRange } from '../../lib/constants'
import { POSTERS } from '../../lib/videoPoster'

const RANGE = sceneRange('heavy')
const FEATURES = ['Olympic Platforms', 'Free Weights to 50kg', 'Power Racks & Chains', 'Bodycore Coaching']
const LIME = '#39ff14'
const CYAN = '#00f3ff'
/** High-contrast black-and-steel grade for this zone's footage. */
const STEEL_FILTER = 'contrast-125 grayscale-[35%] brightness-75'

export function HeavyLiftingBackdrop() {
  const opacity = useSceneOpacity(...RANGE)
  const local = useSceneLocalProgress(...RANGE)
  const scale = useTransform(local, (t) => lerp(1.08, 1.0, smoothstep(t)))
  const glow = useTransform(local, (t) => edgeGlow(t))
  return (
    <SceneBackdrop
      opacity={opacity}
      scale={scale}
      glow={glow}
      videoSrc="/videos/VID_2.mp4"
      gradient="bg-[radial-gradient(ellipse_at_20%_50%,#0d1a33_0%,#0b0b0e_70%)]"
      poster={POSTERS.iron}
      frameOffset={2}
    />
  )
}

interface ShowcasePanelProps {
  local: MotionValue<number>
  videoSrc: string
  objectPosition: string
  parallax: [number, number]
  glowColor: string
  delay: number
  frameOffset: number
}

/** One vertical tile in the split-screen showcase: a cropped, looping slice of
 *  real gym footage that drifts on its own scroll-parallax offset and carries
 *  a neon rim border — a real-footage stand-in for the old power-rack mesh. */
function ShowcasePanel({
  local,
  videoSrc,
  objectPosition,
  parallax,
  glowColor,
  delay,
  frameOffset,
}: ShowcasePanelProps) {
  const reveal = useTransform(local, (t) => smoothstep(rangeProgress(t, delay, delay + 0.35)))
  const y = useTransform(local, (t) => `${lerp(parallax[0], parallax[1], t)}%`)
  const scale = useTransform(reveal, (r) => lerp(0.92, 1, r))

  return (
    <motion.div
      style={{ opacity: reveal, scale, y, borderColor: `${glowColor}55`, boxShadow: `0 0 32px ${glowColor}33` }}
      className="relative aspect-3/4 w-full overflow-hidden rounded-2xl border"
    >
      <DynamicVideo
        videoSrc={videoSrc}
        frameOffset={frameOffset}
        filterClassName={STEEL_FILTER}
        poster={POSTERS.iron}
        objectPosition={objectPosition}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-transparent to-obsidian/20" />
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl mix-blend-screen"
        style={{ boxShadow: `inset 0 0 40px ${glowColor}22` }}
      />
    </motion.div>
  )
}

/** Interactive split-screen showcase: three real-footage tiles standing in for
 *  the old power-rack/barbell mesh, each with its own parallax drift and frame
 *  offset so the shared source clip reads differently in each. */
function ShowcaseGrid({ local }: { local: MotionValue<number> }) {
  const isMobile = useIsMobile()
  const videoSrc = '/videos/VID_2.mp4'

  // Skipped entirely on phones rather than hidden with `display:none` — a
  // mounted <video> still fetches and decodes, so hiding it would keep paying
  // for three clips nobody can see.
  if (isMobile) return null

  return (
    <div className="hidden w-full max-w-md grid-cols-2 gap-4 md:grid">
      <div className="col-span-1 grid gap-4">
        <ShowcasePanel
          local={local}
          videoSrc={videoSrc}
          objectPosition="15% 20%"
          parallax={[6, -6]}
          glowColor={CYAN}
          delay={0}
          frameOffset={0}
        />
        <ShowcasePanel
          local={local}
          videoSrc={videoSrc}
          objectPosition="70% 60%"
          parallax={[-4, 8]}
          glowColor={LIME}
          delay={0.12}
          frameOffset={1.5}
        />
      </div>
      <div className="col-span-1 grid pt-10">
        <ShowcasePanel
          local={local}
          videoSrc={videoSrc}
          objectPosition="45% 85%"
          parallax={[10, -10]}
          glowColor={CYAN}
          delay={0.22}
          frameOffset={3}
        />
      </div>
    </div>
  )
}

export function HeavyLiftingContent() {
  const opacity = useSceneOpacity(...RANGE)
  const local = useSceneLocalProgress(...RANGE)
  const x = useTransform(local, (t) => lerp(-60, 0, smoothstep(rangeProgress(t, 0, 0.3))))

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex h-full w-full items-center justify-between gap-10 px-4 md:px-20"
    >
      <motion.div style={{ x }} className="w-full max-w-xl md:shrink-0">
        <span
          className="glass mb-4 inline-flex items-center gap-2 rounded-full border border-blue/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-blue-soft"
          style={{ boxShadow: `0 0 18px ${CYAN}33` }}
        >
          Heavy Lifting Zone
        </span>
        <h2
          className="font-display text-[clamp(2rem,8vw,4.5rem)] leading-[0.88] text-bone"
          style={{ textShadow: `0 0 40px ${CYAN}25` }}
        >
          BUILT ON
          <br />
          <span className="bg-gradient-to-r from-blue-soft to-blue bg-clip-text text-transparent">IRON.</span>
        </h2>
        <p className="mt-6 max-w-md text-bone/60">
          Bodycore strength training on Olympic platforms with power racks, chain-loaded
          presses, and heavy-duty plates built for real progressive overload.
        </p>
        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <li
              key={f}
              className="glass flex items-center gap-2 rounded-lg border border-blue/25 px-3 py-2 text-sm text-bone/80 transition"
              style={{ boxShadow: `0 0 14px ${LIME}1a` }}
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-soft" />
              {f}
            </li>
          ))}
        </ul>
      </motion.div>

      <ShowcaseGrid local={local} />
    </motion.div>
  )
}

export const HEAVY_RANGE = RANGE
