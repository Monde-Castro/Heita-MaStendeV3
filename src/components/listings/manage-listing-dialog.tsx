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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    landlord_name: listing?.landlord_name || "",
    landlord_phone: listing?.landlord_phone || "",
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [uploadError, setUploadError] = useState("");

  const handleImageUpload = async (file: File) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from("listing-images")
        .upload(filePath, file);

      if (uploadError) {
        setUploadError("Error uploading file: " + uploadError.message);
        return null;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("listing-images").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      setUploadError("Error uploading file. Please try again.");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Upload any new files
    const uploadPromises = uploadedFiles.map(handleImageUpload);
    const uploadedUrls = await Promise.all(uploadPromises);

    // Combine existing URLs and new uploaded URLs
    const allImages = [
      ...formData.images.filter(Boolean),
      ...uploadedUrls.filter(Boolean),
    ];

    const data = {
      ...formData,
      price: Number(formData.price),
      rooms: Number(formData.rooms),
      landlord_id: user?.id,
      images: allImages,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {listing ? "Edit Listing" : "Create New Listing"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
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

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
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

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Common Amenities</Label>
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
                  <Label>Add Custom Amenity</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter new amenity"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const value = e.currentTarget.value.trim();
                          if (value && !formData.amenities.includes(value)) {
                            setFormData((prev) => ({
                              ...prev,
                              amenities: [...prev.amenities, value],
                            }));
                            e.currentTarget.value = "";
                          }
                        }
                      }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Press Enter to add
                  </p>
                </div>

                {formData.amenities.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Amenities</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.amenities.map((amenity) => (
                        <Badge
                          key={amenity}
                          variant="default"
                          className="cursor-pointer group"
                        >
                          {amenity}
                          <span
                            className="ml-2 hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData((prev) => ({
                                ...prev,
                                amenities: prev.amenities.filter(
                                  (a) => a !== amenity,
                                ),
                              }));
                            }}
                          >
                            ×
                          </span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="images" className="space-y-4">
              <div className="space-y-2">
                <Label>Image URLs</Label>
                {formData.images.map((image: string, index: number) => (
                  <Input
                    key={index}
                    value={image}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        images: prev.images.map((img: string, i: number) =>
                          i === index ? e.target.value : img,
                        ),
                      }))
                    }
                    placeholder="Image URL"
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      images: [...prev.images, ""],
                    }))
                  }
                >
                  Add Image URL
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Upload Images</Label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                />
                {uploadedFiles.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {uploadedFiles.length} files selected
                  </p>
                )}
                {uploadError && (
                  <p className="text-sm text-destructive">{uploadError}</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="landlord_name">Landlord Name</Label>
                <Input
                  id="landlord_name"
                  value={formData.landlord_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      landlord_name: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="landlord_phone">Contact Number</Label>
                <Input
                  id="landlord_phone"
                  value={formData.landlord_phone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      landlord_phone: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </TabsContent>
          </Tabs>

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
