import { z } from "zod";

export const siteContentSchema = z.object({
  heroSubtitleEn: z.string().optional(),
  heroSubtitleHe: z.string().optional(),
  footerTaglineEn: z.string().optional(),
  footerTaglineHe: z.string().optional(),
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
  careInfoEn: z.string().optional(),
  careInfoHe: z.string().optional(),
  returnsPolicyEn: z.string().optional(),
  returnsPolicyHe: z.string().optional(),
  shippingInfoEn: z.string().optional(),
  shippingInfoHe: z.string().optional(),
  contactBodyEn: z.string().optional(),
  contactBodyHe: z.string().optional(),
  newsletterBodyEn: z.string().optional(),
  newsletterBodyHe: z.string().optional(),
});

export type SiteContentInput = z.infer<typeof siteContentSchema>;
