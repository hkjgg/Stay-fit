import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing'
import type { MotionValue } from 'framer-motion'
import { CameraRig } from './CameraRig'
import { Lights } from './Lights'
import { DumbbellModel } from './DumbbellModel'
import { BarbellModel } from './BarbellModel'
import { CardioMesh } from './CardioMesh'
import { SolariumSphere } from './SolariumSphere'
import { ShakerBottleModel } from './ShakerBottleModel'
import { SCENES } from '../../lib/constants'

const rangeOf = (id: string) => SCENES.find((s) => s.id === id)!.range

export function Experience({ progress }: { progress: MotionValue<number> }) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.1, 4.2], fov: 42, near: 0.1, far: 50 }}
      className="absolute inset-0"
    >
      <fog attach="fog" args={['#0b0b0e', 5, 13]} />
      <Suspense fallback={null}>
        <CameraRig progress={progress} />
        <Lights progress={progress} />
        <DumbbellModel progress={progress} range={rangeOf('hero')} fadeIn={false} />
        <BarbellModel progress={progress} range={rangeOf('heavy')} />
        <CardioMesh progress={progress} range={rangeOf('cardio')} />
        <SolariumSphere progress={progress} range={rangeOf('solarium')} />
        <ShakerBottleModel progress={progress} range={rangeOf('fuel')} />
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.9} luminanceThreshold={0.15} luminanceSmoothing={0.3} mipmapBlur />
          <Vignette eskil={false} offset={0.25} darkness={0.85} />
          <Noise opacity={0.02} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  )
}
