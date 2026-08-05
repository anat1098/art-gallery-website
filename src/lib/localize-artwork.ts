import type { Locale } from "@/i18n/config";
import type { ArtworkCardData, ArtworkDetailData } from "@/types/artwork";

function pick(locale: Locale, en: string, he: string | undefined): string {
  return locale === "he" && he && he.trim() ? he : en;
}

export function localizeCard(artwork: ArtworkCardData, locale: Locale) {
  return {
    title: pick(locale, artwork.title, artwork.titleHe),
    medium: pick(locale, artwork.medium, artwork.mediumHe),
  };
}

export function localizeDetail(artwork: ArtworkDetailData, locale: Locale) {
  return {
    title: pick(locale, artwork.title, artwork.titleHe),
    medium: pick(locale, artwork.medium, artwork.mediumHe),
    description: pick(locale, artwork.description, artwork.descriptionHe),
    categoryName: pick(locale, artwork.categoryName, artwork.categoryNameHe),
  };
}
