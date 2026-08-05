import { z } from "zod";

export const siteContentSchema = z.object({
  printsSubheadingEn: z.string().optional(),
  printsSubheadingHe: z.string().optional(),
  originalsSubheadingEn: z.string().optional(),
  originalsSubheadingHe: z.string().optional(),
  homeAboutBodyEn: z.string().optional(),
  homeAboutBodyHe: z.string().optional(),
  aboutBody1En: z.string().optional(),
  aboutBody1He: z.string().optional(),
  aboutBody2En: z.string().optional(),
  aboutBody2He: z.string().optional(),
});

export type SiteContentInput = z.infer<typeof siteContentSchema>;
