// Mock admin dataset — Property Management line (managed rentals, tenants, maintenance).
export type RentalStatus = 'Occupied' | 'Vacant' | 'Maintenance'

export interface Rental {
  id: string
  property: string
  unit: string
  city: string
  state: string
  tenant: string | null
  monthlyRent: number
  status: RentalStatus
  leaseEnd: string | null
  manager: string
}

export const RENTAL_STATUSES: RentalStatus[] = ['Occupied', 'Vacant', 'Maintenance']

export const RENTALS: Rental[] = [
  { id: 'rt-01', property: 'Eko Pearl Tower Residence', unit: '#1204', city: 'Victoria Island', state: 'Lagos', tenant: 'J. Okafor', monthlyRent: 4200, status: 'Occupied', leaseEnd: '2027-03-31', manager: 'Chidinma Eze' },
  { id: 'rt-02', property: 'Ikate Elegushi Townhome', unit: 'Unit B', city: 'Lekki', state: 'Lagos', tenant: 'A. Balogun', monthlyRent: 3350, status: 'Occupied', leaseEnd: '2026-11-30', manager: 'Tunde Bakare' },
  { id: 'rt-03', property: 'Osborne Foreshore Bungalow', unit: 'Main', city: 'Ikoyi', state: 'Lagos', tenant: null, monthlyRent: 2800, status: 'Vacant', leaseEnd: null, manager: 'Adaeze Okonkwo' },
  { id: 'rt-04', property: 'Oniru Modern Home', unit: 'Main', city: 'Victoria Island', state: 'Lagos', tenant: 'K. Bello', monthlyRent: 5100, status: 'Occupied', leaseEnd: '2027-01-15', manager: 'Emeka Obi' },
  { id: 'rt-05', property: 'Marina Office Suite', unit: 'Suite 300', city: 'Lagos Island', state: 'Lagos', tenant: 'Falana & Co Chambers', monthlyRent: 12400, status: 'Occupied', leaseEnd: '2028-06-30', manager: 'Tunde Bakare' },
  { id: 'rt-06', property: 'Ilashe Beach House', unit: 'Cabin', city: 'Ilashe', state: 'Lagos', tenant: null, monthlyRent: 2450, status: 'Maintenance', leaseEnd: null, manager: 'Adaeze Okonkwo' },
  { id: 'rt-07', property: 'Chevron Drive Family House', unit: 'Main', city: 'Lekki', state: 'Lagos', tenant: 'The Adeyemis', monthlyRent: 3900, status: 'Occupied', leaseEnd: '2026-09-30', manager: 'Chidinma Eze' },
  { id: 'rt-08', property: 'Adeola Odeku Retail Block', unit: 'Bay 2', city: 'Victoria Island', state: 'Lagos', tenant: 'Cafe Neo', monthlyRent: 6800, status: 'Occupied', leaseEnd: '2027-05-31', manager: 'Emeka Obi' },
  { id: 'rt-09', property: 'Sangotedo Family Home', unit: 'Main', city: 'Ajah', state: 'Lagos', tenant: null, monthlyRent: 2600, status: 'Vacant', leaseEnd: null, manager: 'Tunde Bakare' },
  { id: 'rt-10', property: 'Old Ikoyi Garden Cottage', unit: 'Main', city: 'Ikoyi', state: 'Lagos', tenant: 'S. Nwosu', monthlyRent: 3700, status: 'Occupied', leaseEnd: '2026-12-31', manager: 'Chidinma Eze' },
  { id: 'rt-11', property: 'Apapa Logistics Warehouse', unit: 'Dock A', city: 'Apapa', state: 'Lagos', tenant: 'Dangote Logistics', monthlyRent: 18500, status: 'Occupied', leaseEnd: '2029-02-28', manager: 'Emeka Obi' },
  { id: 'rt-12', property: 'Banana Island Guest Villa', unit: 'Guest House', city: 'Ikoyi', state: 'Lagos', tenant: null, monthlyRent: 3200, status: 'Maintenance', leaseEnd: null, manager: 'Adaeze Okonkwo' },
]
