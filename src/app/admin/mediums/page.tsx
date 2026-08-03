import type { Metadata } from "next";
import { prisma } from "@/server/db/client";
import { TaxonomyManager } from "@/components/admin/taxonomy-manager";

export const metadata: Metadata = {
  title: "Mediums",
};

export default async function AdminMediumsPage() {
  let mediums: Awaited<ReturnType<typeof prisma.medium.findMany>> = [];
  let loadError: string | null = null;

  try {
    mediums = await prisma.medium.findMany({ orderBy: { order: "asc" } });
  } catch {
    loadError = "Unable to reach the database.";
  }

  return (
    <div>
      <h1 className="font-display text-2xl">Mediums</h1>
      {loadError ? (
        <p className="mt-6 text-sm text-destructive">{loadError}</p>
      ) : (
        <div className="mt-8">
          <TaxonomyManager kind="medium" items={mediums} />
        </div>
      )}
    </div>
  );
}
