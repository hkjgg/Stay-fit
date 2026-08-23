import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import type { Group, Mesh, ShaderMaterial } from 'three'
import type { MotionValue } from 'framer-motion'
import { rangeProgress, smoothstep, sceneVisibility } from '../../lib/scroll3d'
import { applyGroupOpacity } from '../../lib/three-utils'

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    float fresnel = pow(1.0 - abs(vNormal.z), 2.2);
    float wave = sin(vPosition.y * 6.0 + uTime * 1.6) * 0.5 + 0.5;
    vec3 base = mix(uColorA, uColorB, wave * 0.6 + 0.2);
    vec3 glow = base * (0.55 + fresnel * 1.6);
    gl_FragColor = vec4(glow, 0.85);
  }
`

export function SolariumSphere({
  progress,
  range,
}: {
  progress: MotionValue<number>
  range: [number, number]
}) {
  const group = useRef<Group>(null)
  const sphere = useRef<Mesh>(null)
  const mat = useRef<ShaderMaterial>(null)

  useFrame((state, delta) => {
    if (!group.current) return
    const p = rangeProgress(progress.get(), range[0], range[1])
    const opacity = sceneVisibility(progress.get(), range, { edge: 0.22, fadeIn: true })
    applyGroupOpacity(group.current, opacity)

    group.current.rotation.y += delta * 0.3
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15
    const scale = 0.9 + smoothstep(p) * 0.25
    group.current.scale.setScalar(scale)

    if (mat.current) {
      mat.current.uniforms.uTime.value = state.clock.elapsedTime
      mat.current.opacity = opacity * 0.85
    }
    if (sphere.current) {
      sphere.current.rotation.x += delta * 0.15
    }
  })

  return (
    <group ref={group}>
      <mesh ref={sphere}>
        <icosahedronGeometry args={[1.1, 6]} />
        <shaderMaterial
          ref={mat}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          uniforms={{
            uTime: { value: 0 },
            uColorA: { value: [0.1, 0.2, 1] },
            uColorB: { value: [1, 0.33, 0] },
          }}
        />
      </mesh>
      <Sparkles count={80} scale={3.4} size={3.5} speed={0.35} color="#4d94ff" opacity={0.9} />
      <Sparkles count={40} scale={2.4} size={2.5} speed={0.5} color="#ff8a4d" opacity={0.8} />
    </group>
  )
}
