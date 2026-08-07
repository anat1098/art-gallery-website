import { NextResponse } from "next/server";
import { prisma } from "@/server/db/client";
import { getConfig, getAccessToken } from "@/server/services/payment/paypal-provider";

/**
 * PayPal redirects the buyer here after they approve payment, with
 * ?token=<paypalOrderId>&PayerID=... appended to whatever query params we
 * put on the return_url ourselves (successUrl/cancelUrl/orderId). We must
 * explicitly capture the order server-side here — PayPal doesn't move the
 * money until this call succeeds.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const paypalOrderId = url.searchParams.get("token");
  const orderId = url.searchParams.get("orderId");
  const successUrl = url.searchParams.get("successUrl");
  const cancelUrl = url.searchParams.get("cancelUrl") ?? `${baseUrl}/checkout`;

  if (!paypalOrderId || !orderId) {
    return NextResponse.redirect(cancelUrl);
  }

  const config = getConfig();
  if (!config) {
    return NextResponse.redirect(cancelUrl);
  }

  try {
    const token = await getAccessToken(config);
    if (!token) return NextResponse.redirect(cancelUrl);

    const captureRes = await fetch(
      `${config.baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const captureJson = await captureRes.json().catch(() => null);
    const succeeded = captureRes.ok && captureJson?.status === "COMPLETED";
    const captureId =
      captureJson?.purchase_units?.[0]?.payments?.captures?.[0]?.id as
        | string
        | undefined;

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (order && order.paymentStatus !== "PAID") {
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
            providerRef: captureId ?? paypalOrderId,
          },
        }),
      ]);
    }

    return NextResponse.redirect(succeeded ? (successUrl ?? cancelUrl) : cancelUrl);
  } catch (err) {
    console.error("PayPal capture failed:", err);
    return NextResponse.redirect(cancelUrl);
  }
}
