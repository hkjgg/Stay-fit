export interface Plan {
  id: string
  name: string
  price: number
  blurb: string
  perks: string[]
}

export interface AddOn {
  id: string
  label: string
  price: number
  description: string
}

export const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 35,
    blurb: 'Full gym floor, open hours',
    perks: ['Heavy Lifting Zone access', 'Standard equipment', 'Locker room'],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 55,
    blurb: 'Floor + Cardio & Kinetic classes',
    perks: ['Everything in Basic', 'Cardio & Kinetic Zone classes', 'Free fitness assessment'],
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 85,
    blurb: 'All-access, priority everything',
    perks: ['Everything in Standard', 'Fuel & Recovery Hub access', 'Priority booking'],
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
