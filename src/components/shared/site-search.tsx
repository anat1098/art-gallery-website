"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { allArtworks } from "@/lib/constants/placeholder-artworks";
import { useCurrency } from "@/components/providers/currency-provider";

export function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { format } = useCurrency();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allArtworks
      .filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.medium.toLowerCase().includes(q) ||
          a.categoryName.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query]);

  function goTo(slug: string, type: "PRINT" | "ORIGINAL") {
    setOpen(false);
    router.push(`/${type === "PRINT" ? "prints" : "originals"}/${slug}`);
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Search"
        onClick={() => setOpen(true)}
      >
        <Search className="size-[18px]" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="top-1/3 max-w-lg translate-y-0 gap-0 overflow-hidden rounded-xl p-0">
          <DialogTitle className="sr-only">Search artworks</DialogTitle>
          <DialogDescription className="sr-only">
            Search by artwork name, medium, or category
          </DialogDescription>
          <div className="border-b border-border p-3">
            <Input
              autoFocus
              placeholder="Search by name, medium, or category…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-none shadow-none focus-visible:ring-0"
            />
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            {query.trim() && results.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No artworks found.
              </p>
            )}
            {results.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => goTo(a.slug, a.type)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
              >
                <span>
                  {a.title}{" "}
                  <span className="text-muted-foreground">· {a.medium}</span>
                </span>
                <span className="text-muted-foreground">
                  {format(a.price)}
                </span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
