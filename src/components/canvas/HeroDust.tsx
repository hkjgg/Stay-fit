import { useEffect, useRef } from 'react'
import type { MotionValue } from 'framer-motion'

interface DustParticle {
  baseX: number
  baseY: number
  /** Fake-depth factor (0.3 far/small/slow .. 1 near/large/fast) — no real 3D
   *  engine needed for a handful of soft dots, just a per-particle z term
   *  driving size, opacity, and drift/scatter speed for a sense of parallax. */
  z: number
  angle: number
  driftSpeed: number
}

const COUNT = 46
/** Local scene progress past which the field is fully scattered/invisible —
 *  matches the hero's dock completion so dust clears right as the title docks. */
const SCATTER_END = 0.4

/**
 * Lightweight 2D-canvas dust field standing in for a "3D particle" effect
 * without pulling Three.js back in for a handful of soft dots. Particles
 * drift gently at rest and scatter outward — fading as they go — once the
 * user starts scrolling, clearing the stage seamlessly by dock completion.
 */
export function HeroDust({ local }: { local: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = width * devicePixelRatio
      canvas.height = height * devicePixelRatio
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: DustParticle[] = Array.from({ length: COUNT }, () => ({
      baseX: Math.random(),
      baseY: Math.random(),
      z: 0.3 + Math.random() * 0.7,
      angle: Math.random() * Math.PI * 2,
      driftSpeed: 0.15 + Math.random() * 0.25,
    }))

    let raf = 0
    let frame = 0
    const draw = () => {
      frame += 1
      const scatter = Math.min(1, local.get() / SCATTER_END)
      ctx.clearRect(0, 0, width, height)

      if (scatter < 1) {
        const cx = width / 2
        const cy = height / 2
        for (const p of particles) {
          const drift = frame * 0.0025 * p.driftSpeed
          const restX = p.baseX * width + Math.sin(drift + p.angle) * 6 * p.z
          const restY = p.baseY * height + Math.cos(drift + p.angle) * 6 * p.z
          const dx = restX - cx
          const dy = restY - cy
          const x = restX + dx * scatter * 3.5
          const y = restY + dy * scatter * 3.5
          const size = (0.6 + p.z * 1.6) * (1 - scatter * 0.4)
          const alpha = (0.15 + p.z * 0.35) * (1 - scatter)
          if (alpha <= 0.002) continue
          ctx.beginPath()
          ctx.fillStyle = `rgba(123, 243, 255, ${alpha})`
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [local])

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
}
