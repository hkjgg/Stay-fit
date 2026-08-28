import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useTransform } from 'framer-motion'
import { useSceneOpacity, useSceneLocalProgress } from '../../hooks/useSceneRange'
import { SceneBackdrop } from '../canvas/SceneBackdrop'
import { HeroDust } from '../canvas/HeroDust'
import { rangeProgress, smoothstep, lerp } from '../../lib/scroll3d'
import { sceneRange } from '../../lib/constants'

const RANGE = sceneRange('hero')
const CYAN = '#00f3ff'
const SUBHEADS = ['MAXIMUM POWER', 'ULTIMATE TECH', 'PURE ATHLETICS']

/** Cycles through the sub-headlines with a subtle expanding accent line
 *  that redraws on each flip, directly under the docked wordmark. */
function SubheadCycler() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SUBHEADS.length), 2600)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex items-center gap-3">
      <motion.span
        key={`line-${index}`}
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 28, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="h-px shrink-0 bg-cyan"
        style={{ boxShadow: `0 0 8px ${CYAN}` }}
      />
      <div className="relative h-[1.4em] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={SUBHEADS[index]}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="block whitespace-nowrap text-xs font-semibold uppercase tracking-[0.25em] text-cyan-soft"
          >
            {SUBHEADS[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  )
}

export function HeroBackdrop() {
  const opacity = useSceneOpacity(...RANGE, 0.25, false)
  const local = useSceneLocalProgress(...RANGE)
  const scale = useTransform(local, (t) => lerp(1.08, 1.0, smoothstep(t)))
  return (
    <>
      {/* No `glow` bloom here on purpose — the hero is the first scene, with no
          prior scene to cross-fade from, so the bloom just read as a stray
          glowing ring/swirl sitting under the wordmark at page load. */}
      <SceneBackdrop
        opacity={opacity}
        scale={scale}
        videoSrc="/videos/VID_1.mp4"
        gradient="bg-[radial-gradient(ellipse_at_50%_30%,#1a1a20_0%,#0b0b0e_65%)]"
        clear
      />
      <HeroDust local={local} />
    </>
  )
}

export function HeroContent() {
  const opacity = useSceneOpacity(...RANGE, 0.25, false)
  const local = useSceneLocalProgress(...RANGE)

  // Docks the wordmark from center-stage to the upper-center of the screen
  // (top: 20%, still horizontally centered) over the first 40% of the hero
  // scroll, then holds — the indicator reveals once docked. Left/x/y stay
  // constant throughout since the wordmark is centered both before and
  // after docking; only `top` (and scale) actually animate.
  const dock = useTransform(local, (t) => smoothstep(rangeProgress(t, 0, 0.4)))
  const titleTop = useTransform(dock, (d) => `${lerp(50, 20, d)}%`)
  // Docked scale is larger than a corner mark would need, since the title
  // stays centered with room either side rather than being squeezed into a
  // left margin.
  const titleScale = useTransform(dock, (d) => lerp(1, 0.55, d))
  const subheadOpacity = useTransform(dock, [0.55, 0.85], [0, 1])
  const indicatorOpacity = useTransform(dock, [0.8, 1], [0, 1])

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 h-full w-full">
      <motion.h1
        style={{
          top: titleTop,
          left: '50%',
          x: '-50%',
          y: '-50%',
          scale: titleScale,
        }}
        animate={{
          textShadow: [
            '0 0 18px rgba(0,243,255,0.35), 0 0 42px rgba(0,243,255,0.15)',
            '0 0 34px rgba(0,243,255,0.8), 0 0 72px rgba(0,243,255,0.4)',
            '0 0 18px rgba(0,243,255,0.35), 0 0 42px rgba(0,243,255,0.15)',
          ],
        }}
        transition={{ textShadow: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' } }}
        className="absolute whitespace-nowrap rounded-3xl border border-bone/10 bg-white/[0.04] px-6 py-2 font-display text-[clamp(2.5rem,15vw,9rem)] leading-[0.85] text-transparent shadow-[0_0_24px_rgba(0,243,255,0.15)] backdrop-blur-[4px] [-webkit-text-stroke:1.5px_rgba(245,243,238,0.92)]"
      >
        STAY FIT
      </motion.h1>

      {/* Middle: neon line + sub-text cycler, centered under the docked title
          with clear margin (title's docked box bottom sits well above 27%). */}
      <motion.div
        style={{ opacity: subheadOpacity, top: '27%', left: '50%', x: '-50%' }}
        className="absolute"
      >
        <SubheadCycler />
      </motion.div>

      {/* Bottom: generously spaced below the sub-text row, and the only other
          element left in the hero besides the wordmark and its cycler — no
          secondary floating text tags (the old "Open Now" line) cluttering
          the frame.

          `whitespace-nowrap` matters here: the pill is absolutely positioned at
          left:50%, so its shrink-to-fit width is capped at half the container —
          on a phone that wrapped the label onto three lines. */}
      <motion.div
        style={{
          opacity: indicatorOpacity,
          top: '40%',
          left: '50%',
          x: '-50%',
          boxShadow: `0 0 26px ${CYAN}40`,
        }}
        className="absolute flex items-center gap-2 whitespace-nowrap rounded-full border border-cyan/40 bg-white/[0.06] px-3 py-2 backdrop-blur-sm sm:px-4 md:backdrop-blur-md"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-bone sm:text-[11px] sm:tracking-[0.3em]">
          Scroll to Explore Zones
        </span>
        <motion.span
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className="text-cyan"
          style={{ textShadow: `0 0 10px ${CYAN}` }}
        >
          &darr;
        </motion.span>
      </motion.div>
    </motion.div>
  )
}

export const HERO_RANGE = RANGE
