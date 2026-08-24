import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { DoubleSide, MathUtils } from 'three'
import type { Group } from 'three'
import type { MotionValue } from 'framer-motion'
import { rangeProgress, smoothstep, sceneVisibility } from '../../lib/scroll3d'
import { applyGroupOpacity } from '../../lib/three-utils'

const CHROME = '#e4e7ee'
const MATTE_BLACK = '#111214'
const CYAN = '#00e5ff'
const ORANGE = '#ff5500'
const PLASTIC_WHITE = '#efeee6'
const PLASTIC_BLACK = '#17181c'
/** Damping rate for scroll-bound rotation — frame-rate independent, converges in ~250-350ms regardless of device fps. */
const ROTATION_DAMP = 10

/** Small measuring scoop leaning against a tub — plastic bowl + thin handle. */
function Scoop({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, 0, -0.5]}>
      <mesh castShadow>
        <sphereGeometry args={[0.09, 16, 12, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
        <meshStandardMaterial color={PLASTIC_WHITE} roughness={0.35} metalness={0.05} side={DoubleSide} />
      </mesh>
      <mesh position={[0.14, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.014, 0.014, 0.16, 10]} />
        <meshStandardMaterial color={PLASTIC_WHITE} roughness={0.35} metalness={0.05} />
      </mesh>
    </group>
  )
}

/**
 * Three fuel-bar products sharing one scroll-bound rig: a matte-black &
 * chrome shaker, a compact creatine tub, and a taller vegan-protein tub.
 * Procedural geometry only (no texture/decal pipeline in this project),
 * so these are realistic *stand-ins* for the category — plastic tubs with
 * an accent label band and a scoop — rather than literal reproductions of
 * any specific brand's packaging or logo art.
 */
export function FuelProductsModel({
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
  const creatine = useRef<Group>(null)
  const protein = useRef<Group>(null)

  useFrame((state, delta) => {
    if (!group.current) return
    const p = rangeProgress(progress.get(), range[0], range[1])
    const opacity = sceneVisibility(progress.get(), range, { edge: 0.16, fadeIn: true })
    applyGroupOpacity(group.current, opacity)

    // All rotations are driven purely by scroll progress (frame-rate-independent damping), not elapsed time.
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, 0.2 - p * 0.5, ROTATION_DAMP, delta)
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.06

    const shakerTarget = p * Math.PI * 0.8
    if (shaker.current) {
      shaker.current.rotation.y = MathUtils.damp(shaker.current.rotation.y, shakerTarget, ROTATION_DAMP, delta)
    }
    if (creatine.current) {
      creatine.current.rotation.y = MathUtils.damp(creatine.current.rotation.y, -p * Math.PI * 0.6, ROTATION_DAMP, delta)
    }
    if (protein.current) {
      protein.current.rotation.y = MathUtils.damp(protein.current.rotation.y, p * Math.PI * 0.5, ROTATION_DAMP, delta)
    }

    // Lid unscrews + floats up through the first ~60% of the scene, then holds.
    const unscrew = smoothstep(rangeProgress(p, 0.12, 0.62))
    if (lid.current) {
      lid.current.position.y = 1.05 + unscrew * 0.55
      lid.current.rotation.y = MathUtils.damp(lid.current.rotation.y, unscrew * Math.PI * 4, ROTATION_DAMP, delta)
    }
    if (particles.current) {
      particles.current.scale.setScalar(unscrew)
    }
  })

  return (
    <group ref={group} position={[0, -0.15, 0]}>
      {/* Shaker bottle */}
      <group ref={shaker} position={[-1.0, 0, 0]}>
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.38, 0.34, 1.4, 32]} />
          <meshStandardMaterial color={MATTE_BLACK} roughness={0.65} metalness={0.25} />
        </mesh>
        <mesh position={[0, -0.55, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 0.08, 32]} />
          <meshStandardMaterial color={CHROME} roughness={0.1} metalness={1} />
        </mesh>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.36, 0.357, 0.05, 32]} />
          <meshStandardMaterial color={CHROME} roughness={0.08} metalness={1} />
        </mesh>

        {/* cyan LED glow strip — reads as an inner light through the matte body */}
        <mesh position={[0, 0.15, 0.355]}>
          <boxGeometry args={[0.045, 0.8, 0.01]} />
          <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={2.2} toneMapped={false} />
        </mesh>

        <group ref={lid} position={[0, 1.0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.41, 0.41, 0.26, 32]} />
            <meshStandardMaterial color={CHROME} roughness={0.06} metalness={1} />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.2, 20]} />
            <meshStandardMaterial color={MATTE_BLACK} roughness={0.5} metalness={0.3} />
          </mesh>
          <mesh position={[0, 0.13, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.085, 0.013, 8, 24, Math.PI]} />
            <meshStandardMaterial color={CHROME} roughness={0.1} metalness={1} />
          </mesh>
        </group>

        <group ref={particles} scale={0} position={[0, 0.7, 0]}>
          <Sparkles count={50} scale={[0.9, 1.4, 0.9]} size={2.6} speed={0.7} color={CYAN} opacity={0.95} />
        </group>
      </group>

      {/* Micro Creatine tub — compact, orange accent band */}
      <group ref={creatine} position={[0.02, -0.28, 0]}>
        <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.26, 0.24, 0.62, 32]} />
          <meshStandardMaterial color={PLASTIC_WHITE} roughness={0.4} metalness={0.06} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.263, 0.263, 0.16, 32]} />
          <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={0.7} toneMapped={false} roughness={0.35} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.62, 0]} castShadow>
          <cylinderGeometry args={[0.27, 0.27, 0.16, 32]} />
          <meshStandardMaterial color={PLASTIC_BLACK} roughness={0.3} metalness={0.08} />
        </mesh>
        <Scoop position={[0.32, 0.02, 0.1]} />
      </group>

      {/* Vegan Protein tub — tall, cyan accent band */}
      <group ref={protein} position={[0.92, -0.1, 0]}>
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.4, 0.37, 1.15, 32]} />
          <meshStandardMaterial color={PLASTIC_BLACK} roughness={0.42} metalness={0.08} />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.403, 0.403, 0.26, 32]} />
          <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.2} toneMapped={false} roughness={0.3} metalness={0.15} />
        </mesh>
        <mesh position={[0, 1.02, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.2, 32]} />
          <meshStandardMaterial color={PLASTIC_BLACK} roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh position={[0.12, 1.13, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.03, 24]} />
          <meshStandardMaterial color={PLASTIC_BLACK} roughness={0.4} metalness={0.05} />
        </mesh>
      </group>
    </group>
  )
}
