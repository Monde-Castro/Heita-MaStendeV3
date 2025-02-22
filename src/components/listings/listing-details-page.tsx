import { useParams } from "react-router-dom";
import { ListingDetails } from "./listing-details";
import { useListing } from "@/lib/queries";

export default function ListingDetailsPage() {
  const { id } = useParams();
  const { data: listing, isLoading } = useListing(id!);

  return <ListingDetails listing={listing} isLoading={isLoading} />;
}
