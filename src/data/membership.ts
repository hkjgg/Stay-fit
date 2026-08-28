export interface Plan {
  id: string
  name: string
  /** Omitted for inquiry-only packages — those show an "Inquire via WhatsApp"
   *  CTA instead of a fixed price, and are quoted per person over chat. */
  price?: number
  blurb: string
  perks: string[]
}

export interface AddOn {
  id: string
  label: string
  price: number
  description: string
}

// The headline monthly membership carries the only published price; every
// other package is quoted over WhatsApp rather than listed.
export const PLANS: Plan[] = [
  {
    id: 'monthly',
    name: 'Monthly Membership',
    price: 40,
    blurb: 'Full gym floor + all zones, month to month',
    perks: ['Heavy Lifting Zone access', 'Cardio & Kinetic Zone classes', 'Locker room'],
  },
  {
    id: 'personal',
    name: 'Personal Coaching',
    blurb: 'One-on-one programming with a coach',
    perks: ['Everything in Monthly', 'Dedicated coach sessions', 'Custom progression plan'],
  },
  {
    id: 'vip',
    name: 'VIP All-Access',
    blurb: 'All-access, priority everything',
    perks: ['Everything in Monthly', 'Fuel & Recovery Hub access', 'Priority booking'],
  },
]

export const ADD_ONS: AddOn[] = [
  {
    id: 'pt',
    label: 'Personal Training',
    price: 40,
    description: '4 one-on-one sessions / month',
  },
  {
    id: 'shakes',
    label: 'Custom Shake Plan',
    price: 25,
    description: '4 custom recovery shakes at the bar / month',
  },
  {
    id: 'nutrition',
    label: 'Nutrition Coaching',
    price: 20,
    description: 'Monthly plan + check-ins',
  },
  {
    id: 'locker',
    label: 'Premium Locker + Towel',
    price: 10,
    description: 'Reserved locker & fresh towel service',
  },
]
