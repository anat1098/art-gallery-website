import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/server/db/client";
import { ArtworkForm } from "@/components/admin/artwork-form";
import { DeleteArtworkButton } from "@/components/admin/delete-artwork-button";
import { dictionaries } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";

export const metadata: Metadata = {
  title: "Edit Artwork",
};

type EditArtworkPageProps = {
  params: Promise<{ id: string }>;
};

async function getArtwork(id: string) {
  return prisma.artwork.findUnique({
    where: { id },
    include: { printSizes: true, frameOptions: true },
  });
}

export default async function EditArtworkPage({ params }: EditArtworkPageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isLocale(localeCookie) ? localeCookie : defaultLocale;
  const t = dictionaries[locale].admin;

  let artwork: Awaited<ReturnType<typeof getArtwork>> = null;
  let categories: { id: string; name: string }[] = [];
  let mediums: { id: string; name: string }[] = [];
  let loadError: string | null = null;

  try {
    [artwork, categories, mediums] = await Promise.all([
      getArtwork(id),
      prisma.category.findMany({ select: { id: true, name: true } }),
      prisma.medium.findMany({ select: { id: true, name: true } }),
    ]);
  } catch {
    loadError = t.unableToReachDb;
  }

  if (loadError) {
    return <p className="text-sm text-destructive">{loadError}</p>;
  }
  if (!artwork) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">{t.artworks.editArtwork}</h1>
        <DeleteArtworkButton id={artwork.id} />
      </div>
      <div className="mt-8">
        <ArtworkForm
          artworkId={artwork.id}
          categories={categories}
          mediums={mediums}
          defaultValues={{
            type: artwork.type,
            title: artwork.title,
            titleHe: artwork.titleHe ?? "",
            slug: artwork.slug,
            description: artwork.description ?? "",
            materials: artwork.materials ?? "",
            categoryId: artwork.categoryId ?? undefined,
            mediumId: artwork.mediumId ?? undefined,
            isFeatured: artwork.isFeatured,
            isNewArrival: artwork.isNewArrival,
            isPublished: artwork.isPublished,
            isSold: artwork.isSold,
            inventory: artwork.inventory,
            originalPrice: artwork.originalPrice
              ? Number(artwork.originalPrice)
              : undefined,
            originalWidthCm: artwork.originalWidthCm
              ? Number(artwork.originalWidthCm)
              : undefined,
            originalHeightCm: artwork.originalHeightCm
              ? Number(artwork.originalHeightCm)
              : undefined,
            yearCreated: artwork.yearCreated ?? undefined,
            shippingTimeNote: artwork.shippingTimeNote ?? "",
            printSizes: artwork.printSizes.map((s) => ({
              id: s.id,
              label: s.label,
              widthCm: Number(s.widthCm),
              heightCm: Number(s.heightCm),
              price: Number(s.price),
              inventory: s.inventory,
            })),
            frameOptions: artwork.frameOptions.map((f) => ({
              id: f.id,
              label: f.label,
              priceDelta: Number(f.priceDelta),
              isDefault: f.isDefault,
            })),
          }}
        />
      </div>
    </div>
  );
}
