"use client";

import { useEffect } from "react";
import { useCartStore } from "@/hooks/use-cart-store";

export function ClearCartOnMount() {
  const clear = useCartStore((s) => s.clear);

  useEffect(() => {
    clear();
  }, [clear]);

  return null;
}
