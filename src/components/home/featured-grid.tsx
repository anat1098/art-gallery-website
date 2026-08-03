"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArtworkCard } from "@/components/gallery/artwork-card";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/locale-provider";
import type { ArtworkCardData } from "@/types/artwork";

type FeaturedGridProps = {
  variant: "prints" | "originals";
  artworks: ArtworkCardData[];
  viewAllHref: string;
};

export function FeaturedGrid({ variant, artworks, viewAllHref }: FeaturedGridProps) {
  const { t } = useLocale();
  const eyebrow =
    variant === "prints" ? t.home.featuredPrintsEyebrow : t.home.featuredOriginalsEyebrow;
  const title =
    variant === "prints" ? t.home.featuredPrintsTitle : t.home.featuredOriginalsTitle;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
            {eyebrow}
          </p>
          <h2 className="mt-3">{title}</h2>
        </div>
        <Button variant="link" className="px-0 text-sm" asChild>
          <Link href={viewAllHref}>{t.common.viewAll} &rarr;</Link>
        </Button>
      </div>

      <motion.div
        className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {artworks.map((artwork) => (
          <motion.div
            key={artwork.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <ArtworkCard artwork={artwork} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
