import { WHATSAPP_LOCATION, WHATSAPP_NUMBER } from '../../lib/constants'

export function Footer() {
  return (
    <footer id="contact" className="relative border-t border-bone/10 bg-obsidian px-6 py-16 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:justify-between">
        <div>
          <p className="font-display text-2xl text-bone">
            STAY<span className="text-orange">FIT</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-bone/50">
            Sore today, strong tomorrow. Heavy lifting, kinetic cardio, and VIP solarium
            recovery in {WHATSAPP_LOCATION}.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-bone/40">Visit</p>
            <p className="text-sm text-bone/70">{WHATSAPP_LOCATION}</p>
            <p className="mt-1 text-sm text-bone/70">Beirut, Lebanon</p>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-bone/40">Contact</p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="block text-sm text-bone/70 transition hover:text-orange-soft"
            >
              WhatsApp Us
            </a>
            <p className="mt-1 text-sm text-bone/70">Daily 6am &ndash; 12am</p>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-bone/40">Zones</p>
            <p className="text-sm text-bone/70">Heavy Lifting</p>
            <p className="text-sm text-bone/70">Cardio &amp; Kinetic</p>
            <p className="text-sm text-bone/70">Solarium &amp; Recovery</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-bone/10 pt-6 text-xs text-bone/40 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Stay Fit Fitness Center. All rights reserved.</p>
        <p>Built for people who train like it matters.</p>
      </div>
    </footer>
  )
}
