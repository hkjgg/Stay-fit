import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { MotionValue } from 'framer-motion'
import { rangeProgress, lerp, smoothstep } from '../../lib/scroll3d'
import { SCENES } from '../../lib/constants'

const mouse = { x: 0, y: 0 }
if (typeof window !== 'undefined') {
  window.addEventListener('pointermove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1
  })
}

const CAM_KEYFRAMES: { z: number; y: number; fov: number }[] = [
  { z: 4.2, y: 0.1, fov: 42 }, // hero
  { z: 4.6, y: 0.15, fov: 44 }, // heavy
  { z: 3.9, y: -0.05, fov: 46 }, // cardio
  { z: 4.4, y: 0.2, fov: 40 }, // solarium
]

export function CameraRig({ progress }: { progress: MotionValue<number> }) {
  const { camera } = useThree()
  const target = useRef({ z: CAM_KEYFRAMES[0].z, y: CAM_KEYFRAMES[0].y, fov: CAM_KEYFRAMES[0].fov })

  useFrame(() => {
    const p = progress.get()
    let z = CAM_KEYFRAMES[0].z
    let y = CAM_KEYFRAMES[0].y
    let fov = CAM_KEYFRAMES[0].fov

    for (let i = 0; i < SCENES.length; i++) {
      const [start, end] = SCENES[i].range
      const local = rangeProgress(p, start, end)
      const eased = smoothstep(local)
      const from = CAM_KEYFRAMES[i]
      const to = CAM_KEYFRAMES[Math.min(i + 1, CAM_KEYFRAMES.length - 1)]
      if (p >= start) {
        z = lerp(from.z, to.z, eased)
        y = lerp(from.y, to.y, eased)
        fov = lerp(from.fov, to.fov, eased)
      }
    }

    target.current.z = lerp(target.current.z, z, 0.08)
    target.current.y = lerp(target.current.y, y, 0.08)
    target.current.fov = lerp(target.current.fov, fov, 0.08)

    camera.position.x = lerp(camera.position.x, mouse.x * 0.3, 0.05)
    camera.position.y = lerp(camera.position.y, target.current.y + mouse.y * -0.15, 0.05)
    camera.position.z = target.current.z

    if ('fov' in camera) {
      const persp = camera as import('three').PerspectiveCamera
      if (Math.abs(persp.fov - target.current.fov) > 0.01) {
        persp.fov = target.current.fov
        persp.updateProjectionMatrix()
      }
    }

    camera.lookAt(0, 0, 0)
  })

  return null
}
