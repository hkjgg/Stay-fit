import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils, type Group } from 'three'
import type { MotionValue } from 'framer-motion'
import { rangeProgress, smoothstep, lerp, sceneVisibility } from '../../lib/scroll3d'
import { applyGroupOpacity } from '../../lib/three-utils'

const STEEL = '#c7cad2'
const CHROME = '#eef0f4'
const RUBBER = '#141416'

/** Damping rate for scroll-bound rotation — frame-rate independent, converges in ~250-350ms regardless of device fps. */
const ROTATION_DAMP = 10

const HANDLE_RADIUS = 0.1
const KNURL_COUNT = 14
const KNURL_SPAN = 0.85

/** Ridged knurling on the grip — a tight row of thin rings rather than a smooth rod. */
function KnurlRidges() {
  return (
    <>
      {Array.from({ length: KNURL_COUNT }).map((_, i) => {
        const x = lerp(-KNURL_SPAN / 2, KNURL_SPAN / 2, i / (KNURL_COUNT - 1))
        return (
          <mesh key={i} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[HANDLE_RADIUS + 0.003, 0.007, 8, 16]} />
            <meshStandardMaterial color={STEEL} metalness={0.9} roughness={0.55} />
          </mesh>
        )
      })}
    </>
  )
}

/** Matte-black rubber hex end with a chrome hub collar where it sleeves onto the handle. */
function HexEnd({ x }: { x: number }) {
  const dir = x > 0 ? 1 : -1
  return (
    <group position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.34, 6]} />
        <meshStandardMaterial color={RUBBER} metalness={0.1} roughness={0.85} />
      </mesh>
      {/* chrome hub collar on the inner face, where the plate sleeves onto the handle */}
      <mesh position={[0, dir * 0.17, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.04, 24]} />
        <meshStandardMaterial color={CHROME} metalness={1} roughness={0.1} />
      </mesh>
      {/* small chrome end cap on the outer face */}
      <mesh position={[0, -dir * 0.17, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.02, 24]} />
        <meshStandardMaterial color={CHROME} metalness={1} roughness={0.15} />
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

    // Rotation is purely a function of scroll progress (frame-rate-independent damping), not elapsed time.
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, p * Math.PI * 2, ROTATION_DAMP, delta)
    group.current.rotation.x = Math.sin(p * Math.PI * 4) * 0.08
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.12
    const scale = lerp(0.85, 1, smoothstep(p))
    group.current.scale.setScalar(scale)
  })

  return (
    <group ref={group}>
      {/* handle */}
      <mesh castShadow receiveShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[HANDLE_RADIUS, HANDLE_RADIUS, 1.6, 24]} />
        <meshStandardMaterial color={STEEL} metalness={1} roughness={0.2} />
      </mesh>
      <KnurlRidges />
      <HexEnd x={0.85} />
      <HexEnd x={-0.85} />
    </group>
  )
}
