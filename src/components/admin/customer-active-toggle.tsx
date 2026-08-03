"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleCustomerActive } from "@/server/actions/customer";

export function CustomerActiveToggle({
  id,
  initialValue,
}: {
  id: string;
  initialValue: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        const next = !value;
        setValue(next);
        setPending(true);
        const result = await toggleCustomerActive(id, next);
        setPending(false);
        if (!result.ok) setValue(!next);
        router.refresh();
      }}
      className={`rounded-full px-2.5 py-1 text-xs ${
        value ? "bg-foreground text-background" : "bg-destructive text-white"
      }`}
    >
      {value ? "Active" : "Deactivated"}
    </button>
  );
}
