import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { WHATSAPP_LOCATION, WHATSAPP_NUMBER } from '../../lib/constants'

export function WhatsAppCTA() {
  const [open, setOpen] = useState(false)
  const message = encodeURIComponent("Hi Stay Fit! I'd like to know more about membership.")

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="glass w-72 rounded-2xl p-4 text-left shadow-2xl"
          >
            <p className="font-display text-lg text-bone">STAY FIT</p>
            <p className="mt-1 text-xs text-bone/60">{WHATSAPP_LOCATION}</p>
            <p className="mt-3 text-sm text-bone/75">
              Questions about plans, hours, or the fuel bar? Message us directly on WhatsApp.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-obsidian transition hover:scale-[1.02]"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Open WhatsApp chat"
        className="glass flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366]/90 text-obsidian shadow-[0_8px_30px_rgba(37,211,102,0.35)]"
      >
        <WhatsAppIcon className="h-6 w-6" />
      </motion.button>
    </div>
  )
}

function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.02 2C6.5 2 2.02 6.48 2.02 12c0 1.85.5 3.6 1.36 5.1L2 22l5.05-1.32A9.94 9.94 0 0 0 12.02 22C17.55 22 22 17.52 22 12S17.55 2 12.02 2Zm0 18.1c-1.62 0-3.14-.44-4.44-1.2l-.32-.19-3 .78.8-2.93-.2-.3a8.07 8.07 0 0 1-1.24-4.26c0-4.48 3.65-8.12 8.14-8.12 4.5 0 8.14 3.64 8.14 8.12s-3.65 8.1-8.14 8.1Zm4.47-6.07c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.42-.14 0-.3-.02-.46-.02s-.42.06-.64.3c-.22.24-.85.83-.85 2.02 0 1.19.87 2.34.99 2.5.12.16 1.71 2.6 4.14 3.65.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  )
}
