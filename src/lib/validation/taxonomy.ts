import { z } from "zod";

export const taxonomySchema = z.object({
  name: z.string().min(1, "Name is required"),
  nameHe: z.string().optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
});

export type TaxonomyInput = z.infer<typeof taxonomySchema>;
