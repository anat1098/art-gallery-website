"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db/client";
import { siteContentSchema } from "@/lib/validation/content";

const SITE_CONTENT_KEY = "content";

export async function updateSiteContent(input: Record<string, unknown>) {
  const parsed = siteContentSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0].message };
  }

  try {
    await prisma.setting.upsert({
      where: { key: SITE_CONTENT_KEY },
      update: { value: parsed.data },
      create: { key: SITE_CONTENT_KEY, value: parsed.data },
    });
    revalidatePath("/");
    revalidatePath("/prints");
    revalidatePath("/originals");
    revalidatePath("/about");
    revalidatePath("/admin/settings");
    return { ok: true as const };
  } catch {
    return {
      ok: false as const,
      error: "We couldn't reach the database. Please try again shortly.",
    };
  }
}
