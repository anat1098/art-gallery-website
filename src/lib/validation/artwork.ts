import { z } from "zod";

export const printSizeSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, "Label is required"),
  widthCm: z.number().positive("Must be positive"),
  heightCm: z.number().positive("Must be positive"),
  price: z.number().positive("Must be positive"),
  inventory: z.number().int().min(0, "Must be 0 or more"),
});

export const frameOptionSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, "Label is required"),
  priceDelta: z.number().min(0, "Must be 0 or more"),
  isDefault: z.boolean().optional(),
});

export const artworkSchema = z
  .object({
    type: z.enum(["PRINT", "ORIGINAL"]),
    title: z.string().min(1, "Title is required"),
    titleHe: z.string().optional(),
    slug: z
      .string()
      .min(1, "Slug is required")
      .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
    description: z.string().optional(),
    materials: z.string().optional(),
    categoryId: z.string().optional(),
    mediumId: z.string().optional(),
    isFeatured: z.boolean().optional(),
    isNewArrival: z.boolean().optional(),
    isPublished: z.boolean().optional(),

    originalPrice: z.number().optional(),
    originalWidthCm: z.number().optional(),
    originalHeightCm: z.number().optional(),
    yearCreated: z.number().optional(),
    isSold: z.boolean().optional(),
    shippingTimeNote: z.string().optional(),

    printSizes: z.array(printSizeSchema).optional(),
    frameOptions: z.array(frameOptionSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "ORIGINAL") {
      if (!data.originalPrice || data.originalPrice <= 0) {
        ctx.addIssue({
          code: "custom",
          path: ["originalPrice"],
          message: "Price is required for originals",
        });
      }
    }
    if (data.type === "PRINT" && (!data.printSizes || data.printSizes.length === 0)) {
      ctx.addIssue({
        code: "custom",
        path: ["printSizes"],
        message: "Add at least one print size",
      });
    }
  });

export type ArtworkInput = z.infer<typeof artworkSchema>;
