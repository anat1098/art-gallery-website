"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArtworkPlaceholder } from "@/components/shared/artwork-placeholder";
import { useLocale } from "@/components/providers/locale-provider";

export function Hero() {
  const { t } = useLocale();

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="order-2 lg:order-1"
        >
          <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
            {t.home.eyebrow}
          </p>
          <h1 className="mt-4">{t.home.heroTitle}</h1>
          <p className="mt-6 max-w-md text-base text-muted-foreground">
            {t.home.heroSubtitle}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button size="lg" className="rounded-none px-8" asChild>
              <Link href="/prints">{t.common.shopPrints}</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-none px-8"
              asChild
            >
              <Link href="/originals">{t.common.viewGallery}</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 lg:order-2"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <ArtworkPlaceholder seed="hero" className="h-full w-full" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
