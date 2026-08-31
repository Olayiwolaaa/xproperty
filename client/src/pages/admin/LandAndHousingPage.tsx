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
  LAND_LISTINGS,
  LAND_STATUSES,
  LAND_ZONING,
} from "@/data/landListings"
import { fmtNGN } from "@/lib/mortgage"

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

export default function LandAndHousingPage() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")
  const [zoning, setZoning] = useState("all")

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return LAND_LISTINGS.filter((l) => {
      if (q && !`${l.name} ${l.city} ${l.state}`.toLowerCase().includes(q)) return false
      if (status !== "all" && l.status !== status) return false
      if (zoning !== "all" && l.zoning !== zoning) return false
      return true
    })
  }, [query, status, zoning])

  return (
    <>
      <AdminPageHeader
        title="Land & Housing"
        description="Land plots and housing developments available for acquisition."
        addLabel="Add parcel"
      />

      <div className="px-4 lg:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative sm:max-w-xs sm:flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search parcel or location…"
              className="pl-9"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {LAND_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={zoning} onValueChange={setZoning}>
            <SelectTrigger className="sm:w-44">
              <SelectValue placeholder="Zoning" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All zoning</SelectItem>
              {LAND_ZONING.map((z) => (
                <SelectItem key={z} value={z}>
                  {z}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Parcel</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Area (ac)</TableHead>
                <TableHead>Zoning</TableHead>
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
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    No parcels match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium text-foreground">{l.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {l.city}, {l.state}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{l.areaAcres}</TableCell>
                    <TableCell className="text-muted-foreground">{l.zoning}</TableCell>
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
                      <RowActions label={l.name} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <p className="mt-3 text-sm text-muted-foreground">
          {rows.length} of {LAND_LISTINGS.length} parcels
        </p>
      </div>
    </>
  )
}
