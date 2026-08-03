"use client";

import { motion } from "framer-motion";
import { ArtworkCard } from "@/components/gallery/artwork-card";
import type { ArtworkCardData } from "@/types/artwork";

export function CatalogGrid({ artworks }: { artworks: ArtworkCardData[] }) {
  if (artworks.length === 0) {
    return (
      <p className="py-20 text-center text-muted-foreground">
        No artworks match these filters yet.
      </p>
    );
  }

  return (
    <motion.div
      className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.06 } },
      }}
    >
      {artworks.map((artwork) => (
        <motion.div
          key={artwork.id}
          variants={{
            hidden: { opacity: 0, y: 16 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <ArtworkCard artwork={artwork} />
        </motion.div>
      ))}
    </motion.div>
  );
}
