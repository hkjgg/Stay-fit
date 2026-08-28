import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import type { Reel } from '../../data/reels'

interface ReelModalProps {
  reel: Reel | null
  onClose: () => void
  onNavigate: (dir: 1 | -1) => void
}

export function ReelModal({ reel, onClose, onNavigate }: ReelModalProps) {
  useEffect(() => {
    if (!reel) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNavigate(1)
      if (e.key === 'ArrowLeft') onNavigate(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [reel, onClose, onNavigate])

  return (
    <AnimatePresence>
      {reel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-obsidian/80 backdrop-blur-sm md:backdrop-blur-xl px-4"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            aria-label="Close reel"
            className="glass absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full text-bone transition hover:text-orange"
          >
            &#10005;
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onNavigate(-1)
            }}
            aria-label="Previous reel"
            className="glass absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-bone transition hover:text-blue-soft sm:flex md:left-8"
          >
            &#8592;
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onNavigate(1)
            }}
            aria-label="Next reel"
            className="glass absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-bone transition hover:text-blue-soft sm:flex md:right-8"
          >
            &#8594;
          </button>

          <motion.div
            key={reel.id}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="glass relative aspect-9/16 w-full max-w-sm overflow-hidden rounded-3xl"
          >
            <video
              className="h-full w-full object-cover"
              src={reel.video}
              controls
              autoPlay
              loop
              playsInline
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-obsidian/90 to-transparent p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-orange-soft">{reel.category}</p>
              <p className="font-display text-xl text-bone">{reel.title}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
