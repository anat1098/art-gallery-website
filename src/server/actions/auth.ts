"use server";

import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { prisma } from "@/server/db/client";
import {
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validation/auth";

export async function registerUser(input: Record<string, unknown>) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0].message };
  }
  const { name, email, password } = parsed.data;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { ok: false as const, error: "An account with this email already exists." };
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: { name, email, passwordHash },
    });

    return { ok: true as const };
  } catch {
    return {
      ok: false as const,
      error: "We couldn't reach the database. Please try again shortly.",
    };
  }
}

export async function requestPasswordReset(input: Record<string, unknown>) {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0].message };
  }
  const { email } = parsed.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    // Always return success even if the user doesn't exist, so this
    // endpoint can't be used to enumerate registered email addresses.
    if (!user) {
      return { ok: true as const };
    }

    const token = randomUUID();
    const expires = new Date(Date.now() + 1000 * 60 * 60);

    await prisma.verificationToken.create({
      data: { identifier: email, token, expires },
    });

    // TODO: send the reset link via Resend once RESEND_API_KEY is configured.
    // Link shape: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password/${token}`

    return { ok: true as const };
  } catch {
    return {
      ok: false as const,
      error: "We couldn't reach the database. Please try again shortly.",
    };
  }
}

export async function resetPassword(
  token: string,
  input: Record<string, unknown>
) {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0].message };
  }

  try {
    const record = await prisma.verificationToken.findUnique({
      where: { token },
    });
    if (!record || record.expires < new Date()) {
      return { ok: false as const, error: "This reset link has expired." };
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    await prisma.user.update({
      where: { email: record.identifier },
      data: { passwordHash },
    });
    await prisma.verificationToken.delete({
      where: { token },
    });

    return { ok: true as const };
  } catch {
    return {
      ok: false as const,
      error: "We couldn't reach the database. Please try again shortly.",
    };
  }
}
