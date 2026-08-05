"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleMessageRead } from "@/server/actions/contact";
import { useLocale } from "@/components/providers/locale-provider";

export function MessageReadToggle({
  id,
  initialValue,
}: {
  id: string;
  initialValue: boolean;
}) {
  const router = useRouter();
  const { t } = useLocale();
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
      {value ? t.admin.messages.read : t.admin.messages.unread}
    </button>
  );
}
