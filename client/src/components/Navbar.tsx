import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { Building2, Calculator, Heart, Home, KeyRound, LandPlot, Menu, Tag, User, X } from 'lucide-react'
import Logo from '@/components/Logo'
import { useMarketplace } from '@/context/MarketplaceContext'
import { cn } from '@/lib/utils'

const links = [
  { to: '/', label: 'Buy', icon: Home },
  { to: '/sell', label: 'Sell', icon: Tag },
  { to: '/rent', label: 'Rent & Airbnb', icon: Building2 },
  { to: '/land', label: 'Land', icon: LandPlot },
  { to: '/manage', label: 'Manage', icon: KeyRound },
  { to: '/mortgage', label: 'Mortgage', icon: Calculator },
  { to: '/saved', label: 'Saved', icon: Heart },
  { to: '/admin', label: 'Dashboard', icon: User },
]

export default function Navbar() {
  const { favorites, savedSearches } = useMarketplace()
  const savedCount = favorites.length + savedSearches.length
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Logo size={38} />
          <div className="flex flex-col leading-none">
            <span className="font-display text-[1.35rem] font-bold tracking-tight text-stone-900 transition-colors group-hover:text-forest-800">
              xProperty
            </span>
            <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-brass-600">
              Real Estates
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="ml-auto hidden items-center gap-1.5 md:flex">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-forest-900 text-cream shadow-sm'
                    : 'text-stone-600 hover:bg-stone-900/5 hover:text-stone-900',
                )
              }
            >
              <Icon className="h-4 w-4" />
              <span className="hidden lg:inline">{label}</span>
              {to === '/saved' && savedCount > 0 && (
                <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brass-500 px-1.5 text-[11px] font-bold text-white">
                  {savedCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="relative ml-auto flex h-10 w-10 items-center justify-center rounded-full text-stone-700 hover:bg-stone-900/5 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          {!open && savedCount > 0 && (
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-brass-500" />
          )}
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {open && (
        <nav className="border-t border-stone-200/70 bg-cream/95 px-4 py-3 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-forest-900 text-cream'
                      : 'text-stone-700 hover:bg-stone-900/5',
                  )
                }
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
                {to === '/saved' && savedCount > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-brass-500 px-1.5 text-[11px] font-bold text-white">
                    {savedCount}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
