import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import type { MotionValue } from 'framer-motion'
import { rangeProgress, smoothstep, lerp, sceneVisibility } from '../../lib/scroll3d'
import { applyGroupOpacity } from '../../lib/three-utils'

const STEEL = '#d8d9dd'

function HexPlate({ x }: { x: number }) {
  return (
    <group position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.62, 0.62, 0.22, 6]} />
        <meshStandardMaterial color={STEEL} metalness={1} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.13, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.05, 6]} />
        <meshStandardMaterial color="#0b0b0e" metalness={0.8} roughness={0.4} />
      </mesh>
    </group>
  )
}

export function DumbbellModel({
  progress,
  range,
  fadeIn = true,
}: {
  progress: MotionValue<number>
  range: [number, number]
  fadeIn?: boolean
}) {
  const group = useRef<Group>(null)

  useFrame((state, delta) => {
    if (!group.current) return
    const p = rangeProgress(progress.get(), range[0], range[1])
    const opacity = sceneVisibility(progress.get(), range, { fadeIn })
    applyGroupOpacity(group.current, opacity)

    group.current.rotation.y += delta * 0.35
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.08
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.12
    const scale = lerp(0.85, 1, smoothstep(p))
    group.current.scale.setScalar(scale)
  })

  return (
    <group ref={group}>
      <mesh castShadow receiveShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.11, 0.11, 2.1, 24]} />
        <meshStandardMaterial color={STEEL} metalness={1} roughness={0.15} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.14, 0.03, 16, 32]} />
        <meshStandardMaterial color="#ff5500" emissive="#ff5500" emissiveIntensity={0.6} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.14, 0.03, 16, 32]} />
        <meshStandardMaterial color="#ff5500" emissive="#ff5500" emissiveIntensity={0.6} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[-0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.14, 0.03, 16, 32]} />
        <meshStandardMaterial color="#ff5500" emissive="#ff5500" emissiveIntensity={0.6} metalness={0.6} roughness={0.3} />
      </mesh>
      <HexPlate x={0.85} />
      <HexPlate x={-0.85} />
    </group>
  )
}
