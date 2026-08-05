import type { Metadata } from "next";
import { cookies } from "next/headers";
import { prisma } from "@/server/db/client";
import { TaxonomyManager } from "@/components/admin/taxonomy-manager";
import { dictionaries } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";

export const metadata: Metadata = {
  title: "Categories",
};

export default async function AdminCategoriesPage() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isLocale(localeCookie) ? localeCookie : defaultLocale;
  const t = dictionaries[locale].admin;

  let categories: Awaited<ReturnType<typeof prisma.category.findMany>> = [];
  let loadError: string | null = null;

  try {
    categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  } catch {
    loadError = t.unableToReachDb;
  }

  return (
    <div>
      <h1 className="font-display text-2xl">{t.categories.title}</h1>
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
