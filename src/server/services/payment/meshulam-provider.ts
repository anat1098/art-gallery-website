import type {
  PaymentProvider,
  CreateCheckoutSessionInput,
  CreateCheckoutSessionResult,
} from "@/types/payment";

/**
 * Grow (formerly Meshulam) — Israeli hosted-checkout payment gateway.
 * Docs: https://developers.grow.business/
 *
 * Grow's API is form-encoded (not JSON) and doesn't publish an exact
 * response schema, so `extractPaymentUrl` below tries the field names
 * documented across their integration guides. If the sandbox response
 * uses a different shape, that's the one place to adjust.
 */

function getConfig() {
  const userId = process.env.MESHULAM_USER_ID;
  const pageCode = process.env.MESHULAM_PAGE_CODE;
  if (!userId || !pageCode) return null;
  return {
    userId,
    pageCode,
    apiKey: process.env.MESHULAM_API_KEY,
    baseUrl:
      process.env.MESHULAM_ENV === "production"
        ? "https://api.meshulam.co.il"
        : "https://sandbox.meshulam.co.il",
  };
}

function extractPaymentUrl(json: unknown): string | null {
  if (!json || typeof json !== "object") return null;
  const obj = json as Record<string, unknown>;
  const data = obj.data as Record<string, unknown> | undefined;
  const candidate = data?.url ?? data?.paymentUrl ?? obj.url ?? obj.paymentUrl;
  return typeof candidate === "string" ? candidate : null;
}

function extractProcessRef(json: unknown): string | undefined {
  if (!json || typeof json !== "object") return undefined;
  const obj = json as Record<string, unknown>;
  const data = obj.data as Record<string, unknown> | undefined;
  const candidate = data?.processId ?? data?.processToken ?? obj.processId;
  return typeof candidate === "string" ? candidate : undefined;
}

export const meshulamProvider: PaymentProvider = {
  id: "MESHULAM",
  label: "Credit Card (Grow)",

  isConfigured() {
    return getConfig() !== null;
  },

  async createCheckoutSession(
    input: CreateCheckoutSessionInput
  ): Promise<CreateCheckoutSessionResult> {
    const config = getConfig();
    if (!config) {
      return { ok: false, error: "Grow (Meshulam) is not configured yet." };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const webhookToken = process.env.MESHULAM_WEBHOOK_TOKEN;
    const notifyUrl = webhookToken
      ? `${baseUrl}/api/webhooks/meshulam?token=${encodeURIComponent(webhookToken)}`
      : `${baseUrl}/api/webhooks/meshulam`;

    const total =
      input.lineItems.reduce((sum, l) => sum + l.unitAmount * l.quantity, 0) +
      input.shippingAmount;

    const body = new URLSearchParams();
    body.set("pageCode", config.pageCode);
    body.set("userId", config.userId);
    if (config.apiKey) body.set("apiKey", config.apiKey);
    body.set("sum", total.toFixed(2));
    body.set("successUrl", input.successUrl);
    body.set("cancelUrl", input.cancelUrl);
    body.set("notifyUrl", notifyUrl);
    body.set("description", `Order ${input.orderNumber}`);
    body.set("pageField[fullName]", input.customerName);
    body.set("pageField[phone]", input.customerPhone || "0000000000");
    body.set("pageField[email]", input.customerEmail);
    // Custom field carries our order id so the webhook can match the callback
    // back to the right order (Grow's callback docs don't cover any other
    // way to correlate a transaction to our own records).
    body.set("cField1", input.orderId);

    input.lineItems.forEach((item, index) => {
      body.set(`productData[${index}][catalogNumber]`, String(index + 1));
      body.set(`productData[${index}][quantity]`, String(item.quantity));
      body.set(`productData[${index}][price]`, item.unitAmount.toFixed(2));
      body.set(`productData[${index}][itemDescription]`, item.name);
    });

    try {
      const response = await fetch(
        `${config.baseUrl}/api/light/server/1.0/createPaymentProcess`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
        }
      );

      const json = await response.json().catch(() => null);
      const url = extractPaymentUrl(json);

      if (!response.ok || !url) {
        console.error("Grow createPaymentProcess unexpected response:", json);
        return {
          ok: false,
          error: "Grow didn't return a checkout URL. Please try again shortly.",
        };
      }

      return { ok: true, redirectUrl: url, providerRef: extractProcessRef(json) };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "Grow checkout failed.",
      };
    }
  },
};
