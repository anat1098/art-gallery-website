"use server";

import { auth } from "@/server/auth";
import { prisma } from "@/server/db/client";
import { profileSchema } from "@/lib/validation/profile";

export async function updateProfile(input: Record<string, unknown>) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false as const, error: "You need to be logged in." };
  }

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0].message };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: parsed.data.name, phone: parsed.data.phone },
    });
    return { ok: true as const };
  } catch {
    return {
      ok: false as const,
      error: "We couldn't reach the database. Please try again shortly.",
    };
  }
}
