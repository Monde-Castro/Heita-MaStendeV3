import { HeroSection } from "./home/hero-section";
import { FeaturedListings } from "./home/featured-listings";

function Home() {
  return (
    <div className="w-full">
      <HeroSection />
      <FeaturedListings />
    </div>
  );
}

export default Home;
