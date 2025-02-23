export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  rooms: number;
  amenities: string[];
  images: string[];
  landlordId: string;
  createdAt: Date;
  updatedAt: Date;
  verified: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
}

export type PriceRange = "LOW" | "MEDIUM" | "HIGH";

export interface ListingFilters {
  location?: string;
  priceRange?: PriceRange;
  rooms?: number;
  amenities?: string[];
  minPrice?: number;
  maxPrice?: number;
}
