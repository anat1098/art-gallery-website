import type { PaymentProvider, PaymentProviderId } from "@/types/payment";
import { stripeProvider } from "./stripe-provider";
import { meshulamProvider } from "./meshulam-provider";
import { createStubProvider } from "./stub-provider";

const providers: Record<PaymentProviderId, PaymentProvider> = {
  MESHULAM: meshulamProvider,
  STRIPE: stripeProvider,
  PAYPAL: createStubProvider("PAYPAL", "PayPal"),
  APPLE_PAY: createStubProvider("APPLE_PAY", "Apple Pay"),
  BIT: createStubProvider("BIT", "Bit"),
};

export function getPaymentProvider(id: PaymentProviderId): PaymentProvider {
  return providers[id];
}

export function listPaymentProviders(): PaymentProvider[] {
  return Object.values(providers);
}
