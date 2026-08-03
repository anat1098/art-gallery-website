import { z } from "zod";

export const siteSettingsSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  tagline: z.string().optional(),
  supportEmail: z.email("Enter a valid email address"),
  instagramUrl: z.string().optional(),
  defaultCurrency: z.string().min(1),
  defaultLanguage: z.string().min(1),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
