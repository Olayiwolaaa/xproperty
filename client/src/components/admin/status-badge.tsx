import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type Tone = 'positive' | 'pending' | 'neutral'

// Maps every status across the admin datasets (sales / land / rentals) to a tone.
const STATUS_TONE: Record<string, Tone> = {
  Active: 'positive',
  Available: 'positive',
  Occupied: 'positive',
  Pending: 'pending',
  'Under Offer': 'pending',
  Maintenance: 'pending',
  Sold: 'neutral',
  Vacant: 'neutral',
}

const TONE_CLASS: Record<Tone, string> = {
  positive: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400',
  pending: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400',
  neutral: 'border-stone-200 bg-stone-100 text-stone-600 dark:border-stone-700 dark:bg-stone-800/40 dark:text-stone-300',
}

const DOT_CLASS: Record<Tone, string> = {
  positive: 'bg-emerald-500',
  pending: 'bg-amber-500',
  neutral: 'bg-stone-400',
}

export function StatusBadge({ status }: { status: string }) {
  const tone = STATUS_TONE[status] ?? 'neutral'
  return (
    <Badge variant="outline" className={cn('gap-1.5 font-medium', TONE_CLASS[tone])}>
      <span className={cn('h-1.5 w-1.5 rounded-full', DOT_CLASS[tone])} />
      {status}
    </Badge>
  )
}
