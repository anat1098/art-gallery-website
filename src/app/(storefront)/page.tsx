import { Hero } from "@/components/home/hero";
import { FeaturedGrid } from "@/components/home/featured-grid";
import { AboutTeaser } from "@/components/home/about-teaser";
import { NewsletterSection } from "@/components/home/newsletter-section";
import {
  featuredPrints,
  featuredOriginals,
} from "@/lib/constants/placeholder-artworks";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedGrid variant="prints" artworks={featuredPrints} viewAllHref="/prints" />
      <FeaturedGrid
        variant="originals"
        artworks={featuredOriginals}
        viewAllHref="/originals"
      />
      <AboutTeaser />
      <NewsletterSection />
    </>
  );
}
