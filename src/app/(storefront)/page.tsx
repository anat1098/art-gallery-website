import { cookies } from "next/headers";
import { Hero } from "@/components/home/hero";
import { FeaturedGrid } from "@/components/home/featured-grid";
import { AboutTeaser } from "@/components/home/about-teaser";
import { NewsletterSection } from "@/components/home/newsletter-section";
import {
  featuredPrints,
  featuredOriginals,
} from "@/lib/constants/placeholder-artworks";
import { dictionaries } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";
import { getSiteContent, resolveContent } from "@/server/services/get-site-content";

export default async function Home() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isLocale(localeCookie) ? localeCookie : defaultLocale;
  const t = dictionaries[locale];
  const content = await getSiteContent();
  const aboutBody = resolveContent(
    locale,
    content.homeAboutBodyEn,
    content.homeAboutBodyHe,
    t.home.aboutBody
  );
  const newsletterBody = resolveContent(
    locale,
    content.newsletterBodyEn,
    content.newsletterBodyHe,
    t.home.newsletterBody
  );

  return (
    <>
      <Hero />
      <FeaturedGrid variant="prints" artworks={featuredPrints} viewAllHref="/prints" />
      <FeaturedGrid
        variant="originals"
        artworks={featuredOriginals}
        viewAllHref="/originals"
      />
      <AboutTeaser bodyOverride={aboutBody} />
      <NewsletterSection bodyOverride={newsletterBody} />
    </>
  );
}
