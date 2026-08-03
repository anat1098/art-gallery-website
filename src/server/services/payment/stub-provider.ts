import type { PaymentProvider, PaymentProviderId } from "@/types/payment";

/**
 * Placeholder provider for payment methods not yet wired up to a real
 * gateway. Keeps the same interface as `stripeProvider` so enabling a real
 * integration later is a drop-in swap, not a redesign.
 */
export function createStubProvider(
  id: PaymentProviderId,
  label: string
): PaymentProvider {
  return {
    id,
    label,
    isConfigured: () => false,
    async createCheckoutSession() {
      return {
        ok: false,
        error: `${label} isn't connected yet. Please choose another payment method.`,
      };
    },
  };
}
