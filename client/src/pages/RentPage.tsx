import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router";
import { ArrowDown, SearchX } from "lucide-react";
import {
  DEFAULT_FILTERS,
  type SearchFilters,
} from "@/types";
import { filterProperties } from "@/context/MarketplaceContext";
import { fmtCompact } from "@/lib/mortgage";
import FilterBar from "@/components/FilterBar";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function RentPage() {
  const location = useLocation();
  const [params] = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>(() => ({
    ...DEFAULT_FILTERS,
    query: params.get("q") ?? "",
  }));
  const listingsRef = useRef<HTMLDivElement>(null);

  // Applying a saved search navigates here with filters in location.state
  useEffect(() => {
    const incoming = (location.state as { filters?: SearchFilters } | null)
      ?.filters;
    if (incoming) {
      setFilters({ ...DEFAULT_FILTERS, ...incoming });
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  const results = useMemo(() => filterProperties(filters), [filters]);

  return (
    <main>
      {/* Listings */}
      <div
        ref={listingsRef}
        className="mx-auto max-w-7xl scroll-mt-20 px-4 pb-20 pt-14 sm:px-6"
      >
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brass-600">
              On the market
            </p>
            <h2 className="mt-1 font-display text-3xl font-bold text-stone-900">
              Find Your Next Rental
              <span className="ml-2 text-lg font-normal text-stone-400">
                {results.length > 0 &&
                  `from ${fmtCompact(Math.min(...results.map((r) => r.price)))}`}
              </span>
            </h2>
          </div>
        </div>

        <div className="mt-6">
          <FilterBar
            filters={filters}
            onChange={setFilters}
            resultCount={results.length}
          />
        </div>

        {results.length > 0 ? (
          <>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>

            {/* Load More — stub, wire up pagination later */}
            <div className="mt-10 flex justify-center">
              <Button
                className={cn(
                  "h-10 rounded-lg bg-forest-800 px-4 hover:bg-forest-900 bg-forest-600",
                )}
              >
                <ArrowDown className="mr-1.5 h-4 w-4" />
                Load More
              </Button>
            </div>
          </>
        ) : (
          <div className="mt-16 flex flex-col items-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
              <SearchX className="h-8 w-8 text-stone-400" />
            </span>
            <h2 className="mt-4 text-lg font-bold text-stone-800">
              No homes match these filters
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Try widening your price range or removing a filter or two.
            </p>
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="mt-4 rounded-full bg-forest-800 px-5 py-2 text-sm font-bold text-cream hover:bg-forest-900"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
