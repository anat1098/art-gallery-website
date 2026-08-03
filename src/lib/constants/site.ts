/**
 * Placeholder store settings, shaped like the future `Setting` DB records.
 * Once the admin dashboard ships, these values are fetched from the database
 * instead of imported from this file.
 */
export const siteSettings = {
  storeName: "Studio Gallery",
  tagline: "Original Art & Fine Art Prints",
  supportEmail: "hello@studiogallery.art",
  instagramUrl: "https://instagram.com/studiogallery",
  defaultCurrency: "USD",
  defaultLanguage: "en",
};

export const languages = [
  { code: "en", label: "English" },
  { code: "he", label: "עברית" },
] as const;
