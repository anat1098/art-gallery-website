import type {
  PaymentProvider,
  CreateCheckoutSessionInput,
  CreateCheckoutSessionResult,
} from "@/types/payment";

/**
 * Tranzila — Israeli payment gateway, hosted iframe/redirect checkout.
 * Docs: https://docs.tranzila.com/ (many pages were unindexed as of writing;
 * the parameter set below is the classic Tranzila iframe API, which has
 * stayed stable across their WooCommerce/PrestaShop/Magento plugins for
 * years — but it hasn't been confirmed against a live terminal here.
 * Worth a quick sandbox test once real terminal credentials exist, since
 * Tranzila has multiple integration generations (classic vs "Secure 5")
 * that vary slightly in parameter naming).
 *
 * Numeric currency codes Tranzila uses: 1 = ILS, 2 = USD, 978 = EUR.
 */

const CURRENCY_CODES: Record<string, string> = {
  ILS: "1",
  USD: "2",
  EUR: "978",
};

function getConfig() {
  const terminal = process.env.TRANZILA_TERMINAL;
  if (!terminal) return null;
  return { terminal };
}

export const tranzilaProvider: PaymentProvider = {
  id: "TRANZILA",
  label: "Credit Card (Tranzila)",

  isConfigured() {
    return getConfig() !== null;
  },

  async createCheckoutSession(
    input: CreateCheckoutSessionInput
  ): Promise<CreateCheckoutSessionResult> {
    const config = getConfig();
    if (!config) {
      return { ok: false, error: "Tranzila is not configured yet." };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const webhookToken = process.env.TRANZILA_WEBHOOK_TOKEN;
    const notifyUrl = webhookToken
      ? `${baseUrl}/api/webhooks/tranzila?token=${encodeURIComponent(webhookToken)}`
      : `${baseUrl}/api/webhooks/tranzila`;

    const total =
      input.lineItems.reduce((sum, l) => sum + l.unitAmount * l.quantity, 0) +
      input.shippingAmount;

    const currency = CURRENCY_CODES[input.currency.toUpperCase()] ?? CURRENCY_CODES.USD;

    const params = new URLSearchParams();
    params.set("sum", total.toFixed(2));
    params.set("currency", currency);
    // "AK" = authorize + capture in one step (standard one-time card charge).
    params.set("tranmode", "AK");
    params.set("cred_type", "1");
    // Merchant reference field — used to match the notify callback back to
    // our order (see the fallback amount-matching in the webhook handler
    // in case a given terminal doesn't echo this back reliably).
    params.set("myid", input.orderId);
    params.set("contact", input.customerName);
    params.set("email", input.customerEmail);
    params.set("phone", input.customerPhone || "0000000000");
    params.set("pdesc", `Order ${input.orderNumber}`);
    params.set("success_url_address", input.successUrl);
    params.set("fail_url_address", input.cancelUrl);
    params.set("notify_url_address", notifyUrl);

    const redirectUrl = `https://direct.tranzila.com/${config.terminal}/iframenew.php?${params.toString()}`;

    return { ok: true, redirectUrl };
  },
};
