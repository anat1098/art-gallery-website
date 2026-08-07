import { NextResponse } from "next/server";
import { prisma } from "@/server/db/client";

/**
 * Server-to-server payment notification from Tranzila.
 * Docs confirm the notify payload includes: Response, sum, TranzilaTK,
 * ConfirmationCode. Response "000" (or "0") means success; anything else
 * is a failure. Tranzila requires the response body to be the literal
 * string "OK" with HTTP 200, or it will keep retrying.
 *
 * Like the Grow integration, Tranzila's docs don't specify a signature to
 * verify the callback is authentic, so the notify URL carries a random
 * TRANZILA_WEBHOOK_TOKEN as a shared-secret query param.
 *
 * Order matching: `myid` is set to our orderId when the payment is
 * created, but Tranzila's own docs (for at least one integration path)
 * note it isn't always echoed back reliably — so if `myid` is missing,
 * this falls back to matching the most recent still-pending order for
 * the given amount, as Tranzila's own guidance suggests.
 */

function isSuccessResponse(value: unknown): boolean {
  const s = String(value ?? "").trim();
  return s === "000" || s === "0";
}

async function parseBody(req: Request): Promise<Record<string, string>> {
  const contentType = req.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const json = await req.json().catch(() => ({}));
    return json as Record<string, string>;
  }
  const form = await req.formData().catch(() => null);
  if (!form) return {};
  const out: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    out[key] = String(value);
  }
  return out;
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const expectedToken = process.env.TRANZILA_WEBHOOK_TOKEN;
  if (expectedToken && url.searchParams.get("token") !== expectedToken) {
    return new NextResponse("Invalid token", { status: 401 });
  }

  const body = await parseBody(req);
  const succeeded = isSuccessResponse(body.Response);
  const sum = Number(body.sum);
  let orderId: string | undefined = body.myid;

  try {
    let order = orderId
      ? await prisma.order.findUnique({ where: { id: orderId } })
      : null;

    // Fallback: myid wasn't echoed back — match the most recent pending
    // order for this amount instead.
    if (!order && Number.isFinite(sum)) {
      order = await prisma.order.findFirst({
        where: { paymentStatus: "PENDING", total: sum },
        orderBy: { createdAt: "desc" },
      });
      orderId = order?.id;
    }

    if (!order) {
      console.error("Tranzila webhook: no matching order found", body);
      return new NextResponse("Order not found", { status: 404 });
    }

    if (order.paymentStatus !== "PAID") {
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: succeeded ? "PAID" : "FAILED",
            status: succeeded ? "PAID" : order.status,
          },
        }),
        prisma.payment.updateMany({
          where: { orderId: order.id },
          data: {
            status: succeeded ? "PAID" : "FAILED",
            providerRef: body.TranzilaTK || body.ConfirmationCode || undefined,
          },
        }),
      ]);
    }

    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.error("Tranzila webhook processing failed:", err);
    // Still return 200/OK bodies are for success acknowledgement only;
    // returning an error here lets Tranzila retry, which is desirable
    // for a transient DB error.
    return new NextResponse("Processing failed", { status: 500 });
  }
}
