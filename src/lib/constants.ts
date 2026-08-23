export const BRAND = {
  obsidian: '#0b0b0e',
  obsidianSoft: '#131318',
  orange: '#ff5500',
  blue: '#0066ff',
  bone: '#f5f3ee',
} as const

export type SceneId = 'hero' | 'heavy' | 'cardio' | 'solarium'

export const SCENES: { id: SceneId; range: [number, number] }[] = [
  { id: 'hero', range: [0, 0.25] },
  { id: 'heavy', range: [0.25, 0.5] },
  { id: 'cardio', range: [0.5, 0.75] },
  { id: 'solarium', range: [0.75, 1] },
]

/** Number of 100vh scroll-lengths the pinned 3D scene wrapper spans. */
export const SCENE_WRAPPER_VH = 500

export const WHATSAPP_NUMBER = '96176123456'
export const WHATSAPP_LOCATION = 'Borj El Barajneh, Beirut'
