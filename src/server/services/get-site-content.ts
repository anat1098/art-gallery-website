import { prisma } from "@/server/db/client";
import type { SiteContentInput } from "@/lib/validation/content";

export async function getSiteContent(): Promise<SiteContentInput> {
  try {
    const record = await prisma.setting.findUnique({ where: { key: "content" } });
    if (record) return record.value as SiteContentInput;
  } catch {
    // fall through to defaults
  }
  return {};
}

export function resolveContent(
  locale: "en" | "he",
  overrideEn: string | undefined,
  overrideHe: string | undefined,
  fallback: string
): string {
  const override = locale === "he" ? overrideHe : overrideEn;
  return override && override.trim() ? override : fallback;
}
