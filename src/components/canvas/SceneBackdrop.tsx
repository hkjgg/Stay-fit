import { motion, type MotionValue } from 'framer-motion'

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
 */
export function SceneBackdrop({ opacity, videoSrc, gradient, className = '', glass = false }: SceneBackdropProps) {
  return (
    <motion.div style={{ opacity }} className={`absolute inset-0 ${className}`}>
      <div className={`absolute inset-0 ${gradient}`} />
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-luminosity"
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="none"
      />
      {glass && <div className="absolute inset-0 bg-obsidian/20 backdrop-blur-2xl" />}
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-obsidian/70" />
      <div className="absolute inset-0 bg-obsidian/25" />
    </motion.div>
  )
}
