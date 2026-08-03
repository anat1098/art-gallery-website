"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db/client";
import { contactSchema } from "@/lib/validation/contact";

export async function submitContactMessage(input: Record<string, unknown>) {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0].message };
  }

  try {
    const session = await auth();
    await prisma.contactMessage.create({
      data: { ...parsed.data, userId: session?.user?.id },
    });
    return { ok: true as const };
  } catch {
    return {
      ok: false as const,
      error: "We couldn't reach the database. Please try again shortly.",
    };
  }
}

export async function toggleMessageRead(id: string, isRead: boolean) {
  try {
    await prisma.contactMessage.update({ where: { id }, data: { isRead } });
    revalidatePath("/admin/messages");
    return { ok: true as const };
  } catch {
    return {
      ok: false as const,
      error: "We couldn't reach the database. Please try again shortly.",
    };
  }
}
