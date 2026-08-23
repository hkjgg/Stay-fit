import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ADD_ONS, PLANS } from '../../data/membership'
import { AnimatedPrice } from '../ui/AnimatedPrice'
import { WHATSAPP_NUMBER } from '../../lib/constants'

export function MembershipConfigurator() {
  const [planId, setPlanId] = useState(PLANS[1].id)
  const [addOns, setAddOns] = useState<Set<string>>(new Set())

  const plan = PLANS.find((p) => p.id === planId)!
  const total = useMemo(() => {
    const addOnTotal = ADD_ONS.filter((a) => addOns.has(a.id)).reduce((sum, a) => sum + a.price, 0)
    return plan.price + addOnTotal
  }, [plan, addOns])

  const toggleAddOn = (id: string) => {
    setAddOns((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const waMessage = encodeURIComponent(
    `Hi Stay Fit! I'd like to join the ${plan.name} plan${
      addOns.size ? ` with add-ons: ${[...addOns].map((id) => ADD_ONS.find((a) => a.id === id)?.label).join(', ')}` : ''
    } (~$${total}/mo).`,
  )

  return (
    <section id="membership" className="relative bg-obsidian-soft px-6 py-24 md:px-12 lg:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-blue-soft">
            Membership
          </span>
          <h2 className="font-display text-5xl text-bone md:text-6xl">BUILD YOUR PLAN</h2>
          <p className="mx-auto mt-4 max-w-md text-bone/50">
            Pick a base plan, toggle the extras you actually want, and see your monthly
            price update live.
          </p>
        </div>

        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {PLANS.map((p) => {
            const active = p.id === planId
            return (
              <button
                key={p.id}
                onClick={() => setPlanId(p.id)}
                className={`relative rounded-2xl border px-6 py-6 text-left transition ${
                  active
                    ? 'border-orange bg-orange/10 shadow-[0_0_30px_rgba(255,85,0,0.2)]'
                    : 'border-bone/10 bg-white/[0.02] hover:border-bone/25'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="plan-badge"
                    className="absolute -top-3 right-4 rounded-full bg-orange px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-obsidian"
                  >
                    Selected
                  </motion.span>
                )}
                <p className="font-display text-2xl text-bone">{p.name}</p>
                <p className="mt-1 text-sm text-bone/50">{p.blurb}</p>
                <p className="mt-4 font-display text-3xl text-orange-soft">
                  ${p.price}
                  <span className="ml-1 text-sm text-bone/40">/mo</span>
                </p>
                <ul className="mt-4 space-y-1.5 text-xs text-bone/60">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-bone/40" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </button>
            )
          })}
        </div>

        <div className="grid gap-8 rounded-3xl border border-bone/10 bg-white/[0.02] p-6 md:grid-cols-[1.3fr_1fr] md:p-10">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-bone/50">
              Add-ons
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {ADD_ONS.map((addOn) => {
                const active = addOns.has(addOn.id)
                return (
                  <label
                    key={addOn.id}
                    className={`flex cursor-pointer items-start justify-between gap-3 rounded-xl border px-4 py-3 transition ${
                      active ? 'border-blue bg-blue/10' : 'border-bone/10 bg-white/[0.02] hover:border-bone/25'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-bone">{addOn.label}</p>
                      <p className="text-xs text-bone/45">{addOn.description}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-sm text-blue-soft">+${addOn.price}</span>
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => toggleAddOn(addOn.id)}
                        className="h-4 w-4 accent-blue"
                      />
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent p-6 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-bone/50">Estimated Monthly</p>
            <p className="font-display mt-2 text-6xl text-bone">
              $<AnimatedPrice value={total} />
            </p>
            <p className="mt-1 text-xs text-bone/40">{plan.name} plan + {addOns.size} add-on{addOns.size === 1 ? '' : 's'}</p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
              target="_blank"
              rel="noreferrer"
              className="mt-6 w-full rounded-full bg-gradient-to-r from-orange to-blue px-6 py-3 text-sm font-semibold uppercase tracking-wide text-obsidian transition hover:scale-[1.03]"
            >
              Claim This Plan
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
