import { useState } from 'react'
import { motion } from 'framer-motion'
import { REELS } from '../../data/reels'
import { ReelModal } from '../ui/ReelModal'
import { DynamicVideo } from '../canvas/DynamicVideo'

const CYAN = '#00f3ff'
const LIME = '#39ff14'
/** Two alternating grades so neighboring cards sharing a source clip still read distinct. */
const FILTER_PRESETS = ['contrast-110 saturate-125 brightness-95', 'contrast-110 saturate-110 brightness-90']

export function ReelsGrid() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const activeReel = activeIndex === null ? null : REELS[activeIndex]

  const navigate = (dir: 1 | -1) => {
    setActiveIndex((i) => {
      if (i === null) return i
      return (i + dir + REELS.length) % REELS.length
    })
  }

  return (
    <section id="reels" className="relative bg-obsidian px-6 py-24 md:px-12 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span
              className="mb-3 inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] backdrop-blur-md"
              style={{
                borderColor: `${CYAN}66`,
                color: CYAN,
                background: 'rgba(255,255,255,0.03)',
                boxShadow: `0 0 18px ${CYAN}33`,
              }}
            >
              Inside Stay Fit
            </span>
            <h2
              className="font-display text-5xl text-bone md:text-6xl"
              style={{ textShadow: `0 0 40px ${CYAN}25` }}
            >
              THE REELS
            </h2>
          </div>
          <p className="max-w-sm text-sm text-bone/50">
            Real sessions, real sweat. Hover a reel to preview, tap to watch the floor in motion.
          </p>
        </div>

        {/* Cinematic vertical carousel: cards expand on hover (Reels/TikTok-style),
            each playing a seamless real-footage loop under a dark obsidian vignette.
            Padded on all sides because overflow-x-auto clips vertically too, and the
            cards' neon bloom extends well past their bounds. */}
        <div
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-2 py-6"
          onMouseLeave={() => setHovered(null)}
        >
          {REELS.map((reel, i) => {
            const isHovered = hovered === i
            const accent = i % 2 === 0 ? CYAN : LIME
            return (
              <motion.button
                key={reel.id}
                onClick={() => setActiveIndex(i)}
                onMouseEnter={() => setHovered(i)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                // Matches the Scene 4 product cards: a resting neon rim that
                // blooms on hover, on the same spring. The flexGrow expansion
                // is this section's own Reels/TikTok-style behavior.
                animate={{
                  flexGrow: isHovered ? 2.2 : 1,
                  borderColor: isHovered ? `${accent}cc` : `${accent}55`,
                  boxShadow: isHovered ? `0 0 52px ${accent}75` : `0 0 30px ${accent}35`,
                }}
                transition={{
                  opacity: { duration: 0.5, delay: (i % 6) * 0.06 },
                  y: { duration: 0.5, delay: (i % 6) * 0.06 },
                  default: { type: 'spring', stiffness: 260, damping: 22 },
                }}
                style={{ borderColor: `${accent}55`, boxShadow: `0 0 30px ${accent}35` }}
                // Fixed height rather than aspect-9/16: with an aspect ratio, the
                // hover flexGrow widened the card AND made it much taller, so it
                // overflowed the scroller and got clipped. A set height keeps the
                // row stable so expansion reads as a clean horizontal reveal.
                className="group relative h-80 min-w-[110px] shrink-0 flex-1 snap-start overflow-hidden rounded-2xl border bg-obsidian-soft text-left"
              >
                <DynamicVideo
                  videoSrc={reel.video}
                  frameOffset={reel.frameOffset}
                  filterClassName={FILTER_PRESETS[i % FILTER_PRESETS.length]}
                />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(11,11,14,0.9)_100%)]" />

                {/* Neon category pill, styled like Scene 4's floating spec badges.
                    Kept inside the card bounds on purpose — this scroller is
                    overflow-x-auto, which clips vertically too, so a badge hung
                    outside the card would be cut off. */}
                <span
                  className="absolute left-2 top-2 rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide backdrop-blur-lg"
                  style={{
                    borderColor: `${accent}70`,
                    color: accent,
                    background: 'rgba(11,11,14,0.5)',
                    boxShadow: `0 0 14px ${accent}40`,
                  }}
                >
                  {reel.category}
                </span>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-obsidian via-obsidian/70 to-transparent p-3">
                  <p className="font-display text-sm leading-tight text-bone">{reel.title}</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full border bg-obsidian/60 text-lg text-bone backdrop-blur"
                    style={{ borderColor: `${accent}70`, boxShadow: `0 0 26px ${accent}90` }}
                  >
                    &#9654;
                  </span>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      <ReelModal reel={activeReel} onClose={() => setActiveIndex(null)} onNavigate={navigate} />
    </section>
  )
}
