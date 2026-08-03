"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleArtworkFlag } from "@/server/actions/artwork";

export function ArtworkFlagToggle({
  id,
  field,
  initialValue,
  label,
}: {
  id: string;
  field: "isPublished" | "isFeatured" | "isNewArrival" | "isSold";
  initialValue: boolean;
  label: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        const next = !value;
        setValue(next);
        startTransition(async () => {
          const result = await toggleArtworkFlag(id, field, next);
          if (!result.ok) setValue(!next);
          router.refresh();
        });
      }}
      className={`rounded-full px-2.5 py-1 text-xs ${
        value
          ? "bg-foreground text-background"
          : "bg-secondary text-muted-foreground"
      }`}
    >
      {label}
    </button>
  );
}
