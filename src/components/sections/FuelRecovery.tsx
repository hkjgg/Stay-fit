import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useSceneOpacity, useSceneLocalProgress } from '../../hooks/useSceneRange'
import { SceneBackdrop } from '../canvas/SceneBackdrop'
import { rangeProgress, smoothstep, lerp, edgeGlow } from '../../lib/scroll3d'
import { sceneRange } from '../../lib/constants'
import { POSTERS } from '../../lib/videoPoster'

const RANGE = sceneRange('fuel')
const RIM_CYAN = '#00f3ff'
const LIME = '#39ff14'

interface ProductCardData {
  name: string
  brand: string
  shape: 'tub' | 'bottle'
  /** Main body color of the container. */
  fill: string
  /** Lid / cap color — lime anodized on the PR tubs, chrome on the BPI tub,
   *  black on the Tip Top bottles. */
  lid: string
  /** Label band color running across the body. */
  band: string
  badges: string[]
  /** Optional real product photo under /public/images/supplements/. The
   *  styled silhouette is the intended visual; if a photo is ever dropped in
   *  under this path it takes over automatically, and a missing or broken
   *  file falls straight back to the silhouette. */
  imageSrc?: string
}

const IMG = '/images/supplements'

// Real current inventory. Each silhouette is drawn from its actual packaging:
// body / lid / label-band colors are per-product rather than generic.
const INVENTORY: ProductCardData[] = [
  {
    name: 'Micro Creatine',
    brand: 'PR Sciences × Larry Wheels',
    shape: 'tub',
    fill: '#1b1e22',
    lid: '#9ccf2e',
    band: '#2b3138',
    badges: ['120 Servings', '732g', 'Unflavored'],
    imageSrc: `${IMG}/pr-micro-creatine.png`,
  },
  {
    name: 'Essentials EAAs',
    brand: 'PR Sciences · Sour Gummy',
    shape: 'tub',
    fill: '#1b1e22',
    lid: '#b5d94a',
    band: '#2b3138',
    badges: ['25 Servings', 'EAAs + Hydration', '345g'],
    imageSrc: `${IMG}/pr-essentials-eaas.png`,
  },
  {
    name: 'Vegan Protein',
    brand: 'BPI Sports · Chocolate',
    shape: 'tub',
    fill: '#141416',
    lid: '#b9b5a6',
    band: '#e9eae4',
    badges: ['20g Protein', '0g Sugar', 'Non-Dairy'],
    imageSrc: `${IMG}/bpi-vegan-protein.png`,
  },
  {
    name: 'Mint Lemonade',
    brand: 'Tip Top Hydration',
    shape: 'bottle',
    fill: '#3ddc45',
    lid: '#121316',
    band: '#121316',
    badges: ['25X Electrolytes', '500ML', 'Vitamins B1·B3·B6'],
    imageSrc: `${IMG}/tiptop-mint-lemonade.png`,
  },
  {
    name: 'Fruits Punch',
    brand: 'Tip Top Hydration',
    shape: 'bottle',
    fill: '#e8362f',
    lid: '#121316',
    band: '#121316',
    badges: ['25X Electrolytes', '500ML', 'No Artificial Flavors'],
    imageSrc: `${IMG}/tiptop-fruits-punch.png`,
  },
  {
    name: 'Glowberry',
    brand: 'Tip Top Hydration',
    shape: 'bottle',
    fill: '#2fa7e6',
    lid: '#121316',
    band: '#121316',
    badges: ['25X Electrolytes', '500ML', 'Vitamins B1·B3·B6'],
    imageSrc: `${IMG}/tiptop-glowberry.png`,
  },
]

/**
 * Styled CSS silhouette of the product — the intended visual for these cards.
 * Body, lid and label-band colors come from the real packaging, and a shared
 * specular highlight down the left edge plus a contact shadow underneath give
 * each one a rounded, lit-from-the-side read rather than looking like a flat
 * rectangle.
 *
 * If a real photo is ever dropped into /public/images/supplements/ it takes
 * over automatically; a missing or undecodable file falls straight back here,
 * so the card can never render a broken-image icon.
 */
function ProductPackshot({
  shape,
  fill,
  lid,
  band,
  accent,
  imageSrc,
  name,
}: {
  shape: 'tub' | 'bottle'
  fill: string
  lid: string
  band: string
  accent: string
  imageSrc?: string
  name: string
}) {
  const [imageFailed, setImageFailed] = useState(false)

  if (imageSrc && !imageFailed) {
    return (
      <div className="glass-card flex h-28 w-24 items-center justify-center rounded-xl p-2">
        <img
          src={imageSrc}
          alt={name}
          loading="lazy"
          onError={() => setImageFailed(true)}
          className="h-full w-full object-contain drop-shadow-lg"
        />
      </div>
    )
  }

  // Curved specular highlight + right-edge falloff, shared by both shapes so
  // the containers read as cylinders instead of flat blocks.
  const cylinder =
    'linear-gradient(90deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 18%, rgba(255,255,255,0) 42%, rgba(0,0,0,0.28) 88%, rgba(0,0,0,0.42) 100%)'

  if (shape === 'bottle') {
    return (
      <div className="relative mx-auto h-28 w-[3.25rem]" aria-hidden="true">
        {/* cap */}
        <div
          className="absolute inset-x-[0.85rem] top-0 h-[0.55rem] rounded-t-[3px]"
          style={{ background: lid, boxShadow: `0 0 10px ${accent}55` }}
        />
        {/* neck */}
        <div className="absolute inset-x-[1.05rem] top-[0.5rem] h-[0.35rem]" style={{ background: `${fill}cc` }} />
        {/* body */}
        <div
          className="absolute inset-x-0 bottom-0 top-[0.8rem] overflow-hidden rounded-[0.9rem] rounded-t-[0.5rem]"
          style={{ background: fill }}
        >
          {/* shoulder chevron band */}
          <div className="absolute inset-x-0 top-0 h-[0.9rem]" style={{ background: band }} />
          <div
            className="absolute left-1/2 top-[0.55rem] h-3 w-3 -translate-x-1/2 rotate-45"
            style={{ background: band }}
          />
          {/* lower label band */}
          <div className="absolute inset-x-0 bottom-[0.45rem] h-[0.3rem]" style={{ background: band }} />
          <div className="absolute inset-0" style={{ background: cylinder }} />
        </div>
        <div
          className="absolute -bottom-1 left-1/2 h-1.5 w-10 -translate-x-1/2 rounded-[50%] blur-[3px]"
          style={{ background: 'rgba(0,0,0,0.55)' }}
        />
      </div>
    )
  }

  return (
    <div className="relative mx-auto h-28 w-[5rem] pt-2" aria-hidden="true">
      {/* lid */}
      <div
        className="absolute inset-x-[0.3rem] top-0 h-[0.9rem] rounded-t-[0.4rem]"
        style={{
          background: `linear-gradient(180deg, ${lid}, ${lid}aa)`,
          boxShadow: `0 0 12px ${accent}55`,
        }}
      />
      {/* body */}
      <div
        className="absolute inset-x-0 bottom-0 top-[0.8rem] overflow-hidden rounded-[0.45rem]"
        style={{ background: fill }}
      >
        {/* label band */}
        <div className="absolute inset-x-0 top-[30%] h-[38%]" style={{ background: band, opacity: 0.9 }} />
        {/* serving tag */}
        <div
          className="absolute bottom-[0.45rem] left-[0.4rem] h-[0.6rem] w-[0.9rem] rounded-[2px]"
          style={{ background: lid }}
        />
        <div className="absolute inset-0" style={{ background: cylinder }} />
      </div>
      <div
        className="absolute -bottom-1 left-1/2 h-1.5 w-14 -translate-x-1/2 rounded-[50%] blur-[3px]"
        style={{ background: 'rgba(0,0,0,0.55)' }}
      />
    </div>
  )
}

/** Small floating pill carrying one label spec, positioned at a card corner. */
function SpecBadge({ text, accent, corner, delay }: { text: string; accent: string; corner: string; delay: number }) {
  return (
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay }}
      className={`absolute z-10 rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide whitespace-nowrap backdrop-blur-sm md:backdrop-blur-lg ${corner}`}
      style={{ borderColor: `${accent}70`, color: accent, background: 'rgba(11,11,14,0.5)', boxShadow: `0 0 14px ${accent}40` }}
    >
      {text}
    </motion.div>
  )
}

/** Product card with mouse-driven 3D parallax tilt, a dark glassmorphic body
 *  (blurred glass body), and neon cyan/lime rim glow matched to the product. */
function ProductCard({ product, accent, delay }: { product: ProductCardData; accent: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const rawRotateX = useMotionValue(0)
  const rawRotateY = useMotionValue(0)
  const rotateX = useSpring(rawRotateX, { stiffness: 220, damping: 20 })
  const rotateY = useSpring(rawRotateY, { stiffness: 220, damping: 20 })

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rawRotateY.set(px * 14)
    rawRotateX.set(-py * 14)
  }
  const handleLeave = () => {
    rawRotateX.set(0)
    rawRotateY.set(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.5, delay: delay * 0.08 }}
      className="relative shrink-0 snap-start pt-6"
      style={{ perspective: 800 }}
    >
      {/* On phones the badges tuck inside the card's own bounds (top-1/bottom-1,
          within its px-4 py-6 padding) instead of hanging off the corners. The
          carousel is overflow-x-auto, which clips vertically as well, so an
          outside-hung badge got its bottom edge cut off on small screens.
          From sm: up they float outside again for the intended look. */}
      <SpecBadge
        text={product.badges[0]}
        accent={accent}
        corner="top-8 right-2 sm:-top-1 sm:-right-3"
        delay={delay * 0.3}
      />
      <SpecBadge
        text={product.badges[1]}
        accent={accent}
        corner="bottom-2 left-2 sm:-bottom-2 sm:-left-3"
        delay={delay * 0.3 + 1.2}
      />

      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        // Hover lifts the card, scales it slightly, and drives the neon rim
        // from a resting glow up to a bright bloom in the product's accent.
        whileHover={{
          scale: 1.06,
          y: -6,
          boxShadow: `0 0 52px ${accent}75`,
          borderColor: `${accent}cc`,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        style={{
          rotateX,
          rotateY,
          borderColor: `${accent}55`,
          boxShadow: `0 0 30px ${accent}35`,
        }}
        className="glass-card flex w-40 flex-col items-center rounded-2xl border px-4 py-6 text-center"
      >
        <ProductPackshot
          shape={product.shape}
          fill={product.fill}
          lid={product.lid}
          band={product.band}
          accent={accent}
          imageSrc={product.imageSrc}
          name={product.name}
        />
        <p className="mt-4 text-sm font-semibold uppercase leading-tight tracking-wide text-bone">{product.name}</p>
        <p className="mt-1 text-[10px] leading-tight text-bone/50">{product.brand}</p>
        {product.badges[2] && (
          <span
            className="mt-3 rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide"
            style={{ borderColor: `${accent}40`, color: accent }}
          >
            {product.badges[2]}
          </span>
        )}
      </motion.div>
    </motion.div>
  )
}

/** `overflow-x-auto` also clips vertically, so the floating spec badges — which
 *  sit outside each card's bounds — need the vertical padding here, otherwise
 *  they get cut off at the top and bottom of the scroller. */
function ProductCarousel() {
  return (
    <div className="flex gap-6 overflow-x-auto py-8 pl-2 pr-8 [scrollbar-width:thin] snap-x snap-mandatory sm:pr-2">
      {INVENTORY.map((product, i) => (
        <ProductCard key={product.name} product={product} accent={i % 2 === 0 ? LIME : RIM_CYAN} delay={i} />
      ))}
    </div>
  )
}

export function FuelRecoveryBackdrop() {
  const opacity = useSceneOpacity(...RANGE, 0.16)
  const local = useSceneLocalProgress(...RANGE)
  const scale = useTransform(local, (t) => lerp(1.08, 1.0, smoothstep(t)))
  // Entering the Protein Bar gets the most dramatic glow: a stronger, wider pulse.
  const glow = useTransform(local, (t) => Math.min(1, edgeGlow(t, 0.3) * 1.3))
  return (
    <SceneBackdrop
      opacity={opacity}
      scale={scale}
      glow={glow}
      videoSrc="/videos/VID_2.mp4"
      gradient="bg-[radial-gradient(ellipse_at_50%_45%,#062026_0%,#0b0b0e_70%)]"
      poster={POSTERS.fuel}
      glass
    />
  )
}

export function FuelRecoveryContent() {
  const opacity = useSceneOpacity(...RANGE, 0.16)
  const local = useSceneLocalProgress(...RANGE)
  const titleX = useTransform(local, (t) => lerp(-30, 0, smoothstep(rangeProgress(t, 0, 0.25))))
  const cardsOpacity = useTransform(local, (t) => smoothstep(rangeProgress(t, 0.15, 0.45)))
  const cardsY = useTransform(local, (t) => lerp(24, 0, smoothstep(rangeProgress(t, 0.15, 0.45))))

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex h-full w-full flex-col justify-center gap-6 px-4 py-16 md:gap-8 md:px-14 md:py-20"
    >
      <motion.div style={{ x: titleX }} className="shrink-0">
        <span
          className="mb-3 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] backdrop-blur-sm md:backdrop-blur-md"
          style={{ borderColor: `${RIM_CYAN}66`, color: RIM_CYAN, background: 'rgba(255,255,255,0.03)' }}
        >
          Fuel &amp; Recovery Hub
        </span>
        <h2
          className="font-display text-[clamp(1.9rem,7vw,3.2rem)] leading-[0.9] text-bone"
          style={{ textShadow: `0 0 40px ${RIM_CYAN}25` }}
        >
          RECOVERY &amp; FUEL{' '}
          <span className="bg-gradient-to-r from-cyan-soft via-cyan to-blue-soft bg-clip-text text-transparent">
            STATION
          </span>
        </h2>
      </motion.div>

      <motion.div style={{ opacity: cardsOpacity, y: cardsY }} className="w-full">
        <ProductCarousel />

        <motion.a
          href="#membership"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="animate-pulse-slow relative mt-4 inline-block rounded-full bg-cyan px-8 py-3 text-sm font-semibold uppercase tracking-wide text-obsidian shadow-[0_0_35px_rgba(0,229,255,0.55)]"
        >
          Order at the Bar
        </motion.a>
      </motion.div>
    </motion.div>
  )
}

export const FUEL_RANGE = RANGE
