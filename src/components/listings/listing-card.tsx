import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Listing } from "@/types";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { getOptimizedImageUrl } from "@/lib/image-optimization";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <img
          src={getOptimizedImageUrl(listing.images[0], 400)}
          alt={listing.title}
          className="h-48 w-full object-cover"
        />
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{listing.title}</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-muted-foreground">{listing.location}</span>
          <span className="font-bold">R{listing.price}/month</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {listing.amenities?.slice(0, 3).map((amenity) => (
            <Badge key={amenity} variant="secondary">
              {amenity}
            </Badge>
          ))}
        </div>
        <Button
          className="w-full"
          onClick={() => navigate(`/listings/${listing.id}`)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
