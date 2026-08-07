export type PaymentProviderId = "STRIPE" | "PAYPAL" | "APPLE_PAY" | "BIT" | "MESHULAM";

export type CheckoutLineItem = {
  name: string;
  quantity: number;
  unitAmount: number;
};

export type CreateCheckoutSessionInput = {
  orderId: string;
  orderNumber: string;
  currency: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  successUrl: string;
  cancelUrl: string;
  lineItems: CheckoutLineItem[];
  shippingAmount: number;
};

export type CreateCheckoutSessionResult =
  | { ok: true; redirectUrl: string; providerRef?: string }
  | { ok: false; error: string };

export interface PaymentProvider {
  id: PaymentProviderId;
  label: string;
  isConfigured(): boolean;
  createCheckoutSession(
    input: CreateCheckoutSessionInput
  ): Promise<CreateCheckoutSessionResult>;
}
