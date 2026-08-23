import { useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'

export function AnimatedPrice({ value }: { value: number }) {
  const [display, setDisplay] = useState(value)
  const prev = useRef(value)

  useEffect(() => {
    const controls = animate(prev.current, value, {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    prev.current = value
    return () => controls.stop()
  }, [value])

  return <>{display}</>
}
