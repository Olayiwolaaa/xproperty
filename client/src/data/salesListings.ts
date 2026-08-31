// Mock admin dataset — Property Sales line (residential & commercial for-sale listings).
export type SalesStatus = 'Active' | 'Pending' | 'Sold'
export type SalesCategory = 'Residential' | 'Commercial'

export interface SalesListing {
  id: string
  title: string
  address: string
  city: string
  state: string
  price: number
  category: SalesCategory
  type: string
  beds: number
  baths: number
  sqft: number
  status: SalesStatus
  listedDate: string
  agent: string
}

export const SALES_STATUSES: SalesStatus[] = ['Active', 'Pending', 'Sold']
export const SALES_CATEGORIES: SalesCategory[] = ['Residential', 'Commercial']

export const SALES_LISTINGS: SalesListing[] = [
  { id: 'sl-01', title: 'Lekki Phase 1 Modern Villa', address: '14 Admiralty Way', city: 'Lekki', state: 'Lagos', price: 1249000, category: 'Residential', type: 'House', beds: 5, baths: 4, sqft: 3480, status: 'Active', listedDate: '2026-08-24', agent: 'Adaeze Okonkwo' },
  { id: 'sl-02', title: 'Osborne Foreshore Bungalow', address: '3 Osborne Road', city: 'Ikoyi', state: 'Lagos', price: 689000, category: 'Residential', type: 'House', beds: 3, baths: 2, sqft: 1875, status: 'Pending', listedDate: '2026-08-19', agent: 'Tunde Bakare' },
  { id: 'sl-03', title: 'Ikate Elegushi Townhome', address: '2210 Freedom Way', city: 'Lekki', state: 'Lagos', price: 745000, category: 'Residential', type: 'Townhouse', beds: 3, baths: 3, sqft: 2140, status: 'Active', listedDate: '2026-08-27', agent: 'Chidinma Eze' },
  { id: 'sl-04', title: 'Eko Pearl Tower Residence', address: '600 Ahmadu Bello Way #1204', city: 'Victoria Island', state: 'Lagos', price: 1120000, category: 'Residential', type: 'Condo', beds: 2, baths: 2, sqft: 1560, status: 'Active', listedDate: '2026-08-12', agent: 'Adaeze Okonkwo' },
  { id: 'sl-05', title: 'Marina Office Suite', address: '88 Marina Road', city: 'Lagos Island', state: 'Lagos', price: 3250000, category: 'Commercial', type: 'Office', beds: 0, baths: 4, sqft: 9800, status: 'Active', listedDate: '2026-08-05', agent: 'Emeka Obi' },
  { id: 'sl-06', title: 'Adeola Odeku Retail Block', address: '145 Adeola Odeku Street', city: 'Victoria Island', state: 'Lagos', price: 2140000, category: 'Commercial', type: 'Retail', beds: 0, baths: 3, sqft: 6400, status: 'Pending', listedDate: '2026-07-29', agent: 'Tunde Bakare' },
  { id: 'sl-07', title: 'Banana Island Waterfront Villa', address: 'Ocean Parade, Banana Island', city: 'Ikoyi', state: 'Lagos', price: 3475000, category: 'Residential', type: 'Villa', beds: 6, baths: 7, sqft: 7200, status: 'Active', listedDate: '2026-08-22', agent: 'Chidinma Eze' },
  { id: 'sl-08', title: 'Parkview Estate Mansion', address: '16 Kingsway Road, Parkview', city: 'Ikoyi', state: 'Lagos', price: 1895000, category: 'Residential', type: 'House', beds: 5, baths: 4, sqft: 4100, status: 'Sold', listedDate: '2026-06-30', agent: 'Emeka Obi' },
  { id: 'sl-09', title: 'Eko Atlantic Oceanfront Villa', address: '450 Eko Boulevard', city: 'Victoria Island', state: 'Lagos', price: 2790000, category: 'Residential', type: 'Villa', beds: 4, baths: 5, sqft: 3950, status: 'Pending', listedDate: '2026-08-15', agent: 'Adaeze Okonkwo' },
  { id: 'sl-10', title: 'Apapa Logistics Warehouse', address: '3300 Wharf Road', city: 'Apapa', state: 'Lagos', price: 4680000, category: 'Commercial', type: 'Industrial', beds: 0, baths: 2, sqft: 24000, status: 'Active', listedDate: '2026-08-02', agent: 'Tunde Bakare' },
  { id: 'sl-11', title: 'Chevron Drive Family House', address: '1320 Chevron Drive', city: 'Lekki', state: 'Lagos', price: 875000, category: 'Residential', type: 'House', beds: 4, baths: 4, sqft: 3120, status: 'Sold', listedDate: '2026-07-11', agent: 'Chidinma Eze' },
  { id: 'sl-12', title: 'Oniru Modern Home', address: '1775 Oniru Estate', city: 'Victoria Island', state: 'Lagos', price: 1450000, category: 'Residential', type: 'House', beds: 3, baths: 3, sqft: 2380, status: 'Active', listedDate: '2026-08-28', agent: 'Emeka Obi' },
]
