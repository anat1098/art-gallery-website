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
        <DialogContent
          showCloseButton={false}
          className="top-0 start-0 end-0 inset-x-0 z-50 max-w-none w-full translate-x-0 translate-y-0 rtl:translate-x-0 gap-0 overflow-hidden rounded-none border-0 border-b border-border bg-background/98 p-0 shadow-xl backdrop-blur-sm duration-200 data-open:slide-in-from-top-6 data-closed:slide-out-to-top-6 sm:max-w-none"
        >
          <DialogTitle className="sr-only">Search artworks</DialogTitle>
          <DialogDescription className="sr-only">
            Search by artwork name, medium, or category
          </DialogDescription>
          <div className="mx-auto w-full max-w-2xl px-6 py-8 lg:px-0">
            <div className="flex items-center gap-4 border-b border-border pb-4">
              <Search className="size-5 shrink-0 text-muted-foreground" />
              <Input
                autoFocus
                placeholder="Search by name, medium, or category…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-auto border-none bg-transparent p-0 text-lg shadow-none focus-visible:ring-0"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="shrink-0 text-xs tracking-wide text-muted-foreground uppercase hover:text-foreground"
              >
                Esc
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto py-2">
              {query.trim() && results.length === 0 && (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  No artworks found.
                </p>
              )}
              {results.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => goTo(a.slug, a.type)}
                  className="flex w-full items-center justify-between gap-4 rounded-sm px-3 py-3 text-left text-sm transition-colors hover:bg-muted"
                >
                  <span>
                    {a.title}{" "}
                    <span className="text-muted-foreground">· {a.medium}</span>
                  </span>
                  <span className="whitespace-nowrap text-muted-foreground">
                    {format(a.price)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
