import { useState } from "react";
import { ListingsGrid } from "./listings-grid";
import { Filters } from "./filters";
import { ListingFilters } from "@/types";
import { useListings } from "@/lib/queries";

export default function ListingsPage() {
  const [filters, setFilters] = useState<ListingFilters>({});
  const { data: listings, isLoading } = useListings(filters);

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Listings</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:h-[calc(100vh-80px)]">
          <Filters filters={filters} onFilterChange={setFilters} />
        </aside>
        <main>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <ListingsGrid listings={listings || []} />
          )}
        </main>
      </div>
    </div>
  );
}
