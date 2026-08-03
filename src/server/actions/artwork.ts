"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db/client";
import { artworkSchema } from "@/lib/validation/artwork";

export async function createArtwork(input: Record<string, unknown>) {
  const parsed = artworkSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0].message };
  }
  const data = parsed.data;

  try {
    const artwork = await prisma.artwork.create({
      data: {
        type: data.type,
        title: data.title,
        titleHe: data.titleHe || null,
        slug: data.slug,
        description: data.description || null,
        materials: data.materials || null,
        categoryId: data.categoryId || null,
        mediumId: data.mediumId || null,
        isFeatured: data.isFeatured ?? false,
        isNewArrival: data.isNewArrival ?? false,
        isPublished: data.isPublished ?? false,
        originalPrice: data.type === "ORIGINAL" ? data.originalPrice : null,
        originalWidthCm: data.type === "ORIGINAL" ? data.originalWidthCm : null,
        originalHeightCm: data.type === "ORIGINAL" ? data.originalHeightCm : null,
        yearCreated: data.type === "ORIGINAL" ? data.yearCreated : null,
        isSold: data.isSold ?? false,
        shippingTimeNote: data.shippingTimeNote || null,
        printSizes:
          data.type === "PRINT" && data.printSizes
            ? { create: data.printSizes.map(({ id: _id, ...s }) => s) }
            : undefined,
        frameOptions:
          data.type === "PRINT" && data.frameOptions
            ? { create: data.frameOptions.map(({ id: _id, ...f }) => f) }
            : undefined,
      },
    });
    revalidatePath("/admin/artworks");
    return { ok: true as const, id: artwork.id };
  } catch {
    return {
      ok: false as const,
      error: "We couldn't reach the database. Please try again shortly.",
    };
  }
}

export async function updateArtwork(id: string, input: Record<string, unknown>) {
  const parsed = artworkSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0].message };
  }
  const data = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.artwork.update({
        where: { id },
        data: {
          type: data.type,
          title: data.title,
          titleHe: data.titleHe || null,
          slug: data.slug,
          description: data.description || null,
          materials: data.materials || null,
          categoryId: data.categoryId || null,
          mediumId: data.mediumId || null,
          isFeatured: data.isFeatured ?? false,
          isNewArrival: data.isNewArrival ?? false,
          isPublished: data.isPublished ?? false,
          originalPrice: data.type === "ORIGINAL" ? data.originalPrice : null,
          originalWidthCm: data.type === "ORIGINAL" ? data.originalWidthCm : null,
          originalHeightCm: data.type === "ORIGINAL" ? data.originalHeightCm : null,
          yearCreated: data.type === "ORIGINAL" ? data.yearCreated : null,
          isSold: data.isSold ?? false,
          shippingTimeNote: data.shippingTimeNote || null,
        },
      });

      // Nested size/frame collections are small admin-managed lists, so a
      // full replace-on-save is simpler and safer than diffing edits.
      await tx.printSize.deleteMany({ where: { artworkId: id } });
      await tx.frameOption.deleteMany({ where: { artworkId: id } });

      if (data.type === "PRINT") {
        if (data.printSizes?.length) {
          await tx.printSize.createMany({
            data: data.printSizes.map(({ id: _id, ...s }) => ({
              ...s,
              artworkId: id,
            })),
          });
        }
        if (data.frameOptions?.length) {
          await tx.frameOption.createMany({
            data: data.frameOptions.map(({ id: _id, ...f }) => ({
              ...f,
              artworkId: id,
            })),
          });
        }
      }
    });

    revalidatePath("/admin/artworks");
    return { ok: true as const };
  } catch {
    return {
      ok: false as const,
      error: "We couldn't reach the database. Please try again shortly.",
    };
  }
}

export async function deleteArtwork(id: string) {
  try {
    await prisma.artwork.delete({ where: { id } });
    revalidatePath("/admin/artworks");
    return { ok: true as const };
  } catch {
    return {
      ok: false as const,
      error: "We couldn't reach the database. Please try again shortly.",
    };
  }
}

export async function toggleArtworkFlag(
  id: string,
  field: "isPublished" | "isFeatured" | "isNewArrival" | "isSold",
  value: boolean
) {
  try {
    await prisma.artwork.update({ where: { id }, data: { [field]: value } });
    revalidatePath("/admin/artworks");
    return { ok: true as const };
  } catch {
    return {
      ok: false as const,
      error: "We couldn't reach the database. Please try again shortly.",
    };
  }
}
