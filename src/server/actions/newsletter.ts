"use server";

import { prisma } from "@/server/db/client";
import { newsletterSchema } from "@/lib/validation/newsletter";

export async function subscribeToNewsletter(input: { email: string }) {
  const parsed = newsletterSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, message: parsed.error.issues[0].message };
  }

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email: parsed.data.email },
      update: {},
      create: { email: parsed.data.email },
    });
    return { success: true as const };
  } catch {
    return {
      success: false as const,
      message: "Something went wrong. Please try again shortly.",
    };
  }
}
