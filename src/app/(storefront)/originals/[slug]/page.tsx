import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArtworkGallery } from "@/components/gallery/artwork-gallery";
import { OriginalPurchasePanel } from "@/components/gallery/original-purchase-panel";
import { RelatedArtworks } from "@/components/gallery/related-artworks";
import {
  allOriginals,
  getArtworkBySlug,
  getRelatedArtworks,
} from "@/lib/constants/placeholder-artworks";

type OriginalPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return allOriginals.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({
  params,
}: OriginalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const artwork = getArtworkBySlug("ORIGINAL", slug);
  if (!artwork) return {};
  return {
    title: artwork.title,
    description: artwork.description,
  };
}

export default async function OriginalPage({ params }: OriginalPageProps) {
  const { slug } = await params;
  const artwork = getArtworkBySlug("ORIGINAL", slug);
  if (!artwork) notFound();

  const related = getRelatedArtworks(artwork);

  return (
    <div>
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-12 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-16">
        <ArtworkGallery images={artwork.images} />

        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
            {artwork.categoryName} · Original
          </p>
          <h1 className="mt-3 text-4xl lg:text-5xl italic">&lsquo;{artwork.title}&rsquo;</h1>
          <p className="mt-6 max-w-md text-muted-foreground">
            {artwork.description}
          </p>
          {artwork.materials && (
            <p className="mt-4 text-sm text-muted-foreground">
              Materials: {artwork.materials}
            </p>
          )}

          <OriginalPurchasePanel artwork={artwork} />
        </div>
      </div>

      <RelatedArtworks artworks={related} />
    </div>
  );
}
