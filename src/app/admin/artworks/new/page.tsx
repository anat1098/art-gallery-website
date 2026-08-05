import type { Metadata } from "next";
import { cookies } from "next/headers";
import { prisma } from "@/server/db/client";
import { ArtworkForm } from "@/components/admin/artwork-form";
import { dictionaries } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";

export const metadata: Metadata = {
  title: "New Artwork",
};

export default async function NewArtworkPage() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isLocale(localeCookie) ? localeCookie : defaultLocale;
  const t = dictionaries[locale].admin;

  let categories: { id: string; name: string }[] = [];
  let mediums: { id: string; name: string }[] = [];
  let loadError: string | null = null;

  try {
    [categories, mediums] = await Promise.all([
      prisma.category.findMany({ select: { id: true, name: true } }),
      prisma.medium.findMany({ select: { id: true, name: true } }),
    ]);
  } catch {
    loadError = t.unableToReachDb;
  }

  return (
    <div>
      <h1 className="font-display text-2xl">{t.artworks.newArtwork}</h1>
      {loadError ? (
        <p className="mt-6 text-sm text-destructive">{loadError}</p>
      ) : (
        <div className="mt-8">
          <ArtworkForm categories={categories} mediums={mediums} />
        </div>
      )}
    </div>
  );
}
