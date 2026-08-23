import type { Material, Object3D } from 'three'

interface Renderable extends Object3D {
  material?: Material | Material[]
}

/** Recursively fades every material under `root` and toggles visibility near zero. */
export function applyGroupOpacity(root: Object3D, opacity: number) {
  root.visible = opacity > 0.003
  root.traverse((child) => {
    const renderable = child as Renderable
    if (!renderable.material) return
    const mats = Array.isArray(renderable.material) ? renderable.material : [renderable.material]
    for (const m of mats) {
      if (!m) continue
      m.transparent = true
      m.opacity = opacity
    }
  })
}
