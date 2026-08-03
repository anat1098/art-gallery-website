import type { Metadata } from "next";
import { prisma } from "@/server/db/client";
import { ArtworkForm } from "@/components/admin/artwork-form";

export const metadata: Metadata = {
  title: "New Artwork",
};

export default async function NewArtworkPage() {
  let categories: { id: string; name: string }[] = [];
  let mediums: { id: string; name: string }[] = [];
  let loadError: string | null = null;

  try {
    [categories, mediums] = await Promise.all([
      prisma.category.findMany({ select: { id: true, name: true } }),
      prisma.medium.findMany({ select: { id: true, name: true } }),
    ]);
  } catch {
    loadError = "Unable to reach the database.";
  }

  return (
    <div>
      <h1 className="font-display text-2xl">New Artwork</h1>
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
