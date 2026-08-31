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
import { RENTALS, RENTAL_STATUSES } from "@/data/rentals"
import { fmtNGN } from "@/lib/mortgage"

const fmtDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—"

export default function PropertyManagementPage() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return RENTALS.filter((r) => {
      if (q && !`${r.property} ${r.tenant ?? ""} ${r.city} ${r.state}`.toLowerCase().includes(q)) return false
      if (status !== "all" && r.status !== status) return false
      return true
    })
  }, [query, status])

  return (
    <>
      <AdminPageHeader
        title="Property Management"
        description="Managed rentals, tenants, and maintenance across the portfolio."
        addLabel="Add rental"
      />

      <div className="px-4 lg:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative sm:max-w-xs sm:flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search property or tenant…"
              className="pl-9"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {RENTAL_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead className="text-right">Rent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Lease end</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    No rentals match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="font-medium text-foreground">{r.property}</div>
                      <div className="text-xs text-muted-foreground">{r.unit}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.city}, {r.state}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{r.tenant ?? "—"}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {fmtNGN(r.monthlyRent)}/mo
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={r.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{fmtDate(r.leaseEnd)}</TableCell>
                    <TableCell className="text-muted-foreground">{r.manager}</TableCell>
                    <TableCell>
                      <RowActions label={r.property} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <p className="mt-3 text-sm text-muted-foreground">
          {rows.length} of {RENTALS.length} rentals
        </p>
      </div>
    </>
  )
}
