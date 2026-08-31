import { Link } from "react-router"

import { RowActions } from "@/components/admin/row-actions"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SALES_LISTINGS } from "@/data/salesListings"
import { fmtNGN } from "@/lib/mortgage"

const recent = [...SALES_LISTINGS]
  .sort((a, b) => b.listedDate.localeCompare(a.listedDate))
  .slice(0, 8)

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

// Recent activity slice of the real sales pipeline for the dashboard overview.
export function DataTable() {
  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1">
            <CardTitle>Recent listings</CardTitle>
            <CardDescription>Latest activity across the sales pipeline</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/listings">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Listing</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Listed</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>
                      <div className="font-medium text-foreground">{l.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {l.address}, {l.city}, {l.state}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{l.type}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {fmtNGN(l.price)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={l.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {fmtDate(l.listedDate)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{l.agent}</TableCell>
                    <TableCell>
                      <RowActions label={l.title} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
