"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArtworkPlaceholder } from "@/components/shared/artwork-placeholder";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/components/providers/currency-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { useCartStore } from "@/hooks/use-cart-store";
import { useRequireAuth } from "@/hooks/use-require-auth";
import type { ArtworkCardData } from "@/types/artwork";

const imageVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.04 },
};

const buttonVariants = {
  rest: { opacity: 0, y: 10 },
  hover: { opacity: 1, y: 0 },
};

export function ArtworkCard({ artwork }: { artwork: ArtworkCardData }) {
  const { format } = useCurrency();
  const { t } = useLocale();
  const addLine = useCartStore((s) => s.addLine);
  const { requireAuth } = useRequireAuth();
  const href = `/${artwork.type === "PRINT" ? "prints" : "originals"}/${artwork.slug}`;

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (artwork.isSold) return;
    if (!requireAuth()) return;

    const isPrint = artwork.type === "PRINT";
    const id = isPrint
      ? `${artwork.id}-${artwork.quickAdd?.sizeId}-${artwork.quickAdd?.frameId}`
      : artwork.id;

    addLine({
      id,
      artworkId: artwork.id,
      title: artwork.title,
      sizeLabel: artwork.quickAdd?.sizeLabel,
      frameLabel: artwork.quickAdd?.frameLabel,
      unitPrice: artwork.price,
      quantity: 1,
    });
  }

  return (
    <Link href={href} className="group block">
      <motion.div
        className="relative aspect-square overflow-hidden bg-muted"
        whileHover="hover"
        initial="rest"
      >
        <motion.div
          className="h-full w-full"
          variants={imageVariants}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <ArtworkPlaceholder seed={artwork.id} className="h-full w-full" />
        </motion.div>

        {artwork.isSold && (
          <Badge className="absolute start-3 top-3 rounded-none bg-foreground text-background">
            {t.artwork.sold}
          </Badge>
        )}

        {!artwork.isSold && (
          <motion.div
            className="absolute inset-x-3 bottom-3"
            variants={buttonVariants}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={handleQuickAdd}
              className="w-full border border-foreground bg-background/95 py-2.5 text-[11px] font-medium tracking-[0.15em] text-foreground uppercase transition-colors hover:bg-foreground hover:text-background"
            >
              {t.common.addToCart}
            </button>
          </motion.div>
        )}
      </motion.div>

      <div className="mt-4 flex items-baseline justify-between gap-2">
        <div>
          <p className="font-display text-lg">&lsquo;{artwork.title}&rsquo;</p>
          <p className="text-sm text-muted-foreground">{artwork.medium}</p>
        </div>
        <p className="whitespace-nowrap text-sm text-foreground/80">
          {artwork.type === "PRINT" ? `${t.artwork.from} ` : ""}
          {format(artwork.price)}
        </p>
      </div>
    </Link>
  );
}
