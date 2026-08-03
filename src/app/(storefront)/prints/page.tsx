import type { Metadata } from "next";
import { CatalogToolbar } from "@/components/gallery/catalog-toolbar";
import { CatalogGrid } from "@/components/gallery/catalog-grid";
import { allPrints, printMediums, toCard } from "@/lib/constants/placeholder-artworks";

export const metadata: Metadata = {
  title: "Prints",
  description: "Museum-quality fine art prints, made by hand and shipped worldwide.",
};

type PrintsPageProps = {
  searchParams: Promise<{ sort?: string; medium?: string }>;
};

export default async function PrintsPage({ searchParams }: PrintsPageProps) {
  const { sort, medium } = await searchParams;

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
      <div className="max-w-2xl">
        <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
          Fine Art Prints
        </p>
        <h1 className="mt-3">Prints</h1>
        <p className="mt-4 text-muted-foreground">
          Museum-quality prints on archival paper, available in multiple
          sizes with optional framing.
        </p>
      </div>

      <div className="mt-10">
        <CatalogToolbar mediums={printMediums} resultCount={sorted.length} />
        <CatalogGrid artworks={sorted.map(toCard)} />
      </div>
    </div>
  );
}
