import type { Metadata } from "next";
import { prisma } from "@/server/db/client";
import { TaxonomyManager } from "@/components/admin/taxonomy-manager";

export const metadata: Metadata = {
  title: "Categories",
};

export default async function AdminCategoriesPage() {
  let categories: Awaited<ReturnType<typeof prisma.category.findMany>> = [];
  let loadError: string | null = null;

  try {
    categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  } catch {
    loadError = "Unable to reach the database.";
  }

  return (
    <div>
      <h1 className="font-display text-2xl">Categories</h1>
      {loadError ? (
        <p className="mt-6 text-sm text-destructive">{loadError}</p>
      ) : (
        <div className="mt-8">
          <TaxonomyManager kind="category" items={categories} />
        </div>
      )}
    </div>
  );
}
