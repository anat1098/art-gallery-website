import type { Metadata } from "next";
import { cookies } from "next/headers";
import { CatalogToolbar } from "@/components/gallery/catalog-toolbar";
import { CatalogGrid } from "@/components/gallery/catalog-grid";
import { allOriginals, toCard } from "@/lib/constants/placeholder-artworks";
import { dictionaries } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";
import { getSiteContent, resolveContent } from "@/server/services/get-site-content";

export const metadata: Metadata = {
  title: "Originals",
  description: "One-of-a-kind original paintings, available while they last.",
};

type OriginalsPageProps = {
  searchParams: Promise<{ sort?: string }>;
};

export default async function OriginalsPage({ searchParams }: OriginalsPageProps) {
  const { sort } = await searchParams;
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isLocale(localeCookie) ? localeCookie : defaultLocale;
  const t = dictionaries[locale];
  const content = await getSiteContent();
  const description = resolveContent(
    locale,
    content.originalsSubheadingEn,
    content.originalsSubheadingHe,
    t.originals.description
  );

  const sorted = [...allOriginals].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return 0;
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
          {t.originals.eyebrow}
        </p>
        <h1 className="mt-3">{t.originals.title}</h1>
        <p className="mt-4 text-muted-foreground">{description}</p>
      </div>

      <div className="mt-10">
        <CatalogToolbar mediums={[]} showMediumFilter={false} resultCount={sorted.length} />
        <CatalogGrid artworks={sorted.map(toCard)} />
      </div>
    </div>
  );
}
