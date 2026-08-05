import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/server/db/client";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { ArtworkFlagToggle } from "@/components/admin/artwork-flag-toggle";
import { dictionaries } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";

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
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isLocale(localeCookie) ? localeCookie : defaultLocale;
  const t = dictionaries[locale].admin;

  let artworks: Awaited<ReturnType<typeof getArtworks>> = [];
  let loadError: string | null = null;

  try {
    artworks = await getArtworks();
  } catch {
    loadError = t.unableToReachDb;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">{t.artworks.title}</h1>
        <Button className="rounded-none" asChild>
          <Link href="/admin/artworks/new">{t.artworks.newArtwork}</Link>
        </Button>
      </div>

      {loadError && (
        <p className="mt-6 text-sm text-destructive">{loadError}</p>
      )}

      {!loadError && artworks.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">
          {t.artworks.noArtworksYet}
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
                  {artwork.type} · {artwork.medium?.name ?? t.artworks.noMedium} ·{" "}
                  {artwork.category?.name ?? t.artworks.noCategory}
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
                  label={t.artworks.published}
                />
                <ArtworkFlagToggle
                  id={artwork.id}
                  field="isFeatured"
                  initialValue={artwork.isFeatured}
                  label={t.artworks.featured}
                />
                <ArtworkFlagToggle
                  id={artwork.id}
                  field="isNewArrival"
                  initialValue={artwork.isNewArrival}
                  label={t.artworks.newArrival}
                />
                {artwork.type === "ORIGINAL" && (
                  <ArtworkFlagToggle
                    id={artwork.id}
                    field="isSold"
                    initialValue={artwork.isSold}
                    label={t.artworks.sold}
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
