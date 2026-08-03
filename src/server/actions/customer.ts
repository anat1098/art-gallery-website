"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db/client";

export async function toggleCustomerActive(id: string, isActive: boolean) {
  try {
    await prisma.user.update({ where: { id }, data: { isActive } });
    revalidatePath("/admin/customers");
    return { ok: true as const };
  } catch {
    return {
      ok: false as const,
      error: "We couldn't reach the database. Please try again shortly.",
    };
  }
}
