import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowRight, MapPin, Quote, Search, Star } from 'lucide-react'
import PropertyCard from '@/components/PropertyCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PROPERTIES } from '@/data/properties'
import { PROPERTY_TYPES, type PropertyType, type SearchFilters } from '@/types'
import { PRICE_STEPS, SERVICES, STEPS, TESTIMONIALS, VALUE_PROPS } from '@/data/landing'

const priceLabel = (v: number) => (v >= 1_000_000 ? `₦${v / 1_000_000}M` : `₦${v / 1_000}K`)

export default function LandingPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [type, setType] = useState<PropertyType | 'Any'>('Any')
  const [maxPrice, setMaxPrice] = useState<number | null>(null)

  const cities = new Set(PROPERTIES.map((p) => `${p.city}, ${p.state}`)).size
  const featured = PROPERTIES.slice(0, 6)

  const runSearch = () => {
    const filters: Partial<SearchFilters> = { query: query.trim(), type, maxPrice }
    navigate('/browse', { state: { filters } })
  }

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img src="/images/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/75 via-forest-950/50 to-forest-950/80" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pb-24 pt-20 text-center sm:px-6 sm:pt-28">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-brass-300">
            Buy · Sell · Manage — with confidence
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold leading-[1.05] tracking-tight text-cream sm:text-6xl">
            Find, sell, and manage property with confidence
          </h1>
          <p className="mt-5 max-w-xl text-lg text-stone-200">
            One trusted partner for homes, land, and rentals — verified listings, expert agents, and honest numbers from first search to final keys.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={() => navigate('/browse')}
              className="h-12 rounded-full bg-brass-500 px-7 text-base font-bold text-forest-950 shadow-lg hover:bg-brass-400"
            >
              Browse properties
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/sell')}
              className="h-12 rounded-full border-white/40 bg-white/10 px-7 text-base font-bold text-cream backdrop-blur hover:bg-white/20 hover:text-cream"
            >
              List your property
            </Button>
          </div>

          {/* Inline search */}
          <div className="mt-10 w-full max-w-3xl rounded-2xl bg-white/95 p-3 shadow-2xl backdrop-blur sm:rounded-full">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-2 sm:pl-3">
                <Search className="h-5 w-5 shrink-0 text-stone-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && runSearch()}
                  placeholder="City, address, or keyword…"
                  className="w-full bg-transparent py-2 text-[15px] text-stone-900 outline-none placeholder:text-stone-400"
                />
              </div>
              <Select value={type} onValueChange={(v) => setType(v as PropertyType | 'Any')}>
                <SelectTrigger className="h-10 border-stone-200 sm:w-[140px]">
                  <SelectValue placeholder="Any type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any">Any type</SelectItem>
                  {PROPERTY_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={maxPrice === null ? 'any' : String(maxPrice)}
                onValueChange={(v) => setMaxPrice(v === 'any' ? null : Number(v))}
              >
                <SelectTrigger className="h-10 border-stone-200 sm:w-[140px]">
                  <SelectValue placeholder="Any price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any price</SelectItem>
                  {PRICE_STEPS.map((p) => (
                    <SelectItem key={p} value={String(p)}>
                      Up to {priceLabel(p)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                onClick={runSearch}
                className="shrink-0 rounded-full bg-forest-800 px-7 py-2.5 text-sm font-bold text-cream transition-colors hover:bg-forest-900"
              >
                Search
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8 sm:gap-16">
            {[
              { v: '2,400+', l: 'Properties sold' },
              { v: '15,000+', l: 'Clients served' },
              { v: `${cities}+`, l: 'Cities covered' },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="font-display text-3xl font-bold text-cream sm:text-4xl">{s.v}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-stone-300">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brass-600">What we do</p>
          <h2 className="mt-1 font-display text-3xl font-bold text-stone-900 sm:text-4xl">Our services</h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-500">
            Three core business lines, one trusted team — covering every stage of property ownership.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, body, to, cta, image }) => (
            <Card
              key={title}
              className="group flex flex-col overflow-hidden rounded-2xl border-stone-200/80 shadow-[0_1px_3px_rgba(28,25,23,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(15,53,41,0.25)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={image}
                  alt={title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 to-transparent" />
                <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cream/95 text-forest-800 shadow">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <CardContent className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl font-bold text-stone-900">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-500">{body}</p>
                <Link
                  to={to}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-forest-700 transition-colors hover:text-forest-900"
                >
                  {cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brass-600">On the market</p>
            <h2 className="mt-1 font-display text-3xl font-bold text-stone-900 sm:text-4xl">Featured listings</h2>
          </div>
          <Link
            to="/browse"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-bold text-forest-700 transition-colors hover:text-forest-900 sm:inline-flex"
          >
            View all homes
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mt-20 bg-forest-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brass-300">Why choose us</p>
            <h2 className="mt-1 font-display text-3xl font-bold text-cream sm:text-4xl">
              Built on trust, run with care
            </h2>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_PROPS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-brass-300">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-cream">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-400">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brass-600">How it works</p>
          <h2 className="mt-1 font-display text-3xl font-bold text-stone-900 sm:text-4xl">Three steps to your move</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map(({ n, icon: Icon, title, body }) => (
            <div
              key={n}
              className="relative rounded-2xl border border-stone-200/80 bg-white p-7 shadow-[0_1px_3px_rgba(28,25,23,0.06)]"
            >
              <span className="font-display text-5xl font-bold text-stone-100">{n}</span>
              <span className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-display text-lg font-bold text-stone-900">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-500">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brass-600">Loved by clients</p>
          <h2 className="mt-1 font-display text-3xl font-bold text-stone-900 sm:text-4xl">What people say</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map(({ quote, name, role }) => (
            <Card key={name} className="rounded-2xl border-stone-200/80 shadow-[0_1px_3px_rgba(28,25,23,0.06)]">
              <CardContent className="flex h-full flex-col p-6">
                <Quote className="h-7 w-7 text-brass-400" />
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-stone-700">“{quote}”</p>
                <div className="mt-5 flex items-center gap-3 border-t border-stone-100 pt-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-800 font-display text-sm font-bold text-cream">
                    {name.split(' ').map((w) => w[0]).join('')}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-stone-900">{name}</p>
                    <p className="text-xs text-stone-500">{role}</p>
                  </div>
                  <span className="ml-auto flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-brass-400 text-brass-400" />
                    ))}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-forest-900 px-6 py-14 text-center shadow-xl sm:px-16">
          <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-brass-500/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-forest-400/20 blur-2xl" />
          <h2 className="relative font-display text-3xl font-bold text-cream sm:text-4xl">
            Ready to make your move?
          </h2>
          <p className="relative mx-auto mt-3 max-w-lg text-stone-300">
            Browse thousands of verified listings or talk to an agent who knows your market.
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={() => navigate('/browse')}
              className="h-12 rounded-full bg-brass-500 px-7 text-base font-bold text-forest-950 shadow-lg hover:bg-brass-400"
            >
              Browse properties
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/sell')}
              className="h-12 rounded-full border-white/40 bg-transparent px-7 text-base font-bold text-cream hover:bg-white/10 hover:text-cream"
            >
              List your property
            </Button>
          </div>
          <p className="relative mt-6 flex items-center justify-center gap-1.5 text-sm text-stone-400">
            <MapPin className="h-4 w-4 text-brass-400" /> Serving {cities}+ cities nationwide
          </p>
        </div>
      </section>
    </main>
  )
}
