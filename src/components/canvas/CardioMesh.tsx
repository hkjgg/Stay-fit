import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, Mesh, Points } from 'three'
import { AdditiveBlending, BufferAttribute } from 'three'
import type { MotionValue } from 'framer-motion'
import { rangeProgress, lerp, smoothstep, sceneVisibility } from '../../lib/scroll3d'
import { applyGroupOpacity } from '../../lib/three-utils'

const ORANGE = '#ff5500'

function SpeedParticles({ count = 140 }: { count?: number }) {
  const points = useRef<Points>(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 6
      arr[i * 3 + 1] = (Math.random() - 0.5) * 3.5
      arr[i * 3 + 2] = (Math.random() - 0.5) * 3.5
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (!points.current) return
    const attr = points.current.geometry.attributes.position as BufferAttribute
    for (let i = 0; i < count; i++) {
      let x = attr.getX(i) + delta * 3.2
      if (x > 3) x = -3
      attr.setX(i, x)
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={ORANGE}
        size={0.045}
        transparent
        opacity={0.85}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

export function CardioMesh({
  progress,
  range,
}: {
  progress: MotionValue<number>
  range: [number, number]
}) {
  const group = useRef<Group>(null)
  const core = useRef<Mesh>(null)
  const wire = useRef<Mesh>(null)

  useFrame((state, delta) => {
    if (!group.current) return
    const p = rangeProgress(progress.get(), range[0], range[1])
    const opacity = sceneVisibility(progress.get(), range)
    applyGroupOpacity(group.current, opacity)

    group.current.rotation.y += delta * (0.4 + p * 0.6)
    group.current.rotation.x += delta * 0.12

    const bpm = lerp(0.9, 2.6, p)
    const pulse = 1 + Math.sin(state.clock.elapsedTime * bpm * Math.PI) * 0.08
    group.current.scale.setScalar(pulse * lerp(0.8, 1.05, smoothstep(p)))

    if (core.current) {
      const coreMat = core.current.material as import('three').MeshBasicMaterial
      coreMat.opacity = (0.35 + Math.sin(state.clock.elapsedTime * bpm * Math.PI) * 0.25) * opacity
    }
    if (wire.current) {
      wire.current.rotation.z += delta * 0.2
    }
  })

  return (
    <group ref={group}>
      <mesh ref={wire}>
        <icosahedronGeometry args={[1.15, 2]} />
        <meshBasicMaterial color={ORANGE} wireframe transparent opacity={0.9} />
      </mesh>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.02, 1]} />
        <meshBasicMaterial color={ORANGE} transparent opacity={0.3} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      <SpeedParticles />
    </group>
  )
}
