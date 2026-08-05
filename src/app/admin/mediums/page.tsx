import type { Metadata } from "next";
import { cookies } from "next/headers";
import { prisma } from "@/server/db/client";
import { TaxonomyManager } from "@/components/admin/taxonomy-manager";
import { dictionaries } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";

export const metadata: Metadata = {
  title: "Mediums",
};

export default async function AdminMediumsPage() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isLocale(localeCookie) ? localeCookie : defaultLocale;
  const t = dictionaries[locale].admin;

  let mediums: Awaited<ReturnType<typeof prisma.medium.findMany>> = [];
  let loadError: string | null = null;

  try {
    mediums = await prisma.medium.findMany({ orderBy: { order: "asc" } });
  } catch {
    loadError = t.unableToReachDb;
  }

  return (
    <div>
      <h1 className="font-display text-2xl">{t.mediums.title}</h1>
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
