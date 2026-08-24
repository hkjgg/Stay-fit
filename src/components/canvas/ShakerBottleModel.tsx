import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import type { Group } from 'three'
import type { MotionValue } from 'framer-motion'
import { rangeProgress, smoothstep, lerp, sceneVisibility } from '../../lib/scroll3d'
import { applyGroupOpacity } from '../../lib/three-utils'

const CHROME = '#e4e7ee'
const MATTE_BLACK = '#111214'
const CYAN = '#00e5ff'

/**
 * Matte-black & chrome shaker bottle (left) beside a protein/creatine
 * container (right), both finished with chrome lids and a soft cyan
 * inner glow. As the fuel scene scrolls, the shaker's lid unscrews,
 * spins up and floats off the body while cyan "icy glow" particles vent
 * from the gap underneath it.
 */
export function ShakerBottleModel({
  progress,
  range,
}: {
  progress: MotionValue<number>
  range: [number, number]
}) {
  const group = useRef<Group>(null)
  const shaker = useRef<Group>(null)
  const lid = useRef<Group>(null)
  const particles = useRef<Group>(null)

  useFrame((state, delta) => {
    if (!group.current) return
    const p = rangeProgress(progress.get(), range[0], range[1])
    const opacity = sceneVisibility(progress.get(), range, { edge: 0.16, fadeIn: true })
    applyGroupOpacity(group.current, opacity)

    group.current.rotation.y = lerp(group.current.rotation.y, 0.2 - p * 0.5, 0.06)
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.06

    if (shaker.current) {
      shaker.current.rotation.y += delta * 0.5
    }

    // Lid unscrews + floats up through the first ~60% of the scene, then holds.
    const unscrew = smoothstep(rangeProgress(p, 0.12, 0.62))
    if (lid.current) {
      lid.current.position.y = 1.05 + unscrew * 0.55
      lid.current.rotation.y += delta * (0.8 + unscrew * 3)
    }
    if (particles.current) {
      particles.current.scale.setScalar(unscrew)
    }
  })

  return (
    <group ref={group} position={[0, -0.15, 0]}>
      {/* Shaker bottle */}
      <group ref={shaker} position={[-0.62, 0, 0]}>
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.42, 0.38, 1.5, 32]} />
          <meshStandardMaterial color={MATTE_BLACK} roughness={0.65} metalness={0.25} />
        </mesh>
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.08, 32]} />
          <meshStandardMaterial color={CHROME} roughness={0.1} metalness={1} />
        </mesh>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.4, 0.397, 0.05, 32]} />
          <meshStandardMaterial color={CHROME} roughness={0.08} metalness={1} />
        </mesh>

        {/* cyan LED glow strip — reads as an inner light through the matte body */}
        <mesh position={[0, 0.15, 0.395]}>
          <boxGeometry args={[0.05, 0.85, 0.01]} />
          <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={2.2} toneMapped={false} />
        </mesh>

        <group ref={lid} position={[0, 1.05, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.45, 0.45, 0.28, 32]} />
            <meshStandardMaterial color={CHROME} roughness={0.06} metalness={1} />
          </mesh>
          <mesh position={[0, 0.16, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.22, 20]} />
            <meshStandardMaterial color={MATTE_BLACK} roughness={0.5} metalness={0.3} />
          </mesh>
          {/* carry-handle loop */}
          <mesh position={[0, 0.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.09, 0.014, 8, 24, Math.PI]} />
            <meshStandardMaterial color={CHROME} roughness={0.1} metalness={1} />
          </mesh>
        </group>

        <group ref={particles} scale={0} position={[0, 0.75, 0]}>
          <Sparkles count={50} scale={[0.9, 1.4, 0.9]} size={2.6} speed={0.7} color={CYAN} opacity={0.95} />
        </group>
      </group>

      {/* Protein / creatine container */}
      <group position={[0.68, -0.1, 0]}>
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.36, 0.36, 1.15, 32]} />
          <meshStandardMaterial color="#f2efe6" roughness={0.55} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.363, 0.363, 0.22, 32]} />
          <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.4} toneMapped={false} metalness={0.3} roughness={0.35} />
        </mesh>
        {/* chrome lid */}
        <mesh position={[0, 0.78, 0]} castShadow>
          <cylinderGeometry args={[0.38, 0.38, 0.22, 32]} />
          <meshStandardMaterial color={CHROME} roughness={0.08} metalness={1} />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.04, 24]} />
          <meshStandardMaterial color={CHROME} roughness={0.1} metalness={1} />
        </mesh>
      </group>
    </group>
  )
}
