import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, Mesh, MeshBasicMaterial, Points } from 'three'
import { AdditiveBlending, BufferAttribute, MathUtils } from 'three'
import type { MotionValue } from 'framer-motion'
import { rangeProgress, lerp, smoothstep, sceneVisibility } from '../../lib/scroll3d'
import { applyGroupOpacity } from '../../lib/three-utils'

const ORANGE = '#ff5500'
const BAR_COUNT = 40
const SPAN = 2.7
/** Damping rate for scroll-bound rotation — frame-rate independent, converges in ~250-350ms regardless of device fps. */
const ROTATION_DAMP = 10

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

/**
 * A sleek audio-waveform / pulse stream: a row of bars oscillating on a
 * shallow arc, standing in for the "wireframe sphere" of earlier builds.
 * Frequency and amplitude both ramp up with scroll progress through the
 * scene, echoing the rising-heart-rate narrative in the copy alongside it.
 */
export function PulseWaveModel({
  progress,
  range,
}: {
  progress: MotionValue<number>
  range: [number, number]
}) {
  const group = useRef<Group>(null)
  const bars = useRef<(Mesh | null)[]>([])

  const barLayout = useMemo(
    () =>
      Array.from({ length: BAR_COUNT }, (_, i) => {
        const t = i / (BAR_COUNT - 1)
        return {
          x: lerp(-SPAN / 2, SPAN / 2, t),
          z: Math.sin(t * Math.PI) * 0.4,
          phase: i * 0.35,
        }
      }),
    [],
  )

  useFrame((state, delta) => {
    if (!group.current) return
    const p = rangeProgress(progress.get(), range[0], range[1])
    const opacity = sceneVisibility(progress.get(), range)
    applyGroupOpacity(group.current, opacity)

    // Rotation is purely a function of scroll progress (frame-rate-independent damping), not elapsed time.
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, p * Math.PI * 1.4, ROTATION_DAMP, delta)
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.08
    group.current.scale.setScalar(lerp(0.85, 1, smoothstep(p)))

    // BPM-style ramp: pulses run faster and taller the deeper you scroll.
    const energy = lerp(0.6, 2.4, p)
    const t = state.clock.elapsedTime
    bars.current.forEach((bar, i) => {
      if (!bar) return
      const { phase } = barLayout[i]
      const wave =
        Math.sin(t * energy * 2 + phase) * 0.55 + Math.sin(t * energy * 3.3 + phase * 1.7) * 0.3
      const amp = Math.abs(wave)
      bar.scale.y = 0.15 + amp * lerp(0.4, 1, p)
      const mat = bar.material as MeshBasicMaterial
      mat.opacity = opacity * (0.5 + amp * 0.5)
    })
  })

  return (
    <group ref={group}>
      {barLayout.map((pos, i) => (
        <mesh key={i} ref={(el) => { bars.current[i] = el }} position={[pos.x, 0, pos.z]}>
          <boxGeometry args={[0.045, 1, 0.06]} />
          <meshBasicMaterial color={ORANGE} transparent opacity={0.9} />
        </mesh>
      ))}
      <SpeedParticles />
    </group>
  )
}
