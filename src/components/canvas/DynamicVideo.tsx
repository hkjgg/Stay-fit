import { useEffect, useRef } from 'react'
import { WatermarkMask } from './WatermarkMask'

interface DynamicVideoProps {
  videoSrc: string
  /** Playback speed for this instance — slowed to a calm, luxury 0.75x by default. */
  playbackRate?: number
  /** Seconds to seek into the clip on load, so two tiles sharing one source
   *  file don't open on the same frame. */
  frameOffset?: number
  /** Tailwind filter utilities (contrast/grayscale/saturate/brightness/etc.)
   *  forming this instance's color-grade preset. */
  filterClassName?: string
  objectPosition?: string
  className?: string
}

/**
 * Shared looping video primitive for the split-screen showcase, kinetic
 * gallery, and reels carousel — each instance points at its own source,
 * frame offset, and filter grade so sections reusing the same two physical
 * clips still read as visually distinct footage. Always carries the shared
 * watermark mask so no video in the app renders without it.
 *
 * Playback is gated on intersection rather than left on `autoPlay`: the reels
 * carousel alone mounts six of these, and decoding all of them at once (most
 * scrolled out of view) is the main source of stutter on phones. Each clip
 * plays only while it's actually on screen.
 */
export function DynamicVideo({
  videoSrc,
  playbackRate = 0.75,
  frameOffset = 0,
  filterClassName = '',
  objectPosition,
  className = '',
}: DynamicVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    // Without IntersectionObserver support, fall back to always playing.
    if (typeof IntersectionObserver === 'undefined') {
      video.play().catch(() => {})
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { rootMargin: '100px' },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <video
        ref={ref}
        className={`absolute inset-0 h-full w-full object-cover ${filterClassName} ${className}`}
        style={objectPosition ? { objectPosition } : undefined}
        src={videoSrc}
        loop
        muted
        playsInline
        preload="metadata"
        onLoadedMetadata={(e) => {
          const v = e.currentTarget
          v.playbackRate = playbackRate
          if (frameOffset > 0 && frameOffset < (v.duration || Infinity)) {
            v.currentTime = frameOffset
          }
        }}
      />
      <WatermarkMask />
    </>
  )
}
