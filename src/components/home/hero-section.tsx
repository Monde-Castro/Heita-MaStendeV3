import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function HeroSection() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
            Find your ideal accommodation with verified listings
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Safe, verified, and affordable accommodations for students and young
            professionals.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="text"
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
