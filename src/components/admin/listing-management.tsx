import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { ManageListingDialog } from "@/components/listings/manage-listing-dialog";

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  verified: boolean;
  created_at: string;
}

export function ListingManagement() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    const { data } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setListings(data);
    }
  }

  async function toggleVerification(listingId: string, currentStatus: boolean) {
    const { error } = await supabase
      .from("listings")
      .update({ verified: !currentStatus })
      .eq("id", listingId);

    if (!error) {
      setListings(
        listings.map((listing) =>
          listing.id === listingId
            ? { ...listing, verified: !currentStatus }
            : listing,
        ),
      );
    }
  }

  async function deleteListing(listingId: string) {
    const { error } = await supabase
      .from("listings")
      .delete()
      .eq("id", listingId);

    if (!error) {
      setListings(listings.filter((listing) => listing.id !== listingId));
    }
  }

  const handleEdit = (listing: Listing) => {
    setEditingListing(listing);
    setCreateDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Listings</h2>
        <Button onClick={() => setCreateDialogOpen(true)}>
          Create Listing
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell>{listing.title}</TableCell>
                <TableCell>R{listing.price}</TableCell>
                <TableCell>{listing.location}</TableCell>
                <TableCell>
                  {listing.verified ? "Verified" : "Unverified"}
                </TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" onClick={() => handleEdit(listing)}>
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      toggleVerification(listing.id, listing.verified)
                    }
                  >
                    {listing.verified ? "Unverify" : "Verify"}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteListing(listing.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ManageListingDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        listing={editingListing}
        onSuccess={() => {
          fetchListings();
          setEditingListing(null);
        }}
      />
    </div>
  );
}
