"use client";

import { motion } from "framer-motion";
import { ArtworkCard } from "@/components/gallery/artwork-card";
import { useLocale } from "@/components/providers/locale-provider";
import type { ArtworkCardData } from "@/types/artwork";

export function CatalogGrid({ artworks }: { artworks: ArtworkCardData[] }) {
  const { t } = useLocale();

  if (artworks.length === 0) {
    return (
      <p className="py-20 text-center text-muted-foreground">{t.catalog.empty}</p>
    );
  }

  return (
    <motion.div
      className="mt-10 grid grid-cols-1 gap-y-14 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-14 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-12"
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
