import { ListingCard } from "./listing-card";
import { Listing } from "@/types";

interface ListingsGridProps {
  listings: Listing[];
}

export function ListingsGrid({ listings }: ListingsGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
