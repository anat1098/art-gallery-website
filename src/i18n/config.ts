export type Locale = "en" | "he";

export const locales: Locale[] = ["en", "he"];
export const defaultLocale: Locale = "en";

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}
