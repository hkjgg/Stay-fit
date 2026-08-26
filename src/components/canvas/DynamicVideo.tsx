interface DynamicVideoProps {
  videoSrc: string
  /** Playback speed for this instance — lets sections built from the same
   *  source clip feel unique (e.g. slow-mo iron vs. brisk kinetic cardio). */
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
 * speed, frame offset, and filter grade so sections reusing the same two
 * physical clips still read as visually distinct footage.
 */
export function DynamicVideo({
  videoSrc,
  playbackRate = 1,
  frameOffset = 0,
  filterClassName = '',
  objectPosition,
  className = '',
}: DynamicVideoProps) {
  return (
    <video
      className={`absolute inset-0 h-full w-full object-cover ${filterClassName} ${className}`}
      style={objectPosition ? { objectPosition } : undefined}
      src={videoSrc}
      autoPlay
      loop
      muted
      playsInline
      onLoadedMetadata={(e) => {
        const v = e.currentTarget
        v.playbackRate = playbackRate
        if (frameOffset > 0 && frameOffset < (v.duration || Infinity)) {
          v.currentTime = frameOffset
        }
      }}
    />
  )
}
