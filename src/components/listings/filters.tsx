import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AMENITIES, PRICE_RANGES, ROOM_OPTIONS } from "@/config/constants";
import { ListingFilters } from "@/types";
import { Badge } from "../ui/badge";

interface FiltersProps {
  filters: ListingFilters;
  onFilterChange: (filters: ListingFilters) => void;
}

export function Filters({ filters, onFilterChange }: FiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search locations..."
          value={filters.location || ""}
          onChange={(e) =>
            onFilterChange({ ...filters, location: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Price Range</Label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(PRICE_RANGES).map((range) => (
            <Badge
              key={range}
              variant={filters.priceRange === range ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() =>
                onFilterChange({
                  ...filters,
                  priceRange:
                    filters.priceRange === range ? undefined : (range as any),
                })
              }
            >
              {range}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Number of Rooms</Label>
        <Select
          value={filters.rooms?.toString()}
          onValueChange={(value) =>
            onFilterChange({ ...filters, rooms: parseInt(value) })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select rooms" />
          </SelectTrigger>
          <SelectContent>
            {ROOM_OPTIONS.map((rooms) => (
              <SelectItem key={rooms} value={rooms.toString()}>
                {rooms} {rooms === 1 ? "Room" : "Rooms"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Amenities</Label>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map((amenity) => (
            <Badge
              key={amenity}
              variant={
                filters.amenities?.includes(amenity) ? "default" : "outline"
              }
              className="cursor-pointer"
              onClick={() => {
                const newAmenities = filters.amenities?.includes(amenity)
                  ? filters.amenities.filter((a) => a !== amenity)
                  : [...(filters.amenities || []), amenity];
                onFilterChange({ ...filters, amenities: newAmenities });
              }}
            >
              {amenity}
            </Badge>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        onClick={() => onFilterChange({})}
        className="w-full"
      >
        Clear Filters
      </Button>
    </div>
  );
}
