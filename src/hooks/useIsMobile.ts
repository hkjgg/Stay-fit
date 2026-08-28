import { useEffect, useState } from 'react'

/** Matches Tailwind's `md` breakpoint, so JS-side decisions stay in sync with
 *  the `md:` utilities used for layout. */
const MOBILE_QUERY = '(max-width: 767px)'

/**
 * True on phone-sized viewports. Used to *skip mounting* expensive subtrees
 * rather than just hiding them: a `hidden md:grid` block still mounts its
 * `<video>` children, which browsers will happily fetch and decode even at
 * `display: none`, burning bandwidth and CPU on exactly the devices that can
 * least afford it.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches,
  )

  useEffect(() => {
    // State is already initialized from matchMedia above, so this only needs
    // to subscribe to subsequent changes (rotation, resize, devtools).
    const mq = window.matchMedia(MOBILE_QUERY)
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isMobile
}
