"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ZoomIn, X } from "lucide-react";
import { ArtworkPlaceholder } from "@/components/shared/artwork-placeholder";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { ArtworkImageData } from "@/types/artwork";

export function ArtworkGallery({ images }: { images: ArtworkImageData[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const active = images[activeIndex];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden bg-muted">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <ArtworkPlaceholder seed={active.seed} className="h-full w-full" />
          </motion.div>
        </AnimatePresence>
        <button
          type="button"
          aria-label="View full screen"
          onClick={() => setZoomOpen(true)}
          className="absolute bottom-4 end-4 flex size-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-transform hover:scale-105"
        >
          <ZoomIn className="size-[18px]" />
        </button>
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={img.alt}
              aria-current={i === activeIndex}
              className={`relative aspect-square w-16 overflow-hidden ring-1 transition-opacity ${
                i === activeIndex
                  ? "ring-2 ring-foreground"
                  : "ring-border opacity-70 hover:opacity-100"
              }`}
            >
              <ArtworkPlaceholder seed={img.seed} className="h-full w-full" />
            </button>
          ))}
        </div>
      )}

      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-4xl border-none bg-transparent p-0 shadow-none"
        >
          <DialogTitle className="sr-only">{active.alt}</DialogTitle>
          <div className="relative aspect-square w-full overflow-hidden">
            <ArtworkPlaceholder seed={active.seed} className="h-full w-full" />
            <button
              type="button"
              aria-label="Close"
              onClick={() => setZoomOpen(false)}
              className="absolute end-4 top-4 flex size-9 items-center justify-center rounded-full bg-background/90 text-foreground"
            >
              <X className="size-[18px]" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
