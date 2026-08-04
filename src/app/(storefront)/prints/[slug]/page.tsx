import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ArtworkGallery } from "@/components/gallery/artwork-gallery";
import { PrintPurchasePanel } from "@/components/gallery/print-purchase-panel";
import { RelatedArtworks } from "@/components/gallery/related-artworks";
import {
  allPrints,
  getArtworkBySlug,
  getRelatedArtworks,
} from "@/lib/constants/placeholder-artworks";
import { dictionaries } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";

type PrintPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return allPrints.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PrintPageProps): Promise<Metadata> {
  const { slug } = await params;
  const artwork = getArtworkBySlug("PRINT", slug);
  if (!artwork) return {};
  return {
    title: artwork.title,
    description: artwork.description,
  };
}

export default async function PrintPage({ params }: PrintPageProps) {
  const { slug } = await params;
  const artwork = getArtworkBySlug("PRINT", slug);
  if (!artwork) notFound();

  const related = getRelatedArtworks(artwork);
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isLocale(localeCookie) ? localeCookie : defaultLocale;
  const t = dictionaries[locale];

  return (
    <div>
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-12 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-16">
        <ArtworkGallery images={artwork.images} />

        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
            {artwork.categoryName} · {artwork.medium}
          </p>
          <h1 className="mt-3 text-4xl lg:text-5xl">&lsquo;{artwork.title}&rsquo;</h1>
          <p className="mt-6 max-w-md text-muted-foreground">{artwork.description}</p>
          {artwork.materials && (
            <p className="mt-4 text-sm text-muted-foreground">
              {t.artwork.materials}: {artwork.materials}
            </p>
          )}

          <PrintPurchasePanel artwork={artwork} />
        </div>
      </div>

      <RelatedArtworks artworks={related} />
    </div>
  );
}
