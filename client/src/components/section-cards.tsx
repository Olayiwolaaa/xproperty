import { TrendingUpIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PROPERTIES } from "@/data/properties"
import { fmtCompact, fmtNGN } from "@/lib/mortgage"

// Metrics derived from the real property data layer.
function useMetrics() {
  const total = PROPERTIES.length
  const portfolio = PROPERTIES.reduce((s, p) => s + p.price, 0)
  const avgPpsf = Math.round(
    PROPERTIES.reduce((s, p) => s + p.pricePerSqft, 0) / total,
  )
  const markets = new Set(PROPERTIES.map((p) => `${p.city}, ${p.state}`)).size
  const states = new Set(PROPERTIES.map((p) => p.state)).size
  const newCount = PROPERTIES.filter((p) => p.isNew).length
  const openHouses = PROPERTIES.filter((p) => p.openHouse).length
  const ppsf = PROPERTIES.map((p) => p.pricePerSqft)
  return {
    total,
    portfolio,
    avgPpsf,
    markets,
    states,
    newCount,
    openHouses,
    newPct: Math.round((newCount / total) * 100),
    minPpsf: Math.min(...ppsf),
    maxPpsf: Math.max(...ppsf),
  }
}

export function SectionCards() {
  const m = useMetrics()

  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Active listings</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {m.total}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              {m.newPct}% new
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {m.newCount} new this cycle <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {m.openHouses} open houses scheduled
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Portfolio value</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {fmtCompact(m.portfolio)}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              {fmtCompact(Math.round(m.portfolio / m.total))} avg
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total list value across the book
          </div>
          <div className="text-muted-foreground">
            Spanning {m.total} active listings
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Average price / sqft</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {fmtNGN(m.avgPpsf)}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              blended
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Ranges {fmtNGN(m.minPpsf)}–{fmtNGN(m.maxPpsf)} / sqft
          </div>
          <div className="text-muted-foreground">
            Weighted by current inventory
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Markets covered</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {m.markets}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              {m.states} states
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Listings across {m.states} states
          </div>
          <div className="text-muted-foreground">
            {m.markets} distinct cities served
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
