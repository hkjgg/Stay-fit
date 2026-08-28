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
  /** Gradient shown behind (and as the poster for) the video, so a device that
   *  refuses to autoplay — iOS Low Power Mode most notably — shows a styled
   *  backdrop instead of a black rectangle. */
  poster?: string
}

/**
 * Shared looping video primitive for the split-screen showcase, kinetic
 * gallery, and reels carousel — each instance points at its own source,
 * frame offset, and filter grade so sections reusing the same two physical
 * clips still read as visually distinct footage. Always carries the shared
 * watermark mask so no video in the app renders without it.
 *
 * Carries `autoPlay muted playsInline loop` explicitly — mobile browsers only
 * permit unattended background playback when all of them are present — while
 * an IntersectionObserver additionally pauses clips that scroll out of view.
 * The reels carousel alone mounts six of these, and decoding all of them at
 * once is the main source of stutter on phones; the two mechanisms are
 * complementary rather than redundant.
 */
export function DynamicVideo({
  videoSrc,
  playbackRate = 0.75,
  frameOffset = 0,
  filterClassName = '',
  objectPosition,
  className = '',
  poster,
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
      {/* Painted underneath the video, so a frame that never decodes (Low Power
          Mode, a codec the device won't take) reveals the gradient rather than
          a black hole. */}
      {poster && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${poster}")` }}
        />
      )}
      <video
        ref={ref}
        className={`absolute inset-0 h-full w-full object-cover ${filterClassName} ${className}`}
        style={objectPosition ? { objectPosition } : undefined}
        src={videoSrc}
        poster={poster}
        autoPlay
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
