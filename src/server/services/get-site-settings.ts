import { prisma } from "@/server/db/client";
import { siteSettings as defaultSiteSettings } from "@/lib/constants/site";
import type { SiteSettingsInput } from "@/lib/validation/settings";

/**
 * Reads admin-editable store settings from the database, falling back to
 * the static defaults in lib/constants/site.ts if none have been saved yet
 * or the database isn't reachable.
 */
export async function getSiteSettings(): Promise<SiteSettingsInput> {
  try {
    const record = await prisma.setting.findUnique({ where: { key: "site" } });
    if (record) return record.value as SiteSettingsInput;
  } catch {
    // fall through to defaults
  }
  return defaultSiteSettings;
}
