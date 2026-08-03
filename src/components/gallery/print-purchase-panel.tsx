"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCartStore } from "@/hooks/use-cart-store";
import { useCurrency } from "@/components/providers/currency-provider";
import type { ArtworkDetailData } from "@/types/artwork";

export function PrintPurchasePanel({ artwork }: { artwork: ArtworkDetailData }) {
  const sizes = artwork.printSizes ?? [];
  const frames = artwork.frameOptions ?? [];
  const router = useRouter();
  const addLine = useCartStore((s) => s.addLine);
  const { format } = useCurrency();

  const [sizeId, setSizeId] = useState(sizes[0]?.id);
  const [frameId, setFrameId] = useState(
    frames.find((f) => f.isDefault)?.id ?? frames[0]?.id
  );

  const selectedSize = sizes.find((s) => s.id === sizeId) ?? sizes[0];
  const selectedFrame = frames.find((f) => f.id === frameId);

  const totalPrice = useMemo(() => {
    const base = selectedSize?.price ?? artwork.price;
    return base + (selectedFrame?.priceDelta ?? 0);
  }, [selectedSize, selectedFrame, artwork.price]);

  const outOfStock = (selectedSize?.inventory ?? 1) <= 0;

  function buildLine() {
    return {
      id: `${artwork.id}-${sizeId}-${frameId}`,
      artworkId: artwork.id,
      title: artwork.title,
      sizeLabel: selectedSize?.label,
      frameLabel: selectedFrame?.label,
      unitPrice: totalPrice,
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
      <p className="mt-1 text-2xl">{format(totalPrice)}</p>

      {sizes.length > 0 && (
        <div className="mt-8">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Size
          </p>
          <Select value={sizeId} onValueChange={setSizeId}>
            <SelectTrigger className="mt-2 w-full rounded-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sizes.map((s) => (
                <SelectItem key={s.id} value={s.id} disabled={s.inventory <= 0}>
                  {s.label} — {format(s.price)}
                  {s.inventory <= 0 ? " (Out of stock)" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {frames.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Frame
          </p>
          <Select value={frameId} onValueChange={setFrameId}>
            <SelectTrigger className="mt-2 w-full rounded-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {frames.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.label}
                  {f.priceDelta > 0 ? ` (+${format(f.priceDelta)})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          variant="outline"
          className="flex-1 rounded-none"
          disabled={outOfStock}
          onClick={handleAddToCart}
        >
          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
        <Button
          size="lg"
          className="flex-1 rounded-none"
          disabled={outOfStock}
          onClick={handleBuyNow}
        >
          Buy Now
        </Button>
      </div>

      {artwork.estimatedDelivery && (
        <p className="mt-6 text-sm text-muted-foreground">
          Estimated delivery: {artwork.estimatedDelivery}
        </p>
      )}
    </div>
  );
}
