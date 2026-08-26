import { useEffect, useRef } from 'react'
import { motion, useMotionValueEvent, type MotionValue } from 'framer-motion'

interface SceneBackdropProps {
  opacity: MotionValue<number>
  /** Parallax dolly: video scales down from ~1.08 to 1.0 across the scene. */
  scale: MotionValue<number>
  /** 0-1 cyan glow intensity, peaking during cross-fades at the scene edges. Omit to
   *  skip the bloom layer entirely (the hero has no prior scene to cross-fade from). */
  glow?: MotionValue<number>
  videoSrc: string
  gradient: string
  className?: string
  /** Frosts the video/gradient with a backdrop-blurred glass panel (glassmorphism zones). */
  glass?: boolean
  /** Skips the heavy cinematic scrim stack for an ultra-clear video read (Hero), keeping
   *  only a thin obsidian vignette at the extreme edges so the center stays fully transparent. */
  clear?: boolean
  /** Playback speed — a touch of slow motion reads as higher production value than 1x raw
   *  footage. Varying this per section (alongside frameOffset) keeps two shared source
   *  clips from feeling identical everywhere they're reused. */
  playbackRate?: number
  /** Seconds to seek into the clip on load, so different sections open on a different
   *  frame of the same source video instead of all starting in lockstep. */
  frameOffset?: number
}

/**
 * Looping video layer with a themed gradient fallback underneath (shown
 * automatically if the video file is missing/unavailable), a cinematic
 * color-grade pass, and a dark scrim on top so the 3D model and typography
 * painted above it stay legible. Rendered BEHIND the shared 3D canvas —
 * never wraps foreground content, since animating `opacity` here creates a
 * CSS stacking context that would otherwise trap children in front of the
 * canvas.
 *
 * Every scene's backdrop stays mounted for the whole pinned scroll (so
 * cross-fades never pop), but only one is ever fully visible at a time —
 * so playback is gated on `opacity` rather than left on `autoPlay`. With
 * four of these sharing just two source videos, letting all of them decode
 * continuously would be wasted work fighting the "smooth" scroll goal.
 */
export function SceneBackdrop({
  opacity,
  scale,
  glow,
  videoSrc,
  gradient,
  className = '',
  glass = false,
  clear = false,
  playbackRate = 0.85,
  frameOffset = 0,
}: SceneBackdropProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const playing = useRef(false)

  const syncPlayback = (v: number) => {
    const video = videoRef.current
    if (!video) return
    if (v > 0.02 && !playing.current) {
      playing.current = true
      video.play().catch(() => {})
    } else if (v <= 0.02 && playing.current) {
      playing.current = false
      video.pause()
    }
  }

  // `change` only fires on subsequent updates, so a scene whose opacity is
  // already nonzero at mount (the hero, visible with no scroll yet) needs
  // this once up front too.
  useEffect(() => {
    syncPlayback(opacity.get())
  }, [opacity])

  useMotionValueEvent(opacity, 'change', syncPlayback)

  return (
    <motion.div style={{ opacity }} className={`absolute inset-0 overflow-hidden ${className}`}>
      <div className={`absolute inset-0 ${gradient}`} />
      <motion.video
        ref={videoRef}
        style={{ scale }}
        onLoadedMetadata={(e) => {
          const v = e.currentTarget
          v.playbackRate = playbackRate
          if (frameOffset > 0 && frameOffset < (v.duration || Infinity)) {
            v.currentTime = frameOffset
          }
        }}
        className={`absolute inset-0 h-full w-full object-cover ${clear ? 'opacity-100' : 'opacity-60 mix-blend-luminosity'}`}
        src={videoSrc}
        loop
        muted
        playsInline
        preload="metadata"
      />

      {clear ? (
        // Ultra-thin obsidian vignette at the extreme edges only — center stays fully clear
        // so the video (heavy gym machinery in action) reads with no visual obstruction.
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_72%,rgba(11,11,14,0.6)_100%)]" />
      ) : (
        <>
          {/* Cinematic grade: radial obsidian vignette (multiply) + soft warm grade pass. */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(11,11,14,0.95)_100%)] mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-br from-obsidian/50 via-transparent to-obsidian/60 mix-blend-soft-light" />

          {glass && <div className="absolute inset-0 bg-obsidian/20 backdrop-blur-2xl" />}
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-obsidian/70" />
          <div className="absolute inset-0 bg-obsidian/25" />
        </>
      )}

      {/* Transition glow: soft cyan bloom that pulses in during scene cross-fades. */}
      {glow && (
        <motion.div
          style={{ opacity: glow }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.35),transparent_65%)] blur-3xl"
        />
      )}
    </motion.div>
  )
}
