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
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-orange">
              Inside Stay Fit
            </span>
            <h2
              className="font-display text-5xl text-bone md:text-6xl"
              style={{ textShadow: `0 0 40px ${CYAN}20` }}
            >
              THE REELS
            </h2>
          </div>
          <p className="max-w-sm text-sm text-bone/50">
            Real sessions, real sweat. Hover a reel to preview, tap to watch the floor in motion.
          </p>
        </div>

        {/* Cinematic vertical carousel: cards expand on hover (Reels/TikTok-style),
            each playing a seamless real-footage loop under a dark obsidian vignette. */}
        <div
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4"
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
                transition={{ duration: 0.5, delay: (i % 6) * 0.06 }}
                animate={{ flexGrow: isHovered ? 2.2 : 1, boxShadow: isHovered ? `0 0 40px ${accent}55` : `0 0 0px ${accent}00` }}
                className="group relative aspect-9/16 min-w-[110px] shrink-0 flex-1 snap-start overflow-hidden rounded-2xl bg-obsidian-soft text-left ring-1 ring-bone/10 transition-shadow"
              >
                <DynamicVideo
                  videoSrc={reel.video}
                  playbackRate={reel.playbackRate}
                  frameOffset={reel.frameOffset}
                  filterClassName={FILTER_PRESETS[i % FILTER_PRESETS.length]}
                />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(11,11,14,0.9)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-obsidian via-obsidian/70 to-transparent p-3">
                  <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: accent }}>
                    {reel.category}
                  </p>
                  <p className="font-display text-sm leading-tight text-bone">{reel.title}</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-obsidian/60 text-lg text-bone backdrop-blur"
                    style={{ boxShadow: `0 0 20px ${accent}80` }}
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
