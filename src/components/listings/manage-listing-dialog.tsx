import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AMENITIES } from "@/config/constants";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

interface ManageListingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing?: any;
  onSuccess?: () => void;
}

export function ManageListingDialog({
  open,
  onOpenChange,
  listing,
  onSuccess,
}: ManageListingDialogProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: listing?.title || "",
    description: listing?.description || "",
    price: listing?.price || "",
    location: listing?.location || "",
    rooms: listing?.rooms || "",
    amenities: listing?.amenities || [],
    images: listing?.images || [""],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ...formData,
      price: Number(formData.price),
      rooms: Number(formData.rooms),
      landlord_id: user?.id,
      images: formData.images.filter(Boolean),
    };

    if (listing) {
      const { error } = await supabase
        .from("listings")
        .update(data)
        .eq("id", listing.id);

      if (!error && onSuccess) {
        onSuccess();
        onOpenChange(false);
      }
    } else {
      const { error } = await supabase.from("listings").insert([data]);

      if (!error && onSuccess) {
        onSuccess();
        onOpenChange(false);
      }
    }
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a: string) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const addImageField = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };

  const updateImage = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img: string, i: number) =>
        i === index ? value : img,
      ),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {listing ? "Edit Listing" : "Create New Listing"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Price per month</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rooms">Number of Rooms</Label>
                  <Input
                    id="rooms"
                    type="number"
                    value={formData.rooms}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        rooms: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Amenities</Label>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES.map((amenity) => (
                    <Badge
                      key={amenity}
                      variant={
                        formData.amenities.includes(amenity)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => toggleAmenity(amenity)}
                    >
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Images</Label>
                <div className="space-y-2">
                  {formData.images.map((image: string, index: number) => (
                    <Input
                      key={index}
                      value={image}
                      onChange={(e) => updateImage(index, e.target.value)}
                      placeholder="Image URL"
                    />
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addImageField}
                  >
                    Add Image URL
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">
              {listing ? "Update Listing" : "Create Listing"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
