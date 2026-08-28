export const BRAND = {
  obsidian: '#0b0b0e',
  obsidianSoft: '#131318',
  orange: '#ff5500',
  blue: '#0066ff',
  bone: '#f5f3ee',
} as const

export type SceneId = 'hero' | 'heavy' | 'cardio' | 'fuel'

export const SCENES: { id: SceneId; range: [number, number] }[] = [
  { id: 'hero', range: [0, 0.25] },
  { id: 'heavy', range: [0.25, 0.5] },
  { id: 'cardio', range: [0.5, 0.75] },
  { id: 'fuel', range: [0.75, 1] },
]

/** Number of 100vh scroll-lengths the pinned 3D scene wrapper spans. */
export const SCENE_WRAPPER_VH = 500

export function sceneRange(id: SceneId): [number, number] {
  return SCENES.find((s) => s.id === id)!.range
}

/**
 * Full international WhatsApp number, digits only — wa.me takes no `+`,
 * spaces or dashes. Confirmed by the owner as 961 + 03043932, keeping the
 * leading 0 rather than stripping it as strict E.164 would.
 */
export const WHATSAPP_NUMBER = '96103043932'
export const WHATSAPP_LOCATION = 'Borj El Barajneh, Beirut'

/** Opening hours, shown in the hero, the footer, and the WhatsApp info card. */
export const OPENING_HOURS = '1:00 PM – 11:00 PM'

/** Default greeting pre-filled into every WhatsApp link. */
export const WHATSAPP_GREETING = "Hi Stay Fit! I'd like to know more about your memberships."

/**
 * Single source of truth for every WhatsApp entry point — the floating button,
 * the footer link, the membership CTAs and the per-plan inquiry buttons — so
 * the number and greeting can never drift apart between them.
 */
export function whatsappLink(message: string = WHATSAPP_GREETING) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

/**
 * Google Maps satellite view for the gym's area. Uses a place query rather
 * than hard-coded coordinates, since the exact street-level pin hasn't been
 * provided — swap in a lat/lng here once it is.
 */
export const MAP_QUERY = encodeURIComponent(`Stay Fit Fitness Center, ${WHATSAPP_LOCATION}`)
/** `t=k` selects the satellite basemap; `output=embed` needs no API key. */
export const MAP_EMBED_URL = `https://www.google.com/maps?q=${MAP_QUERY}&t=k&z=16&output=embed`
export const MAP_LINK_URL = `https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`
