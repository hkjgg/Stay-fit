import { useEffect, useState } from 'react'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import { useSceneOpacity, useSceneLocalProgress } from '../../hooks/useSceneRange'
import { SceneBackdrop } from '../canvas/SceneBackdrop'
import { rangeProgress, smoothstep, lerp, edgeGlow } from '../../lib/scroll3d'
import { sceneRange } from '../../lib/constants'

const RANGE = sceneRange('cardio')
const STATS = [
  { label: 'Treadmills & Bikes', value: '20+' },
  { label: 'HIIT Circuits / wk', value: '12' },
]
const LIME = '#39ff14'
const CYAN = '#00f3ff'
const BASE_BPM = 160

export function CardioBackdrop() {
  const opacity = useSceneOpacity(...RANGE)
  const local = useSceneLocalProgress(...RANGE)
  const scale = useTransform(local, (t) => lerp(1.08, 1.0, smoothstep(t)))
  const glow = useTransform(local, (t) => edgeGlow(t))
  return (
    <SceneBackdrop
      opacity={opacity}
      scale={scale}
      glow={glow}
      videoSrc="/videos/VID_1.mp4"
      gradient="bg-[radial-gradient(ellipse_at_80%_50%,#331a0d_0%,#0b0b0e_70%)]"
    />
  )
}

interface GalleryTileProps {
  local: MotionValue<number>
  objectPosition: string
  delay: number
  glowColor: string
  className?: string
}

/** One tile in the kinetic gallery: a cropped, looping slice of real
 *  high-energy floor footage standing in for the old audio-waveform mesh. */
function GalleryTile({ local, objectPosition, delay, glowColor, className = '' }: GalleryTileProps) {
  const reveal = useTransform(local, (t) => smoothstep(rangeProgress(t, delay, delay + 0.35)))
  const scale = useTransform(reveal, (r) => lerp(0.9, 1, r))
  const y = useTransform(reveal, (r) => `${lerp(14, 0, r)}%`)

  return (
    <motion.div
      style={{ opacity: reveal, scale, y, borderColor: `${glowColor}55`, boxShadow: `0 0 32px ${glowColor}33` }}
      className={`relative overflow-hidden rounded-2xl border ${className}`}
    >
      <video
        className="h-full w-full object-cover contrast-125 saturate-125 brightness-90"
        style={{ objectPosition }}
        src="/videos/VID_1.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-obsidian/10" />
    </motion.div>
  )
}

function KineticGallery({ local }: { local: MotionValue<number> }) {
  return (
    <div className="hidden w-full max-w-md grid-cols-2 gap-4 md:grid">
      <GalleryTile local={local} objectPosition="30% 40%" delay={0} glowColor={CYAN} className="aspect-3/4" />
      <div className="grid gap-4 pt-10">
        <GalleryTile local={local} objectPosition="65% 25%" delay={0.12} glowColor={LIME} className="aspect-square" />
        <GalleryTile local={local} objectPosition="50% 75%" delay={0.24} glowColor={CYAN} className="aspect-video" />
      </div>
    </div>
  )
}

/** Live BPM readout in a glowing frosted-glass card — small jitter around
 *  160 BPM makes the number read as a real-time pulse rather than a static stat. */
function BpmCard() {
  const [bpm, setBpm] = useState(BASE_BPM)

  useEffect(() => {
    const id = setInterval(() => {
      setBpm(BASE_BPM + Math.round((Math.random() - 0.5) * 6))
    }, 900)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      className="glass ml-auto flex items-center gap-4 rounded-2xl border border-lime/30 px-5 py-4"
      style={{ boxShadow: `0 0 30px ${LIME}30` }}
    >
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-60" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-lime" />
      </span>
      <div className="text-right">
        <div className="font-display text-4xl leading-none text-lime" style={{ textShadow: `0 0 24px ${LIME}80` }}>
          {bpm}
        </div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-bone/50">Live Avg. BPM</div>
      </div>
    </div>
  )
}

export function CardioContent() {
  const opacity = useSceneOpacity(...RANGE)
  const local = useSceneLocalProgress(...RANGE)
  const x = useTransform(local, (t) => lerp(60, 0, smoothstep(rangeProgress(t, 0, 0.3))))

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex h-full w-full items-center justify-between gap-10 px-8 md:px-20"
    >
      <KineticGallery local={local} />

      <motion.div style={{ x }} className="ml-auto max-w-xl shrink-0 text-right">
        <span
          className="glass mb-4 inline-flex items-center gap-2 rounded-full border border-orange/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-orange-soft"
          style={{ boxShadow: `0 0 18px ${CYAN}33` }}
        >
          Cardio &amp; Kinetic Zone
        </span>
        <h2
          className="font-display text-[11vw] leading-[0.88] text-bone sm:text-[6vw] md:text-[5vw]"
          style={{ textShadow: `0 0 40px ${LIME}25` }}
        >
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

        <div className="mt-8 flex flex-col items-end gap-3">
          <BpmCard />
          <div className="flex gap-3">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="glass rounded-xl border border-orange/25 px-4 py-3 text-right"
              >
                <div className="font-display text-3xl text-orange-soft">{s.value}</div>
                <div className="text-xs uppercase tracking-wide text-bone/50">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export const CARDIO_RANGE = RANGE
