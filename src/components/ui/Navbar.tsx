import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const LINKS = [
  { href: '#reels', label: 'Inside' },
  { href: '#membership', label: 'Membership' },
  { href: '#contact', label: 'Contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-4 transition-colors duration-300 md:px-10 ${
        scrolled ? 'glass' : 'bg-transparent'
      }`}
    >
      <a href="#top" className="font-display text-xl tracking-wide text-bone">
        STAY<span className="text-orange">FIT</span>
      </a>
      <nav className="hidden items-center gap-8 md:flex">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-sm font-medium uppercase tracking-wide text-bone/70 transition hover:text-bone"
          >
            {link.label}
          </a>
        ))}
      </nav>
      <a
        href="#membership"
        className="rounded-full border border-bone/25 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-bone transition hover:border-orange hover:text-orange-soft"
      >
        Join Now
      </a>
    </motion.header>
  )
}
