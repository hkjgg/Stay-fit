import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import type { MotionValue } from 'framer-motion'
import { rangeProgress, smoothstep, sceneVisibility } from '../../lib/scroll3d'
import { applyGroupOpacity } from '../../lib/three-utils'

const STEEL = '#c9cdd6'
const BLUE = '#0066ff'

function Plate({ restX, explodeDir }: { restX: number; explodeDir: number }) {
  const ref = useRef<Group>(null)
  return (
    <group ref={ref} position={[restX, 0, 0]} rotation={[0, 0, Math.PI / 2]} userData={{ explodeDir, restX }}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.75, 0.75, 0.16, 40]} />
        <meshStandardMaterial color="#0e0f12" metalness={0.9} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.081, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.56, 40]} />
        <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={1.4} metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.081, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.56, 40]} />
        <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={1.4} metalness={0.4} roughness={0.3} />
      </mesh>
    </group>
  )
}

const PLATE_CONFIG = [0.55, 0.95, 1.3, 1.6]

export function BarbellModel({
  progress,
  range,
}: {
  progress: MotionValue<number>
  range: [number, number]
}) {
  const group = useRef<Group>(null)

  useFrame((state, delta) => {
    if (!group.current) return
    const p = rangeProgress(progress.get(), range[0], range[1])
    const opacity = sceneVisibility(progress.get(), range)
    applyGroupOpacity(group.current, opacity)

    group.current.rotation.y += delta * 0.25
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.1

    const explode = smoothstep(rangeProgress(p, 0.12, 0.65))
    group.current.children.forEach((child) => {
      const { explodeDir, restX } = child.userData as { explodeDir: number; restX: number }
      if (explodeDir === undefined) return
      child.position.x = restX + explodeDir * explode * 0.9
    })
  })

  return (
    <group ref={group}>
      <mesh castShadow receiveShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.075, 0.075, 4.4, 24]} />
        <meshStandardMaterial color={STEEL} metalness={1} roughness={0.2} />
      </mesh>
      {PLATE_CONFIG.map((x, i) => (
        <Plate key={`r-${i}`} restX={x} explodeDir={1} />
      ))}
      {PLATE_CONFIG.map((x, i) => (
        <Plate key={`l-${i}`} restX={-x} explodeDir={-1} />
      ))}
    </group>
  )
}
