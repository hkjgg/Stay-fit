import { useEffect, useRef } from 'react'
import { motion, useMotionValueEvent, type MotionValue } from 'framer-motion'

interface SceneBackdropProps {
  opacity: MotionValue<number>
  videoSrc: string
  gradient: string
  className?: string
  /** Frosts the video/gradient with a backdrop-blurred glass panel (glassmorphism zones). */
  glass?: boolean
}

/**
 * Looping video layer with a themed gradient fallback underneath (shown
 * automatically if the video file is missing/unavailable) and a dark scrim
 * on top so the 3D model and typography painted above it stay legible.
 * Rendered BEHIND the shared 3D canvas — never wraps foreground content,
 * since animating `opacity` here creates a CSS stacking context that would
 * otherwise trap children in front of the canvas.
 *
 * Every scene's backdrop stays mounted for the whole pinned scroll (so
 * cross-fades never pop), but only one is ever fully visible at a time —
 * so playback is gated on `opacity` rather than left on `autoPlay`. With
 * five of these sharing just two source videos, letting all of them decode
 * continuously would be wasted work fighting the "smooth" scroll goal.
 */
export function SceneBackdrop({ opacity, videoSrc, gradient, className = '', glass = false }: SceneBackdropProps) {
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
    <motion.div style={{ opacity }} className={`absolute inset-0 ${className}`}>
      <div className={`absolute inset-0 ${gradient}`} />
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-luminosity"
        src={videoSrc}
        loop
        muted
        playsInline
        preload="metadata"
      />
      {glass && <div className="absolute inset-0 bg-obsidian/20 backdrop-blur-2xl" />}
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-obsidian/70" />
      <div className="absolute inset-0 bg-obsidian/25" />
    </motion.div>
  )
}
