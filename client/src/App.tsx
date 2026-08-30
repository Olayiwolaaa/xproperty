import { Routes, Route, Outlet } from 'react-router'
import { MarketplaceProvider } from '@/context/MarketplaceContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BrowsePage from '@/pages/BrowsePage'
import PropertyDetailPage from '@/pages/PropertyDetailPage'
import MortgagePage from '@/pages/MortgagePage'
import SavedPage from '@/pages/SavedPage'
import SellPage from '@/pages/SellPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'

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

        {/* Admin panel owns the full viewport: its own sidebar + header, no marketplace chrome */}
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </MarketplaceProvider>
  )
}
