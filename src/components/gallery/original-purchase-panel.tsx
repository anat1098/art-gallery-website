"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/hooks/use-cart-store";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useCurrency } from "@/components/providers/currency-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { localizeDetail } from "@/lib/localize-artwork";
import type { ArtworkDetailData } from "@/types/artwork";

export function OriginalPurchasePanel({ artwork }: { artwork: ArtworkDetailData }) {
  const router = useRouter();
  const addLine = useCartStore((s) => s.addLine);
  const cartQuantity = useCartStore(
    (s) => s.lines.find((l) => l.id === artwork.id)?.quantity ?? 0
  );
  const { requireAuth } = useRequireAuth();
  const { format } = useCurrency();
  const { t, locale } = useLocale();
  const { medium } = localizeDetail(artwork, locale);
  const maxQuantity = artwork.inventory ?? 1;
  const atMax = cartQuantity >= maxQuantity;

  function buildLine() {
    return {
      id: artwork.id,
      artworkId: artwork.id,
      title: artwork.title,
      unitPrice: artwork.price,
      quantity: 1,
      maxQuantity,
    };
  }

  function handleAddToCart() {
    if (!requireAuth()) return;
    addLine(buildLine());
  }

  function handleBuyNow() {
    if (!requireAuth()) return;
    addLine(buildLine());
    router.push("/cart");
  }

  return (
    <div>
      <p className="mt-6 text-xs font-medium tracking-widest text-muted-foreground uppercase">
        {t.artwork.price}
      </p>
      <div className="mt-1 flex items-center gap-3">
        <p className="text-2xl">{format(artwork.price)}</p>
        {artwork.isSold && (
          <Badge className="rounded-none bg-foreground text-background">{t.artwork.sold}</Badge>
        )}
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-y-2 text-sm">
        {artwork.widthCm && artwork.heightCm && (
          <>
            <dt className="text-muted-foreground">{t.artwork.dimensions}</dt>
            <dd>
              {artwork.widthCm} × {artwork.heightCm} cm
            </dd>
          </>
        )}
        {artwork.yearCreated && (
          <>
            <dt className="text-muted-foreground">{t.artwork.year}</dt>
            <dd>{artwork.yearCreated}</dd>
          </>
        )}
        <dt className="text-muted-foreground">{t.artwork.medium}</dt>
        <dd>{medium}</dd>
      </dl>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          variant="outline"
          className="h-12 flex-1 rounded-none"
          disabled={artwork.isSold || atMax}
          onClick={handleAddToCart}
        >
          {artwork.isSold ? t.artwork.sold : atMax ? t.common.inCart : t.common.addToCart}
        </Button>
        <Button
          size="lg"
          className="h-12 flex-1 rounded-none"
          disabled={artwork.isSold}
          onClick={handleBuyNow}
        >
          {t.common.buyNow}
        </Button>
      </div>

      {artwork.shippingTimeNote && (
        <p className="mt-6 text-sm text-muted-foreground">{artwork.shippingTimeNote}</p>
      )}
    </div>
  );
}
