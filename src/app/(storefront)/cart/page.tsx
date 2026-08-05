"use client";

import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/hooks/use-cart-store";
import { useCurrency } from "@/components/providers/currency-provider";
import { useLocale } from "@/components/providers/locale-provider";

export default function CartPage() {
  const lines = useCartStore((s) => s.lines);
  const removeLine = useCartStore((s) => s.removeLine);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const { format } = useCurrency();
  const { t } = useLocale();

  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center lg:px-10">
        <h1>{t.cart.empty}</h1>
        <p className="mt-4 text-muted-foreground">{t.cart.emptyBody}</p>
        <Button size="lg" className="mt-8 rounded-none px-8" asChild>
          <Link href="/prints">{t.common.shopPrints}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-14 lg:px-10 lg:py-20">
      <h1>{t.cart.title}</h1>

      <div className="mt-10 divide-y divide-border border-y border-border">
        {lines.map((line) => (
          <div key={line.id} className="flex flex-wrap items-center justify-between gap-4 py-6">
            <div>
              <p className="font-display text-lg">{line.title}</p>
              <p className="text-sm text-muted-foreground">
                {[line.sizeLabel, line.frameLabel].filter(Boolean).join(" · ") ||
                  t.cart.originalArtwork}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 rounded-full border border-border px-1">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={line.quantity <= 1}
                  onClick={() => updateQuantity(line.id, line.quantity - 1)}
                  className="flex size-7 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-4 text-center text-sm">{line.quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={line.maxQuantity !== undefined && line.quantity >= line.maxQuantity}
                  onClick={() => updateQuantity(line.id, line.quantity + 1)}
                  className="flex size-7 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
              <p className="w-20 text-right">{format(line.unitPrice * line.quantity)}</p>
              <button
                type="button"
                aria-label="Remove"
                onClick={() => removeLine(line.id)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-muted-foreground">{t.cart.subtotal}</p>
        <p className="text-xl">{format(subtotal)}</p>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{t.cart.shippingNote}</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" size="lg" className="rounded-none" asChild>
          <Link href="/prints">{t.common.continueShopping}</Link>
        </Button>
        <Button size="lg" className="rounded-none px-10" asChild>
          <Link href="/checkout">{t.common.proceedToCheckout}</Link>
        </Button>
      </div>
    </div>
  );
}
