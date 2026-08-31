// Mock admin dataset — Land & Housing line (land plots and housing developments).
export type LandStatus = 'Available' | 'Under Offer' | 'Sold'
export type LandZoning = 'Residential' | 'Commercial' | 'Agricultural' | 'Mixed-use'

export interface LandListing {
  id: string
  name: string
  city: string
  state: string
  areaAcres: number
  price: number
  zoning: LandZoning
  status: LandStatus
  listedDate: string
  agent: string
}

export const LAND_STATUSES: LandStatus[] = ['Available', 'Under Offer', 'Sold']
export const LAND_ZONING: LandZoning[] = ['Residential', 'Commercial', 'Agricultural', 'Mixed-use']

export const LAND_LISTINGS: LandListing[] = [
  { id: 'ld-01', name: 'Sangotedo Residential Plot', city: 'Ajah', state: 'Lagos', areaAcres: 4.2, price: 385000, zoning: 'Residential', status: 'Available', listedDate: '2026-08-20', agent: 'Tunde Bakare' },
  { id: 'ld-02', name: 'Abijo GRA Development', city: 'Ibeju-Lekki', state: 'Lagos', areaAcres: 38.0, price: 2450000, zoning: 'Mixed-use', status: 'Under Offer', listedDate: '2026-08-08', agent: 'Chidinma Eze' },
  { id: 'ld-03', name: 'Epe Waterside Farmland', city: 'Epe', state: 'Lagos', areaAcres: 120.5, price: 1780000, zoning: 'Agricultural', status: 'Available', listedDate: '2026-07-30', agent: 'Adaeze Okonkwo' },
  { id: 'ld-04', name: 'Lekki Free Zone Commercial Lot', city: 'Ibeju-Lekki', state: 'Lagos', areaAcres: 6.8, price: 1290000, zoning: 'Commercial', status: 'Available', listedDate: '2026-08-25', agent: 'Emeka Obi' },
  { id: 'ld-05', name: 'Chevron Ridge Estate', city: 'Lekki', state: 'Lagos', areaAcres: 22.4, price: 1650000, zoning: 'Residential', status: 'Sold', listedDate: '2026-06-18', agent: 'Tunde Bakare' },
  { id: 'ld-06', name: 'Oniru Housing Tract', city: 'Victoria Island', state: 'Lagos', areaAcres: 15.0, price: 2980000, zoning: 'Residential', status: 'Under Offer', listedDate: '2026-08-14', agent: 'Adaeze Okonkwo' },
  { id: 'ld-07', name: 'Eko Atlantic Mixed District', city: 'Victoria Island', state: 'Lagos', areaAcres: 3.1, price: 3400000, zoning: 'Mixed-use', status: 'Available', listedDate: '2026-08-03', agent: 'Chidinma Eze' },
  { id: 'ld-08', name: 'Ikorodu Waterfront Acreage', city: 'Ikorodu', state: 'Lagos', areaAcres: 9.6, price: 1120000, zoning: 'Agricultural', status: 'Available', listedDate: '2026-08-22', agent: 'Emeka Obi' },
  { id: 'ld-09', name: 'Oniru Retail Pad', city: 'Victoria Island', state: 'Lagos', areaAcres: 1.9, price: 2260000, zoning: 'Commercial', status: 'Sold', listedDate: '2026-07-05', agent: 'Adaeze Okonkwo' },
  { id: 'ld-10', name: 'Sangotedo Subdivision', city: 'Ajah', state: 'Lagos', areaAcres: 28.7, price: 4150000, zoning: 'Residential', status: 'Available', listedDate: '2026-08-27', agent: 'Tunde Bakare' },
]
