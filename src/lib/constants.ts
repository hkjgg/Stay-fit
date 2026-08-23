export const BRAND = {
  obsidian: '#0b0b0e',
  obsidianSoft: '#131318',
  orange: '#ff5500',
  blue: '#0066ff',
  bone: '#f5f3ee',
} as const

export type SceneId = 'hero' | 'heavy' | 'cardio' | 'solarium' | 'fuel'

export const SCENES: { id: SceneId; range: [number, number] }[] = [
  { id: 'hero', range: [0, 0.2] },
  { id: 'heavy', range: [0.2, 0.4] },
  { id: 'cardio', range: [0.4, 0.6] },
  { id: 'solarium', range: [0.6, 0.8] },
  { id: 'fuel', range: [0.8, 1] },
]

/** Number of 100vh scroll-lengths the pinned 3D scene wrapper spans. */
export const SCENE_WRAPPER_VH = 625

export function sceneRange(id: SceneId): [number, number] {
  return SCENES.find((s) => s.id === id)!.range
}

export const WHATSAPP_NUMBER = '96176123456'
export const WHATSAPP_LOCATION = 'Borj El Barajneh, Beirut'
