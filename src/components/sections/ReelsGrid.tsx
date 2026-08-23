import { useState } from 'react'
import { motion } from 'framer-motion'
import { REELS } from '../../data/reels'
import { ReelModal } from '../ui/ReelModal'

export function ReelsGrid() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
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
            <h2 className="font-display text-5xl text-bone md:text-6xl">THE REELS</h2>
          </div>
          <p className="max-w-sm text-sm text-bone/50">
            Real sessions, real sweat. Tap a reel to watch the floor in motion.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {REELS.map((reel, i) => (
            <motion.button
              key={reel.id}
              onClick={() => setActiveIndex(i)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.06 }}
              whileHover={{ scale: 1.04 }}
              className={`group relative aspect-9/16 overflow-hidden rounded-2xl bg-gradient-to-br ${reel.gradient} text-left ring-1 ring-bone/10 transition hover:ring-orange/50`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-bone/10 text-lg text-bone backdrop-blur transition group-hover:scale-110 group-hover:bg-orange/80">
                  &#9654;
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-obsidian/95 to-transparent p-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-orange-soft">{reel.category}</p>
                <p className="font-display text-sm leading-tight text-bone">{reel.title}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <ReelModal reel={activeReel} onClose={() => setActiveIndex(null)} onNavigate={navigate} />
    </section>
  )
}
