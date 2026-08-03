"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CatalogToolbarProps = {
  mediums: string[];
  resultCount: number;
  showMediumFilter?: boolean;
};

export function CatalogToolbar({
  mediums,
  resultCount,
  showMediumFilter = true,
}: CatalogToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sort = searchParams.get("sort") ?? "";
  const medium = searchParams.get("medium") ?? "";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
      <p className="text-sm text-muted-foreground">
        {resultCount} {resultCount === 1 ? "artwork" : "artworks"}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {showMediumFilter && (
          <Select
            value={medium || "all"}
            onValueChange={(v) => updateParam("medium", v === "all" ? "" : v)}
          >
            <SelectTrigger className="w-40 rounded-none">
              <SelectValue placeholder="Medium" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Mediums</SelectItem>
              {mediums.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select
          value={sort || "default"}
          onValueChange={(v) => updateParam("sort", v === "default" ? "" : v)}
        >
          <SelectTrigger className="w-44 rounded-none">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Featured</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
