"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db/client";
import { siteSettingsSchema } from "@/lib/validation/settings";

const SITE_SETTINGS_KEY = "site";

export async function updateSiteSettings(input: Record<string, unknown>) {
  const parsed = siteSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0].message };
  }

  try {
    await prisma.setting.upsert({
      where: { key: SITE_SETTINGS_KEY },
      update: { value: parsed.data },
      create: { key: SITE_SETTINGS_KEY, value: parsed.data },
    });
    revalidatePath("/admin/settings");
    return { ok: true as const };
  } catch {
    return {
      ok: false as const,
      error: "We couldn't reach the database. Please try again shortly.",
    };
  }
}
