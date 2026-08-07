import { NextResponse } from "next/server";
import { prisma } from "@/server/db/client";

/**
 * Server-to-server payment notification from Grow (Meshulam).
 * Docs: https://developers.grow.business/reference/payment-request-callback
 *
 * Grow's docs don't specify a signature/HMAC to verify the callback is
 * really from them, so as our own mitigation the notifyUrl we register
 * includes a `token` query param (MESHULAM_WEBHOOK_TOKEN) that acts as a
 * shared secret — an unguessable URL rather than a verifiable signature.
 * If Grow's dashboard/support later documents real signature verification,
 * that should replace this check.
 */

function isSuccessStatus(value: unknown): boolean {
  const s = String(value ?? "").trim().toLowerCase();
  return s === "1" || s === "true" || s === "success" || s === "approved";
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

async function approveTransaction(transactionId: string, transactionToken: string) {
  const userId = process.env.MESHULAM_USER_ID;
  const pageCode = process.env.MESHULAM_PAGE_CODE;
  if (!userId || !pageCode) return;

  const baseUrl =
    process.env.MESHULAM_ENV === "production"
      ? "https://api.meshulam.co.il"
      : "https://sandbox.meshulam.co.il";

  const body = new URLSearchParams({
    userId,
    pageCode,
    transactionId,
    transactionToken,
  });

  try {
    await fetch(`${baseUrl}/api/light/server/1.0/approveTransaction`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // Best-effort only — per Grow's docs the transaction is already
    // processed regardless of whether this acknowledgement succeeds.
  }
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const expectedToken = process.env.MESHULAM_WEBHOOK_TOKEN;
  if (expectedToken && url.searchParams.get("token") !== expectedToken) {
    return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });
  }

  const body = await parseBody(req);
  const orderId = body.cField1;
  const transactionId = body.transactionId;
  const transactionToken = body.transactionToken;
  const succeeded = isSuccessStatus(body.status ?? body.statusCode);

  if (!orderId) {
    console.error("Meshulam webhook missing cField1 (orderId):", body);
    return NextResponse.json({ ok: false, error: "Missing order reference" }, { status: 400 });
  }

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      console.error("Meshulam webhook: no order found for id", orderId);
      return NextResponse.json({ ok: false, error: "Order not found" }, { status: 404 });
    }

    // Idempotent: if we've already recorded this order as paid, don't
    // reprocess (Grow may retry the callback).
    if (order.paymentStatus !== "PAID") {
      await prisma.$transaction([
        prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: succeeded ? "PAID" : "FAILED",
            status: succeeded ? "PAID" : order.status,
          },
        }),
        prisma.payment.updateMany({
          where: { orderId },
          data: {
            status: succeeded ? "PAID" : "FAILED",
            providerRef: transactionId || undefined,
          },
        }),
      ]);
    }

    if (succeeded && transactionId && transactionToken) {
      await approveTransaction(transactionId, transactionToken);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Meshulam webhook processing failed:", err);
    return NextResponse.json({ ok: false, error: "Processing failed" }, { status: 500 });
  }
}
