"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db/client";
import { taxonomySchema } from "@/lib/validation/taxonomy";

type Kind = "category" | "medium";

function modelFor(kind: Kind) {
  return kind === "category" ? prisma.category : prisma.medium;
}

export async function createTaxonomy(kind: Kind, input: Record<string, unknown>) {
  const parsed = taxonomySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0].message };
  }

  try {
    await (modelFor(kind) as { create: (args: unknown) => Promise<unknown> }).create({
      data: parsed.data,
    });
    revalidatePath(`/admin/${kind}s`);
    return { ok: true as const };
  } catch {
    return {
      ok: false as const,
      error: "We couldn't reach the database. Please try again shortly.",
    };
  }
}

export async function updateTaxonomy(
  kind: Kind,
  id: string,
  input: Record<string, unknown>
) {
  const parsed = taxonomySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0].message };
  }

  try {
    await (
      modelFor(kind) as {
        update: (args: unknown) => Promise<unknown>;
      }
    ).update({ where: { id }, data: parsed.data });
    revalidatePath(`/admin/${kind}s`);
    return { ok: true as const };
  } catch {
    return {
      ok: false as const,
      error: "We couldn't reach the database. Please try again shortly.",
    };
  }
}

export async function deleteTaxonomy(kind: Kind, id: string) {
  try {
    await (modelFor(kind) as { delete: (args: unknown) => Promise<unknown> }).delete({
      where: { id },
    });
    revalidatePath(`/admin/${kind}s`);
    return { ok: true as const };
  } catch {
    return {
      ok: false as const,
      error: "We couldn't reach the database. Please try again shortly.",
    };
  }
}
