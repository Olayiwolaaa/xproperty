import {
  Building2,
  Handshake,
  KeyRound,
  LandPlot,
  Search,
  ShieldCheck,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

export interface Service {
  icon: LucideIcon
  title: string
  body: string
  to: string
  cta: string
  image: string
}

export interface ValueProp {
  icon: LucideIcon
  title: string
  body: string
}

export interface Step {
  n: string
  icon: LucideIcon
  title: string
  body: string
}

export interface Testimonial {
  quote: string
  name: string
  role: string
}

export const PRICE_STEPS = [500_000, 750_000, 1_000_000, 1_500_000, 2_000_000, 3_000_000]

export const SERVICES: Service[] = [
  {
    icon: Building2,
    title: 'Property Sales',
    body: 'Buy and sell residential & commercial properties with verified listings and expert agents at your side.',
    to: '/browse',
    cta: 'Browse properties',
    image: '/images/h1.jpg',
  },
  {
    icon: LandPlot,
    title: 'Land & Housing',
    body: 'Secure land plots and new housing developments — from half-acre lots to move-in-ready builds.',
    to: '/browse',
    cta: 'Explore land',
    image: '/images/h10.jpg',
  },
  {
    icon: KeyRound,
    title: 'Property Management',
    body: 'Rentals, tenants, maintenance, and owner services handled end to end, so ownership stays effortless.',
    to: '/rent',
    cta: 'Manage rentals',
    image: '/images/h9.jpg',
  },
]

export const VALUE_PROPS: ValueProp[] = [
  { icon: ShieldCheck, title: 'Verified listings', body: 'Every property is vetted and documented before it reaches you.' },
  { icon: Users, title: 'Expert agents', body: 'Local specialists who know each market street by street.' },
  { icon: Wallet, title: 'Transparent pricing', body: 'Honest numbers up front — payment estimates before you commit.' },
  { icon: KeyRound, title: 'End-to-end management', body: 'From first tour to keys and beyond, we handle the details.' },
]

export const STEPS: Step[] = [
  { n: '01', icon: Search, title: 'Search & discover', body: 'Filter by location, type, and budget to shortlist homes that fit.' },
  { n: '02', icon: Handshake, title: 'Connect with an expert', body: 'Tour properties and get straight answers from a dedicated agent.' },
  { n: '03', icon: KeyRound, title: 'Close or manage', body: 'Sign with confidence — then let us manage the property for you.' },
]

export const TESTIMONIALS: Testimonial[] = [
  { quote: 'Sold our Ikoyi bungalow in nine days, above asking. The pricing guidance was spot on.', name: 'Ada Balogun', role: 'Seller · Ikoyi, Lagos' },
  { quote: 'They found us a home that fit every box and walked us through closing without a single surprise.', name: 'Emeka Obi', role: 'Buyer · Lekki, Lagos' },
  { quote: 'Our rentals basically run themselves now. Tenant issues get handled before I even hear about them.', name: 'Ngozi Umeh', role: 'Owner · Victoria Island, Lagos' },
]
