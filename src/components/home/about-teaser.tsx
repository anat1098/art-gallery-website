"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArtworkPlaceholder } from "@/components/shared/artwork-placeholder";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/locale-provider";

export function AboutTeaser() {
  const { t } = useLocale();

  return (
    <section className="bg-secondary/50">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[4/5] overflow-hidden"
        >
          <ArtworkPlaceholder seed="about" className="h-full w-full" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
            {t.home.aboutEyebrow}
          </p>
          <h2 className="mt-3">{t.home.aboutTitle}</h2>
          <p className="mt-6 max-w-md text-base text-muted-foreground">
            {t.home.aboutBody}
          </p>
          <Button
            variant="outline"
            className="mt-8 rounded-none px-8"
            size="lg"
            asChild
          >
            <Link href="/about">{t.common.readMore}</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
