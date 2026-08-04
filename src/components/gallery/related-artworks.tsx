"use client";

import { ArtworkCard } from "@/components/gallery/artwork-card";
import { useLocale } from "@/components/providers/locale-provider";
import type { ArtworkCardData } from "@/types/artwork";

export function RelatedArtworks({ artworks }: { artworks: ArtworkCardData[] }) {
  const { t } = useLocale();
  if (artworks.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
      <h2 className="mb-10">{t.artwork.youMayAlsoLike}</h2>
      <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4">
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
    </section>
  );
}
