import { motion, useTransform, type MotionValue } from 'framer-motion'
import { ScrollSceneProvider, useScrollScene } from '../../hooks/useScrollScenes'
import { HeroBackdrop, HeroContent } from './Hero'
import { HeavyLiftingBackdrop, HeavyLiftingContent } from './HeavyLifting'
import { CardioBackdrop, CardioContent } from './Cardio'
import { FuelRecoveryBackdrop, FuelRecoveryContent } from './FuelRecovery'
import { SCENES } from '../../lib/constants'
import { rangeProgress, smoothstep, lerp } from '../../lib/scroll3d'

function ProgressDot({ progress, range }: { progress: MotionValue<number>; range: [number, number] }) {
  const mid = (range[0] + range[1]) / 2
  const dotOpacity = useTransform(progress, (p) =>
    p <= mid
      ? lerp(0.3, 1, smoothstep(rangeProgress(p, range[0], mid)))
      : lerp(1, 0.3, smoothstep(rangeProgress(p, mid, range[1]))),
  )
  const dotScale = useTransform(progress, (p) =>
    p <= mid
      ? lerp(0.6, 1.4, smoothstep(rangeProgress(p, range[0], mid)))
      : lerp(1.4, 0.6, smoothstep(rangeProgress(p, mid, range[1]))),
  )
  return (
    <motion.span
      style={{ opacity: dotOpacity, scale: dotScale }}
      className="h-2.5 w-2.5 rounded-full bg-bone"
    />
  )
}

function ProgressRail() {
  const { progress } = useScrollScene()
  return (
    <div className="pointer-events-none absolute right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-4 md:flex lg:right-8">
      {SCENES.map((scene) => (
        <ProgressDot key={scene.id} progress={progress} range={scene.range} />
      ))}
    </div>
  )
}

function StageContent() {
  return (
    <div className="sticky top-0 z-0 h-screen w-full overflow-hidden bg-obsidian">
      <HeroBackdrop />
      <HeavyLiftingBackdrop />
      <CardioBackdrop />
      <FuelRecoveryBackdrop />
      <HeroContent />
      <HeavyLiftingContent />
      <CardioContent />
      <FuelRecoveryContent />
      <ProgressRail />
      <div className="noise-overlay" />
    </div>
  )
}

export function ScrollStory() {
  return (
    <ScrollSceneProvider>
      <StageContent />
    </ScrollSceneProvider>
  )
}
