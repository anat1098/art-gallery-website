import Stripe from "stripe";
import type {
  PaymentProvider,
  CreateCheckoutSessionInput,
  CreateCheckoutSessionResult,
} from "@/types/payment";

function getClient(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export const stripeProvider: PaymentProvider = {
  id: "STRIPE",
  label: "Card (Stripe)",

  isConfigured() {
    return Boolean(process.env.STRIPE_SECRET_KEY);
  },

  async createCheckoutSession(
    input: CreateCheckoutSessionInput
  ): Promise<CreateCheckoutSessionResult> {
    const client = getClient();
    if (!client) {
      return { ok: false, error: "Stripe is not configured yet." };
    }

    try {
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
        input.lineItems.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: input.currency.toLowerCase(),
            unit_amount: Math.round(item.unitAmount * 100),
            product_data: { name: item.name },
          },
        }));

      if (input.shippingAmount > 0) {
        lineItems.push({
          quantity: 1,
          price_data: {
            currency: input.currency.toLowerCase(),
            unit_amount: Math.round(input.shippingAmount * 100),
            product_data: { name: "Shipping" },
          },
        });
      }

      const session = await client.checkout.sessions.create({
        mode: "payment",
        customer_email: input.customerEmail,
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
        line_items: lineItems,
        metadata: {
          orderId: input.orderId,
          orderNumber: input.orderNumber,
        },
      });

      if (!session.url) {
        return { ok: false, error: "Stripe did not return a checkout URL." };
      }
      return { ok: true, redirectUrl: session.url };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "Stripe checkout failed.",
      };
    }
  },
};
