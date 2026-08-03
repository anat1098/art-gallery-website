"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db/client";

const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "PREPARING",
  "PRINTED",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];

export async function updateOrderStatus(id: string, status: string) {
  if (!ORDER_STATUSES.includes(status as OrderStatus)) {
    return { ok: false as const, error: "Invalid status." };
  }

  try {
    await prisma.order.update({
      where: { id },
      data: { status: status as OrderStatus },
    });

    // TODO: send an order-status-update email via Resend once
    // RESEND_API_KEY is configured.

    revalidatePath(`/admin/orders/${id}`);
    revalidatePath("/admin/orders");
    return { ok: true as const };
  } catch {
    return {
      ok: false as const,
      error: "We couldn't reach the database. Please try again shortly.",
    };
  }
}

export async function updateOrderTracking(
  id: string,
  trackingNumber: string,
  trackingUrl: string
) {
  try {
    await prisma.order.update({
      where: { id },
      data: {
        trackingNumber: trackingNumber || null,
        trackingUrl: trackingUrl || null,
      },
    });
    revalidatePath(`/admin/orders/${id}`);
    return { ok: true as const };
  } catch {
    return {
      ok: false as const,
      error: "We couldn't reach the database. Please try again shortly.",
    };
  }
}
