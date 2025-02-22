import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ContactLandlordDialog } from "./contact-landlord-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Listing } from "@/types";
import { Skeleton } from "../ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Wifi, Car, ShowerHead, Shield, Home } from "lucide-react";

interface ListingDetailsProps {
  listing: Listing;
  isLoading?: boolean;
}

const amenityIcons: Record<string, React.ReactNode> = {
  "Wi-Fi": <Wifi className="h-6 w-6" />,
  Parking: <Car className="h-6 w-6" />,
  Laundry: <ShowerHead className="h-6 w-6" />,
  Security: <Shield className="h-6 w-6" />,
  Default: <Home className="h-6 w-6" />,
};

export function ListingDetails({ listing, isLoading }: ListingDetailsProps) {
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  if (isLoading) {
    return <ListingDetailsSkeleton />;
  }

  return (
    <div className="container py-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Carousel className="w-full">
            <CarouselContent>
              {listing.images.map((image, index) => (
                <CarouselItem key={index}>
                  <AspectRatio ratio={4 / 3} className="bg-muted">
                    <img
                      src={image}
                      alt={`${listing.title} ${index + 1}`}
                      className="h-full w-full object-cover rounded-lg"
                    />
                  </AspectRatio>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-4">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{listing.title}</h1>
            <p className="text-xl font-semibold mt-2">R{listing.price}/month</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Location</h2>
            <p>{listing.location}</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Description</h2>
            <ScrollArea className="h-[100px] rounded-md border p-4">
              <p>{listing.description}</p>
            </ScrollArea>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Rooms</p>
                <p className="font-medium">{listing.rooms}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="font-medium">
                  {listing.isVerified ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {listing.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <div className="mb-2">
                    {amenityIcons[amenity] || amenityIcons.Default}
                  </div>
                  <span className="text-sm font-medium text-secondary-foreground">
                    {amenity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-4">
              <Button
                className="w-full"
                size="lg"
                onClick={() => setContactDialogOpen(true)}
              >
                Contact Landlord
              </Button>
            </CardContent>
          </Card>

          <ContactLandlordDialog
            open={contactDialogOpen}
            onOpenChange={setContactDialogOpen}
            listingTitle={listing.title}
          />
        </div>
      </div>
    </div>
  );
}

function ListingDetailsSkeleton() {
  return (
    <div className="container py-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="aspect-[4/3] w-full rounded-lg" />
        </div>

        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4 mt-2" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-6 w-1/4" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>

          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
