import { Camera, Handshake, LineChart, SearchCheck, type LucideIcon } from 'lucide-react'

export interface Market {
  name: string
  ppsqft: number
}

export interface Condition {
  name: string
  mult: number
}

export interface SellStep {
  icon: LucideIcon
  title: string
  text: string
}

export const MARKETS: Market[] = [
  { name: 'Banana Island', ppsqft: 900 },
  { name: 'Eko Atlantic', ppsqft: 800 },
  { name: 'Ikoyi', ppsqft: 720 },
  { name: 'Victoria Island', ppsqft: 650 },
  { name: 'Oniru', ppsqft: 560 },
  { name: 'Lekki Phase 1', ppsqft: 480 },
  { name: 'Chevron', ppsqft: 350 },
  { name: 'Ikate', ppsqft: 340 },
  { name: 'Lekki', ppsqft: 320 },
  { name: 'Ajah', ppsqft: 235 },
  { name: 'Sangotedo', ppsqft: 180 },
]

export const CONDITIONS: Condition[] = [
  { name: 'Needs work', mult: 0.88 },
  { name: 'Good', mult: 1.0 },
  { name: 'Updated', mult: 1.08 },
  { name: 'Recently renovated', mult: 1.16 },
]

export const steps: SellStep[] = [
  { icon: LineChart, title: 'Get your estimate', text: 'Start with an instant valuation based on your market, size, and condition.' },
  { icon: SearchCheck, title: 'Prep with a pro', text: 'A xProperty advisor walks your home and recommends high-ROI touch-ups.' },
  { icon: Camera, title: 'List beautifully', text: 'Pro photography, staging, and placement in front of qualified buyers.' },
  { icon: Handshake, title: 'Close with confidence', text: 'We negotiate offers and manage paperwork through closing day.' },
]
