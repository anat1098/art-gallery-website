import type { Metadata } from "next";
import { cookies } from "next/headers";
import { CatalogToolbar } from "@/components/gallery/catalog-toolbar";
import { CatalogGrid } from "@/components/gallery/catalog-grid";
import { allPrints, printMediums, toCard } from "@/lib/constants/placeholder-artworks";
import { dictionaries } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";
import { getSiteContent, resolveContent } from "@/server/services/get-site-content";

export const metadata: Metadata = {
  title: "Prints",
  description: "Museum-quality fine art prints, made by hand and shipped worldwide.",
};

type PrintsPageProps = {
  searchParams: Promise<{ sort?: string; medium?: string }>;
};

export default async function PrintsPage({ searchParams }: PrintsPageProps) {
  const { sort, medium } = await searchParams;
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isLocale(localeCookie) ? localeCookie : defaultLocale;
  const t = dictionaries[locale];
  const content = await getSiteContent();
  const description = resolveContent(
    locale,
    content.printsSubheadingEn,
    content.printsSubheadingHe,
    t.prints.description
  );

  let artworks = allPrints;
  if (medium) {
    artworks = artworks.filter((a) => a.medium === medium);
  }

  const sorted = [...artworks].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return 0;
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
          {t.prints.eyebrow}
        </p>
        <h1 className="mt-3">{t.prints.title}</h1>
        <p className="mt-4 text-muted-foreground">{description}</p>
      </div>

      <div className="mt-10">
        <CatalogToolbar mediums={printMediums} resultCount={sorted.length} />
        <CatalogGrid artworks={sorted.map(toCard)} />
      </div>
    </div>
  );
}
