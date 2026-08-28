import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useSceneOpacity, useSceneLocalProgress } from '../../hooks/useSceneRange'
import { SceneBackdrop } from '../canvas/SceneBackdrop'
import { rangeProgress, smoothstep, lerp, edgeGlow } from '../../lib/scroll3d'
import { sceneRange } from '../../lib/constants'

const RANGE = sceneRange('fuel')
const RIM_CYAN = '#00f3ff'
const LIME = '#39ff14'

interface ProductCardData {
  name: string
  brand: string
  shape: 'tub' | 'bottle'
  fill: string
  badges: string[]
  /** Real product photo under /public/images/supplements/. Each card renders
   *  this centered with object-contain; if the file isn't present the card
   *  degrades to the procedural silhouette below rather than showing a
   *  broken image (see ProductPackshot). */
  imageSrc: string
}

const IMG = '/images/supplements'

// Real current inventory, each bound to its own product photo.
const INVENTORY: ProductCardData[] = [
  {
    name: 'Micro Creatine',
    brand: 'PR Sciences × Larry Wheels',
    shape: 'tub',
    fill: '#15161a',
    badges: ['120 Servings', '732g', 'Unflavored'],
    imageSrc: `${IMG}/pr-micro-creatine.png`,
  },
  {
    name: 'Essentials EAAs',
    brand: 'PR Sciences · Sour Gummy',
    shape: 'tub',
    fill: '#15161a',
    badges: ['25 Servings', 'EAAs + Hydration', '345g'],
    imageSrc: `${IMG}/pr-essentials-eaas.png`,
  },
  {
    name: 'Vegan Protein',
    brand: 'BPI Sports · Chocolate',
    shape: 'tub',
    fill: '#161514',
    badges: ['20g Protein', '0g Sugar', 'Non-Dairy'],
    imageSrc: `${IMG}/bpi-vegan-protein.png`,
  },
  {
    name: 'Mint Lemonade',
    brand: 'Tip Top Hydration',
    shape: 'bottle',
    fill: '#3ddc45',
    badges: ['25X Electrolytes', '500ML', 'Vitamins B1·B3·B6'],
    imageSrc: `${IMG}/tiptop-mint-lemonade.png`,
  },
  {
    name: 'Fruits Punch',
    brand: 'Tip Top Hydration',
    shape: 'bottle',
    fill: '#e8362f',
    badges: ['25X Electrolytes', '500ML', 'No Artificial Flavors'],
    imageSrc: `${IMG}/tiptop-fruits-punch.png`,
  },
  {
    name: 'Glowberry',
    brand: 'Tip Top Hydration',
    shape: 'bottle',
    fill: '#2fa7e6',
    badges: ['25X Electrolytes', '500ML', 'Vitamins B1·B3·B6'],
    imageSrc: `${IMG}/tiptop-glowberry.png`,
  },
]

/**
 * Product visual: the real product photo, centered and object-contain so it
 * never distorts, on a solid dark panel (deliberately opaque so background
 * video motion can't bleed through and wash it out).
 *
 * If the image file is missing the card falls back to a procedural
 * silhouette carrying the product's shape/color identity, so a not-yet-added
 * asset degrades gracefully instead of rendering a broken-image icon.
 */
function ProductPackshot({
  shape,
  fill,
  accent,
  imageSrc,
  name,
}: {
  shape: 'tub' | 'bottle'
  fill: string
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

  if (shape === 'bottle') {
    return (
      <div className="relative mx-auto h-28 w-12">
        <div className="absolute inset-x-3 top-0 h-3 rounded-t-sm bg-obsidian" style={{ boxShadow: `0 0 8px ${accent}55` }} />
        <div className="absolute inset-x-0 top-3 bottom-0 overflow-hidden rounded-2xl rounded-t-md" style={{ background: fill }}>
          <div className="absolute inset-x-0 top-[38%] h-7 bg-obsidian/88" />
          <div className="absolute inset-x-0 bottom-0 h-2 bg-obsidian/70" />
        </div>
      </div>
    )
  }
  return (
    <div className="relative mx-auto h-24 w-20">
      <div
        className="absolute inset-x-3 -top-2 h-4 rounded-t-lg"
        style={{ background: `linear-gradient(180deg, ${accent}cc, ${accent}55)`, boxShadow: `0 0 10px ${accent}66` }}
      />
      <div className="absolute inset-0 top-2 overflow-hidden rounded-xl" style={{ background: fill }}>
        <div className="absolute inset-x-0 top-1/2 h-6" style={{ background: `linear-gradient(180deg, ${accent}33, transparent)` }} />
      </div>
    </div>
  )
}

/** Small floating pill carrying one label spec, positioned at a card corner. */
function SpecBadge({ text, accent, corner, delay }: { text: string; accent: string; corner: string; delay: number }) {
  return (
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay }}
      className={`absolute z-10 rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide whitespace-nowrap backdrop-blur-lg ${corner}`}
      style={{ borderColor: `${accent}70`, color: accent, background: 'rgba(11,11,14,0.5)', boxShadow: `0 0 14px ${accent}40` }}
    >
      {text}
    </motion.div>
  )
}

/** Product card with mouse-driven 3D parallax tilt, a dark glassmorphic body
 *  (backdrop-blur-lg), and neon cyan/lime rim glow matched to the product. */
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
      <SpecBadge text={product.badges[0]} accent={accent} corner="-top-1 -right-3" delay={delay * 0.3} />
      <SpecBadge text={product.badges[1]} accent={accent} corner="-bottom-2 -left-3" delay={delay * 0.3 + 1.2} />

      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        whileHover={{ scale: 1.06 }}
        style={{
          rotateX,
          rotateY,
          borderColor: `${accent}55`,
          boxShadow: `0 0 30px ${accent}35`,
        }}
        className="glass-card flex w-40 flex-col items-center rounded-2xl border px-4 py-6 text-center transition-shadow duration-300"
      >
        <ProductPackshot
          shape={product.shape}
          fill={product.fill}
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

function ProductCarousel() {
  return (
    <div className="flex gap-6 overflow-x-auto px-1 pb-4 [scrollbar-width:thin] snap-x snap-mandatory">
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
      className="absolute inset-0 flex h-full w-full flex-col justify-center gap-8 px-6 py-20 md:px-14"
    >
      <motion.div style={{ x: titleX }} className="shrink-0">
        <span
          className="mb-3 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] backdrop-blur-md"
          style={{ borderColor: `${RIM_CYAN}66`, color: RIM_CYAN, background: 'rgba(255,255,255,0.03)' }}
        >
          Fuel &amp; Recovery Hub
        </span>
        <h2
          className="font-display text-[11vw] leading-[0.9] text-bone sm:text-[6vw] md:text-[3.4vw]"
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
