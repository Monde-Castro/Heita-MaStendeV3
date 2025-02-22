import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AMENITIES } from "@/config/constants";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const MOCK_LISTINGS = [
  {
    id: "1",
    title: "Modern Studio Apartment",
    location: "Central City",
    price: 800,
    rooms: 1,
    amenities: ["Wi-Fi", "Security"],
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
  },
  {
    id: "2",
    title: "Spacious 2-Bedroom Flat",
    location: "University District",
    price: 1200,
    rooms: 2,
    amenities: ["Parking", "Laundry"],
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
  },
];

export function FeaturedListings() {
  const navigate = useNavigate();

  return (
    <section className="container py-12">
      <h2 className="text-3xl font-bold tracking-tight mb-8">
        Featured Listings
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_LISTINGS.map((listing) => (
          <Card key={listing.id}>
            <CardHeader className="p-0">
              <img
                src={listing.image}
                alt={listing.title}
                className="h-48 w-full object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-xl mb-2">{listing.title}</CardTitle>
              <CardDescription>
                <div className="flex justify-between items-center mb-2">
                  <span>{listing.location}</span>
                  <span className="font-bold">R{listing.price}/month</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {listing.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
                <Button
                  className="w-full"
                  onClick={() => navigate(`/listings/${listing.id}`)}
                >
                  View Details
                </Button>
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
