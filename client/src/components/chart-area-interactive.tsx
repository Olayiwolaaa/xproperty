import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { PROPERTIES } from "@/data/properties"
import { MARKETS } from "@/data/sell"
import { PROPERTY_TYPES } from "@/types"
import { fmtNGN } from "@/lib/mortgage"

const byType = PROPERTY_TYPES.map((type) => ({
  type,
  count: PROPERTIES.filter((p) => p.type === type).length,
}))

const byMarket = [...MARKETS]
  .sort((a, b) => b.ppsqft - a.ppsqft)
  .slice(0, 8)
  .map((m) => ({ market: m.name.split(",")[0], ppsqft: m.ppsqft }))

const typeConfig = {
  count: { label: "Listings", color: "#20664c" },
} satisfies ChartConfig

const marketConfig = {
  ppsqft: { label: "$/sqft", color: "#b08d57" },
} satisfies ChartConfig

// Real breakdowns of the property book: inventory by type (properties.ts) and
// valuation by market (sell.ts), both rendered through the shadcn chart wrapper.
export function ChartAreaInteractive() {
  return (
    <div className="grid gap-4 @4xl/main:grid-cols-2">
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Listings by type</CardTitle>
          <CardDescription>Active inventory across property types</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={typeConfig} className="aspect-auto h-[240px] w-full">
            <BarChart data={byType} margin={{ left: 4, right: 4 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="type" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Price per sqft by market</CardTitle>
          <CardDescription>Top markets by valuation ($/sqft)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={marketConfig} className="aspect-auto h-[240px] w-full">
            <BarChart data={byMarket} margin={{ left: 4, right: 4 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="market"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval={0}
                angle={-30}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={48}
                tickFormatter={(v) => fmtNGN(Number(v))}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="ppsqft" fill="var(--color-ppsqft)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
