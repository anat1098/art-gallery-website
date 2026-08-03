"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteArtwork } from "@/server/actions/artwork";

export function DeleteArtworkButton({ id }: { id: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        type="button"
        variant="ghost"
        className="text-destructive hover:text-destructive"
        onClick={async () => {
          if (!window.confirm("Delete this artwork? This cannot be undone.")) return;
          const result = await deleteArtwork(id);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          router.push("/admin/artworks");
          router.refresh();
        }}
      >
        Delete Artwork
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
