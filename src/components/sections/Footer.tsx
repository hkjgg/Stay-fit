import { useState } from 'react'
import {
  MAP_EMBED_URL,
  MAP_LINK_URL,
  OPENING_HOURS,
  WHATSAPP_LOCATION,
  whatsappLink,
} from '../../lib/constants'

const CYAN = '#00f3ff'

export function Footer() {
  const [mapLoaded, setMapLoaded] = useState(false)

  return (
    <footer id="contact" className="relative border-t border-bone/10 bg-obsidian px-4 py-14 md:px-12 md:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:justify-between">
        <div>
          <p className="font-display text-2xl text-bone">
            STAY<span className="text-orange">FIT</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-bone/50">
            Sore today, strong tomorrow. Heavy lifting, kinetic cardio, and fuel &amp;
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
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="block text-sm text-bone/70 transition hover:text-orange-soft"
            >
              WhatsApp Us
            </a>
            <p className="mt-1 text-sm text-bone/70">Daily {OPENING_HOURS}</p>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-bone/40">Zones</p>
            <p className="text-sm text-bone/70">Heavy Lifting</p>
            <p className="text-sm text-bone/70">Cardio &amp; Kinetic</p>
            <p className="text-sm text-bone/70">Fuel &amp; Recovery</p>
          </div>
        </div>
      </div>

      {/* Location: satellite view of the gym's area. The `output=embed` form of
          Google Maps needs no API key, and `t=k` selects the satellite basemap. */}
      <div id="location" className="mx-auto mt-14 max-w-6xl">
        <div className="mb-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <span
              className="mb-3 inline-flex items-center rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] backdrop-blur-sm md:backdrop-blur-md"
              style={{
                borderColor: `${CYAN}66`,
                color: CYAN,
                background: 'rgba(255,255,255,0.03)',
                boxShadow: `0 0 18px ${CYAN}33`,
              }}
            >
              Find Us
            </span>
            <p className="font-display text-3xl text-bone sm:text-4xl">{WHATSAPP_LOCATION}</p>
          </div>

          <a
            href={MAP_LINK_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-bone transition hover:scale-[1.03]"
            style={{
              borderColor: `${CYAN}70`,
              background: 'rgba(255,255,255,0.05)',
              boxShadow: `0 0 26px ${CYAN}40`,
            }}
          >
            Open Satellite Map
            <span style={{ color: CYAN }}>&#8599;</span>
          </a>
        </div>

        <div
          className="relative overflow-hidden rounded-2xl border bg-obsidian-soft"
          style={{ borderColor: `${CYAN}40`, boxShadow: `0 0 34px ${CYAN}25` }}
        >
          {/* Click-to-load rather than an always-on embed. An iframe paints its
              own opaque background, including the browser's grey error frame,
              and a cross-origin embed gives no reliable way to tell a loaded map
              from a blocked one (`onLoad` fires for the error page too). So a
              failed embed would drop a bright grey slab into this dark page with
              nothing we could do about it. Loading on demand keeps the panel
              on-brand, and skips a third-party request on phones until asked. */}
          {mapLoaded ? (
            <iframe
              title={`Satellite map of Stay Fit Fitness Center, ${WHATSAPP_LOCATION}`}
              src={MAP_EMBED_URL}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="relative h-[280px] w-full border-0 md:h-[380px]"
            />
          ) : (
            <div className="flex h-[280px] w-full flex-col items-center justify-center gap-3 px-6 text-center md:h-[380px]">
              <p className="text-xs uppercase tracking-[0.3em] text-bone/40">Satellite View</p>
              <p className="font-display text-2xl text-bone/80">{WHATSAPP_LOCATION}</p>
              <button
                onClick={() => setMapLoaded(true)}
                className="mt-1 rounded-full border px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-bone transition hover:scale-[1.03]"
                style={{
                  borderColor: `${CYAN}70`,
                  background: 'rgba(255,255,255,0.05)',
                  boxShadow: `0 0 26px ${CYAN}40`,
                }}
              >
                Load Interactive Map
              </button>
              <p className="text-[11px] text-bone/35">
                Or use “Open Satellite Map” above for full-screen directions
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-bone/10 pt-6 text-xs text-bone/40 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Stay Fit Fitness Center. All rights reserved.</p>
        <p>Built for people who train like it matters.</p>
      </div>
    </footer>
  )
}
