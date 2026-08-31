import { Routes, Route, Outlet } from 'react-router'
import { MarketplaceProvider } from '@/context/MarketplaceContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BrowsePage from '@/pages/BrowsePage'
import PropertyDetailPage from '@/pages/PropertyDetailPage'
import MortgagePage from '@/pages/MortgagePage'
import SavedPage from '@/pages/SavedPage'
import SellPage from '@/pages/SellPage'
import AdminLayout from '@/pages/admin/AdminLayout'
import DashboardPage from '@/pages/admin/DashboardPage'
import PropertySalesPage from '@/pages/admin/PropertySalesPage'
import LandAndHousingPage from '@/pages/admin/LandAndHousingPage'
import PropertyManagementPage from '@/pages/admin/PropertyManagementPage'

// Consumer marketplace shell: sticky navbar + footer around the page content.
function MarketplaceLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <MarketplaceProvider>
      <Routes>
        {/* Marketplace routes share the navbar/footer chrome */}
        <Route element={<MarketplaceLayout />}>
          <Route path="/" element={<BrowsePage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
          <Route path="/sell" element={<SellPage />} />
          <Route path="/mortgage" element={<MortgagePage />} />
          <Route path="/saved" element={<SavedPage />} />
        </Route>

        {/* Admin panel: its own sidebar + header shell, no marketplace chrome */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="listings" element={<PropertySalesPage />} />
          <Route path="sales" element={<LandAndHousingPage />} />
          <Route path="rentals" element={<PropertyManagementPage />} />
        </Route>
      </Routes>
    </MarketplaceProvider>
  )
}
