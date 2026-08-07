import type {
  PaymentProvider,
  CreateCheckoutSessionInput,
  CreateCheckoutSessionResult,
} from "@/types/payment";

/**
 * PayPal Checkout — Orders v2 API (official, stable REST API).
 * Docs: https://developer.paypal.com/docs/api/orders/v2/
 *
 * Flow: create an order (intent=CAPTURE) -> redirect the buyer to the
 * "approve" link PayPal returns -> PayPal redirects back to our own
 * return route with ?token=<orderId>&PayerID=... -> we capture the order
 * server-side there and mark it paid. No separate webhook is required for
 * the base flow since capture happens synchronously on return, unlike the
 * async notify callbacks Grow/Tranzila use.
 */

export function getConfig() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  return {
    clientId,
    clientSecret,
    baseUrl:
      process.env.PAYPAL_ENV === "production"
        ? "https://api-m.paypal.com"
        : "https://api-m.sandbox.paypal.com",
  };
}

export async function getAccessToken(config: NonNullable<ReturnType<typeof getConfig>>) {
  const response = await fetch(`${config.baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!response.ok) return null;
  const json = (await response.json()) as { access_token?: string };
  return json.access_token ?? null;
}

export const paypalProvider: PaymentProvider = {
  id: "PAYPAL",
  label: "PayPal",

  isConfigured() {
    return getConfig() !== null;
  },

  async createCheckoutSession(
    input: CreateCheckoutSessionInput
  ): Promise<CreateCheckoutSessionResult> {
    const config = getConfig();
    if (!config) {
      return { ok: false, error: "PayPal is not configured yet." };
    }

    const token = await getAccessToken(config);
    if (!token) {
      return { ok: false, error: "Couldn't authenticate with PayPal." };
    }

    const total =
      input.lineItems.reduce((sum, l) => sum + l.unitAmount * l.quantity, 0) +
      input.shippingAmount;

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const returnUrl = new URL(`${baseUrl}/api/payments/paypal/return`);
    returnUrl.searchParams.set("successUrl", input.successUrl);
    returnUrl.searchParams.set("cancelUrl", input.cancelUrl);
    returnUrl.searchParams.set("orderId", input.orderId);

    try {
      const response = await fetch(`${config.baseUrl}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              custom_id: input.orderId,
              description: `Order ${input.orderNumber}`,
              amount: {
                currency_code: input.currency,
                value: total.toFixed(2),
              },
            },
          ],
          application_context: {
            return_url: returnUrl.toString(),
            cancel_url: input.cancelUrl,
            user_action: "PAY_NOW",
            shipping_preference: "NO_SHIPPING",
          },
        }),
      });

      const json = await response.json().catch(() => null);
      const links = (json?.links ?? []) as { rel: string; href: string }[];
      const approveUrl = links.find((l) => l.rel === "approve")?.href;

      if (!response.ok || !approveUrl) {
        console.error("PayPal create order unexpected response:", json);
        return { ok: false, error: "PayPal didn't return an approval link." };
      }

      return { ok: true, redirectUrl: approveUrl, providerRef: json?.id };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "PayPal checkout failed.",
      };
    }
  },
};
