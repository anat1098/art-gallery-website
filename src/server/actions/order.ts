"use server";

import { prisma } from "@/server/db/client";
import { checkoutSchema } from "@/lib/validation/checkout";
import { getShippingRule } from "@/lib/constants/shipping";
import { getPaymentProvider } from "@/server/services/payment";
import type { PaymentProviderId } from "@/types/payment";

type CartLineInput = {
  artworkId: string;
  title: string;
  sizeLabel?: string;
  frameLabel?: string;
  unitPrice: number;
  quantity: number;
};

type PlaceOrderInput = {
  contact: Record<string, unknown>;
  lines: CartLineInput[];
  paymentProvider: PaymentProviderId;
};

function generateOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SG-${stamp}-${rand}`;
}

export async function placeOrder(input: PlaceOrderInput) {
  const parsed = checkoutSchema.safeParse(input.contact);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0].message };
  }
  if (input.lines.length === 0) {
    return { ok: false as const, error: "Your cart is empty." };
  }

  const contact = parsed.data;
  const shippingRule = getShippingRule(contact.country);
  const subtotal = input.lines.reduce(
    (sum, l) => sum + l.unitPrice * l.quantity,
    0
  );
  const shippingCost = shippingRule.cost;
  const total = subtotal + shippingCost;
  const orderNumber = generateOrderNumber();

  const provider = getPaymentProvider(input.paymentProvider);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  let orderId: string;
  try {
    const order = await prisma.order.create({
      data: {
        orderNumber,
        email: contact.email,
        firstName: contact.firstName,
        lastName: contact.lastName,
        phone: contact.phone,
        country: contact.country,
        city: contact.city,
        street: contact.street,
        postalCode: contact.postalCode,
        shippingNotes: contact.shippingNotes,
        orderNotes: contact.orderNotes,
        currency: "USD",
        subtotal,
        shippingCost,
        total,
        items: {
          create: input.lines.map((l) => ({
            artworkId: l.artworkId,
            titleSnapshot: l.title,
            unitPrice: l.unitPrice,
            quantity: l.quantity,
            lineTotal: l.unitPrice * l.quantity,
          })),
        },
      },
    });
    orderId = order.id;
  } catch {
    return {
      ok: false as const,
      error:
        "We couldn't reach the database to save your order. Please try again shortly.",
    };
  }

  const session = await provider.createCheckoutSession({
    orderId,
    orderNumber,
    currency: "USD",
    customerEmail: contact.email,
    successUrl: `${baseUrl}/checkout/success?order=${orderNumber}`,
    cancelUrl: `${baseUrl}/checkout`,
    lineItems: input.lines.map((l) => ({
      name: [l.title, l.sizeLabel, l.frameLabel].filter(Boolean).join(" — "),
      quantity: l.quantity,
      unitAmount: l.unitPrice,
    })),
    shippingAmount: shippingCost,
  });

  if (!session.ok) {
    return { ok: false as const, error: session.error, orderNumber };
  }

  return { ok: true as const, redirectUrl: session.redirectUrl, orderNumber };
}
