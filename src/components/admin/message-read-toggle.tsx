"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleMessageRead } from "@/server/actions/contact";

export function MessageReadToggle({
  id,
  initialValue,
}: {
  id: string;
  initialValue: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);

  return (
    <button
      type="button"
      onClick={async () => {
        const next = !value;
        setValue(next);
        const result = await toggleMessageRead(id, next);
        if (!result.ok) setValue(!next);
        router.refresh();
      }}
      className={`rounded-full px-2.5 py-1 text-xs ${
        value ? "bg-secondary text-muted-foreground" : "bg-foreground text-background"
      }`}
    >
      {value ? "Read" : "Unread"}
    </button>
  );
}
