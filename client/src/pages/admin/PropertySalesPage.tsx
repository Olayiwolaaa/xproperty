import { useMemo, useState } from "react"
import { SearchIcon } from "lucide-react"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { RowActions } from "@/components/admin/row-actions"
import { StatusBadge } from "@/components/admin/status-badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  SALES_CATEGORIES,
  SALES_LISTINGS,
  SALES_STATUSES,
} from "@/data/salesListings"
import { fmtNGN } from "@/lib/mortgage"

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

export default function PropertySalesPage() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")
  const [category, setCategory] = useState("all")

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return SALES_LISTINGS.filter((l) => {
      if (q && !`${l.title} ${l.address} ${l.city} ${l.state}`.toLowerCase().includes(q)) return false
      if (status !== "all" && l.status !== status) return false
      if (category !== "all" && l.category !== category) return false
      return true
    })
  }, [query, status, category])

  return (
    <>
      <AdminPageHeader
        title="Property Sales"
        description="Residential & commercial listings across the sales pipeline."
        addLabel="Add listing"
      />

      <div className="px-4 lg:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative sm:max-w-xs sm:flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title or address…"
              className="pl-9"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {SALES_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="sm:w-44">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {SALES_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Listing</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Listed</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    No listings match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>
                      <div className="font-medium text-foreground">{l.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {l.address}, {l.city}, {l.state}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{l.category}</TableCell>
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
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <p className="mt-3 text-sm text-muted-foreground">
          {rows.length} of {SALES_LISTINGS.length} listings
        </p>
      </div>
    </>
  )
}
