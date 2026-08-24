import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import type { MotionValue } from 'framer-motion'
import { rangeProgress, smoothstep, lerp, sceneVisibility } from '../../lib/scroll3d'
import { applyGroupOpacity } from '../../lib/three-utils'

const IRON = '#15161a'
const STEEL = '#c7cad2'
const CYAN = '#00e5ff'

const POST_X = 0.9
const POST_Z = 0.4
const POST_HALF_H = 1.1
const HOOK_Y = 0.15

/** One vertical rack post with an inner-facing cyan LED accent strip. */
function Post({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.09, POST_HALF_H * 2, 0.09]} />
        <meshStandardMaterial color={IRON} metalness={0.6} roughness={0.55} />
      </mesh>
      <mesh position={[-Math.sign(x) * 0.05, 0, 0]}>
        <boxGeometry args={[0.012, POST_HALF_H * 1.7, 0.012]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.8} toneMapped={false} />
      </mesh>
    </group>
  )
}

/** Rectangular horizontal frame connecting all four posts at a given height. */
function Frame({ y }: { y: number }) {
  return (
    <group position={[0, y, 0]}>
      <mesh position={[0, 0, POST_Z]}>
        <boxGeometry args={[POST_X * 2 + 0.09, 0.08, 0.08]} />
        <meshStandardMaterial color={IRON} metalness={0.6} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0, -POST_Z]}>
        <boxGeometry args={[POST_X * 2 + 0.09, 0.08, 0.08]} />
        <meshStandardMaterial color={IRON} metalness={0.6} roughness={0.55} />
      </mesh>
      <mesh position={[POST_X, 0, 0]}>
        <boxGeometry args={[0.08, 0.08, POST_Z * 2 + 0.09]} />
        <meshStandardMaterial color={IRON} metalness={0.6} roughness={0.55} />
      </mesh>
      <mesh position={[-POST_X, 0, 0]}>
        <boxGeometry args={[0.08, 0.08, POST_Z * 2 + 0.09]} />
        <meshStandardMaterial color={IRON} metalness={0.6} roughness={0.55} />
      </mesh>
    </group>
  )
}

/** J-cup hook cradling the bar on the front post. */
function JCup({ x }: { x: number }) {
  const dir = x > 0 ? -1 : 1
  return (
    <group position={[x, HOOK_Y, POST_Z]}>
      <mesh position={[dir * 0.13, -0.03, 0]}>
        <boxGeometry args={[0.22, 0.05, 0.12]} />
        <meshStandardMaterial color={STEEL} metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[dir * 0.22, 0.06, 0]}>
        <boxGeometry args={[0.05, 0.2, 0.12]} />
        <meshStandardMaterial color={STEEL} metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  )
}

const PLATE_CONFIG = [1.32, 1.6]

/** Round steel Olympic plate that slides onto the bar as the scene loads in. */
function Plate({ restX, dir }: { restX: number; dir: 1 | -1 }) {
  return (
    <group position={[restX, HOOK_Y, POST_Z]} rotation={[0, 0, Math.PI / 2]} userData={{ dir, restX }}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.09, 32]} />
        <meshStandardMaterial color={IRON} metalness={0.7} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.046, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.19, 0.22, 32]} />
        <meshStandardMaterial color={STEEL} metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.046, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.19, 0.22, 32]} />
        <meshStandardMaterial color={STEEL} metalness={1} roughness={0.2} />
      </mesh>
    </group>
  )
}

export function PowerRackModel({
  progress,
  range,
}: {
  progress: MotionValue<number>
  range: [number, number]
}) {
  const group = useRef<Group>(null)

  useFrame((state) => {
    if (!group.current) return
    const p = rangeProgress(progress.get(), range[0], range[1])
    const opacity = sceneVisibility(progress.get(), range)
    applyGroupOpacity(group.current, opacity)

    group.current.rotation.y = lerp(group.current.rotation.y, 0.3 - p * 0.15, 0.05)
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.08

    // Plates load onto the bar from off the end as the scene scrolls in.
    const loaded = smoothstep(rangeProgress(p, 0.1, 0.6))
    group.current.traverse((child) => {
      const data = child.userData as { dir?: 1 | -1; restX?: number }
      if (data.dir === undefined || data.restX === undefined) return
      child.position.x = data.restX + data.dir * (1 - loaded) * 0.8
    })
  })

  return (
    <group ref={group} position={[0, -0.05, 0]}>
      <Post x={POST_X} z={POST_Z} />
      <Post x={-POST_X} z={POST_Z} />
      <Post x={POST_X} z={-POST_Z} />
      <Post x={-POST_X} z={-POST_Z} />
      <Frame y={POST_HALF_H} />
      <Frame y={-POST_HALF_H} />
      <Frame y={-0.25} />

      <JCup x={POST_X} />
      <JCup x={-POST_X} />

      {/* barbell */}
      <mesh position={[0, HOOK_Y, POST_Z]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.045, 0.045, 3.6, 20]} />
        <meshStandardMaterial color={STEEL} metalness={1} roughness={0.2} />
      </mesh>

      {PLATE_CONFIG.map((x, i) => (
        <Plate key={`r-${i}`} restX={x} dir={1} />
      ))}
      {PLATE_CONFIG.map((x, i) => (
        <Plate key={`l-${i}`} restX={-x} dir={-1} />
      ))}
    </group>
  )
}
