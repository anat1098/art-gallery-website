import type { Metadata } from "next";
import { CatalogToolbar } from "@/components/gallery/catalog-toolbar";
import { CatalogGrid } from "@/components/gallery/catalog-grid";
import { allOriginals, toCard } from "@/lib/constants/placeholder-artworks";

export const metadata: Metadata = {
  title: "Originals",
  description: "One-of-a-kind original paintings, available while they last.",
};

type OriginalsPageProps = {
  searchParams: Promise<{ sort?: string }>;
};

export default async function OriginalsPage({ searchParams }: OriginalsPageProps) {
  const { sort } = await searchParams;

  const sorted = [...allOriginals].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return 0;
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
      <div className="max-w-2xl">
        <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
          Originals
        </p>
        <h1 className="mt-3">Original Artworks</h1>
        <p className="mt-4 text-muted-foreground">
          One-of-a-kind paintings, each sold as a single original piece. Once
          sold, a work is never reproduced as an original again.
        </p>
      </div>

      <div className="mt-10">
        <CatalogToolbar mediums={[]} showMediumFilter={false} resultCount={sorted.length} />
        <CatalogGrid artworks={sorted.map(toCard)} />
      </div>
    </div>
  );
}
