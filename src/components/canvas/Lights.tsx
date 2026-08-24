import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color } from 'three'
import type { PointLight } from 'three'
import type { MotionValue } from 'framer-motion'
import { rangeProgress, lerp } from '../../lib/scroll3d'
import { SCENES } from '../../lib/constants'

const ZONE_COLOR: Record<string, string> = {
  hero: '#ff5500',
  heavy: '#0066ff',
  cardio: '#ff5500',
  fuel: '#00e5ff',
}

const tmpA = new Color()
const tmpB = new Color()

export function Lights({ progress }: { progress: MotionValue<number> }) {
  const key = useRef<PointLight>(null)
  const rim = useRef<PointLight>(null)

  useFrame(() => {
    const p = progress.get()
    let activeIdx = 0
    for (let i = 0; i < SCENES.length; i++) {
      if (p >= SCENES[i].range[0]) activeIdx = i
    }
    const [start, end] = SCENES[activeIdx].range
    const local = rangeProgress(p, start, end)
    const nextIdx = Math.min(activeIdx + 1, SCENES.length - 1)

    tmpA.set(ZONE_COLOR[SCENES[activeIdx].id])
    tmpB.set(ZONE_COLOR[SCENES[nextIdx].id])
    const mixed = tmpA.clone().lerp(tmpB, local > 0.7 ? (local - 0.7) / 0.3 : 0)

    if (key.current) {
      key.current.color.copy(mixed)
      key.current.intensity = lerp(8, 14, Math.sin(local * Math.PI))
    }
    if (rim.current) {
      const zoneId = SCENES[activeIdx].id
      rim.current.color.set(zoneId === 'fuel' ? '#7bf3ff' : activeIdx % 2 === 0 ? '#0066ff' : '#ff5500')
      rim.current.intensity = zoneId === 'fuel' ? 8 : 6
    }
  })

  return (
    <>
      <ambientLight intensity={0.35} color="#e8ecff" />
      <directionalLight position={[3, 4, 5]} intensity={0.6} color="#ffffff" />
      <pointLight ref={key} position={[-2, 1.5, 2.5]} distance={12} decay={2} />
      <pointLight ref={rim} position={[2.5, -1, -2]} distance={10} decay={2} />
    </>
  )
}
