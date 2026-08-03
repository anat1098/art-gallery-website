"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/hooks/use-cart-store";
import { useCurrency } from "@/components/providers/currency-provider";
import type { ArtworkDetailData } from "@/types/artwork";

export function OriginalPurchasePanel({ artwork }: { artwork: ArtworkDetailData }) {
  const router = useRouter();
  const addLine = useCartStore((s) => s.addLine);
  const { format } = useCurrency();

  function buildLine() {
    return {
      id: artwork.id,
      artworkId: artwork.id,
      title: artwork.title,
      unitPrice: artwork.price,
      quantity: 1,
    };
  }

  function handleAddToCart() {
    addLine(buildLine());
  }

  function handleBuyNow() {
    addLine(buildLine());
    router.push("/cart");
  }

  return (
    <div>
      <p className="mt-6 text-xs font-medium tracking-widest text-muted-foreground uppercase">
        Price
      </p>
      <div className="mt-1 flex items-center gap-3">
        <p className="text-2xl">{format(artwork.price)}</p>
        {artwork.isSold && (
          <Badge className="rounded-none bg-foreground text-background">Sold</Badge>
        )}
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-y-2 text-sm">
        {artwork.widthCm && artwork.heightCm && (
          <>
            <dt className="text-muted-foreground">Dimensions</dt>
            <dd>
              {artwork.widthCm} × {artwork.heightCm} cm
            </dd>
          </>
        )}
        {artwork.yearCreated && (
          <>
            <dt className="text-muted-foreground">Year</dt>
            <dd>{artwork.yearCreated}</dd>
          </>
        )}
        <dt className="text-muted-foreground">Medium</dt>
        <dd>{artwork.medium}</dd>
      </dl>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          variant="outline"
          className="flex-1 rounded-none"
          disabled={artwork.isSold}
          onClick={handleAddToCart}
        >
          {artwork.isSold ? "Sold" : "Add to Cart"}
        </Button>
        <Button
          size="lg"
          className="flex-1 rounded-none"
          disabled={artwork.isSold}
          onClick={handleBuyNow}
        >
          Buy Now
        </Button>
      </div>

      {artwork.shippingTimeNote && (
        <p className="mt-6 text-sm text-muted-foreground">
          {artwork.shippingTimeNote}
        </p>
      )}
    </div>
  );
}
