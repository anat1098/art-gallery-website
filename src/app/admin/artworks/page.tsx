import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/server/db/client";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { ArtworkFlagToggle } from "@/components/admin/artwork-flag-toggle";

export const metadata: Metadata = {
  title: "Artworks",
};

async function getArtworks() {
  return prisma.artwork.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, medium: true },
  });
}

export default async function AdminArtworksPage() {
  let artworks: Awaited<ReturnType<typeof getArtworks>> = [];
  let loadError: string | null = null;

  try {
    artworks = await getArtworks();
  } catch {
    loadError = "Unable to reach the database.";
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Artworks</h1>
        <Button className="rounded-none" asChild>
          <Link href="/admin/artworks/new">New Artwork</Link>
        </Button>
      </div>

      {loadError && (
        <p className="mt-6 text-sm text-destructive">{loadError}</p>
      )}

      {!loadError && artworks.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">
          No artworks yet. Create the first one.
        </p>
      )}

      {artworks.length > 0 && (
        <div className="mt-8 divide-y divide-border border-y border-border">
          {artworks.map((artwork) => (
            <div
              key={artwork.id}
              className="flex flex-wrap items-center justify-between gap-3 py-4"
            >
              <div>
                <Link
                  href={`/admin/artworks/${artwork.id}`}
                  className="font-display text-lg underline-offset-4 hover:underline"
                >
                  {artwork.title}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {artwork.type} · {artwork.medium?.name ?? "No medium"} ·{" "}
                  {artwork.category?.name ?? "No category"}
                  {artwork.type === "ORIGINAL" && artwork.originalPrice
                    ? ` · ${formatPrice(Number(artwork.originalPrice))}`
                    : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <ArtworkFlagToggle
                  id={artwork.id}
                  field="isPublished"
                  initialValue={artwork.isPublished}
                  label="Published"
                />
                <ArtworkFlagToggle
                  id={artwork.id}
                  field="isFeatured"
                  initialValue={artwork.isFeatured}
                  label="Featured"
                />
                <ArtworkFlagToggle
                  id={artwork.id}
                  field="isNewArrival"
                  initialValue={artwork.isNewArrival}
                  label="New Arrival"
                />
                {artwork.type === "ORIGINAL" && (
                  <ArtworkFlagToggle
                    id={artwork.id}
                    field="isSold"
                    initialValue={artwork.isSold}
                    label="Sold"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
