"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { countries, getShippingRule } from "@/lib/constants/shipping";
import { checkoutSchema, type CheckoutInput } from "@/lib/validation/checkout";
import { useCartStore } from "@/hooks/use-cart-store";
import { useCurrency } from "@/components/providers/currency-provider";
import { placeOrder } from "@/server/actions/order";
import type { PaymentProviderId } from "@/types/payment";

const paymentOptions: { id: PaymentProviderId; label: string; available: boolean }[] = [
  { id: "STRIPE", label: "Credit / Debit Card (Stripe)", available: true },
  { id: "PAYPAL", label: "PayPal", available: false },
  { id: "APPLE_PAY", label: "Apple Pay", available: false },
  { id: "BIT", label: "Bit", available: false },
];

export function CheckoutClient() {
  const lines = useCartStore((s) => s.lines);
  const [paymentProvider, setPaymentProvider] = useState<PaymentProviderId>("STRIPE");
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { format } = useCurrency();

  const form = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "",
      city: "",
      street: "",
      postalCode: "",
      shippingNotes: "",
      orderNotes: "",
    },
  });

  const country = form.watch("country");
  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const shippingRule = useMemo(
    () => (country ? getShippingRule(country) : null),
    [country]
  );
  const shippingCost = shippingRule?.cost ?? 0;
  const total = subtotal + shippingCost;

  async function onSubmit(values: CheckoutInput) {
    setServerError(null);
    setSubmitting(true);
    try {
      const result = await placeOrder({
        contact: values,
        lines: lines.map((l) => ({
          artworkId: l.artworkId,
          title: l.title,
          sizeLabel: l.sizeLabel,
          frameLabel: l.frameLabel,
          unitPrice: l.unitPrice,
          quantity: l.quantity,
        })),
        paymentProvider,
      });

      if (result.ok) {
        window.location.href = result.redirectUrl;
        return;
      }
      setServerError(result.error);
    } finally {
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center lg:px-10">
        <h1>Nothing to check out</h1>
        <p className="mt-4 text-muted-foreground">
          Your cart is empty. Add something from the collection first.
        </p>
        <Button size="lg" className="mt-8 rounded-none px-8" asChild>
          <Link href="/prints">Shop Prints</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-6 py-14 lg:grid-cols-[1.3fr_1fr] lg:gap-16 lg:px-10 lg:py-20">
      <div>
        <h1>Checkout</h1>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 space-y-8" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" className="mt-2" {...form.register("firstName")} />
              {form.formState.errors.firstName && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" className="mt-2" {...form.register("lastName")} />
              {form.formState.errors.lastName && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" className="mt-2" {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" className="mt-2" {...form.register("phone")} />
              {form.formState.errors.phone && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={form.watch("country")}
                onValueChange={(v) =>
                  form.setValue("country", v, { shouldValidate: true })
                }
              >
                <SelectTrigger id="country" className="mt-2 w-full rounded-none">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.country && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.country.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" className="mt-2" {...form.register("city")} />
              {form.formState.errors.city && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.city.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input id="postalCode" className="mt-2" {...form.register("postalCode")} />
              {form.formState.errors.postalCode && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.postalCode.message}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <Label htmlFor="street">Street Address</Label>
              <Input id="street" className="mt-2" {...form.register("street")} />
              {form.formState.errors.street && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.street.message}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <Label htmlFor="shippingNotes">Shipping Notes (optional)</Label>
              <Textarea id="shippingNotes" className="mt-2" rows={2} {...form.register("shippingNotes")} />
            </div>
            <div className="col-span-2">
              <Label htmlFor="orderNotes">Order Notes (optional)</Label>
              <Textarea id="orderNotes" className="mt-2" rows={2} {...form.register("orderNotes")} />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Payment Method
            </p>
            <RadioGroup
              value={paymentProvider}
              onValueChange={(v) => setPaymentProvider(v as PaymentProviderId)}
              className="mt-3 space-y-3"
            >
              {paymentOptions.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-3 rounded-sm border border-border px-4 py-3 ${
                    opt.available ? "" : "opacity-50"
                  }`}
                >
                  <RadioGroupItem value={opt.id} disabled={!opt.available} />
                  <span className="text-sm">
                    {opt.label}
                    {!opt.available && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        Coming soon
                      </span>
                    )}
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>

          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full rounded-none"
            disabled={submitting}
          >
            {submitting ? "Placing Order…" : `Place Order — ${format(total)}`}
          </Button>
        </form>
      </div>

      <div className="h-fit rounded-sm border border-border p-6 lg:sticky lg:top-28">
        <h2 className="text-xl">Order Summary</h2>
        <div className="mt-6 space-y-4 divide-y divide-border">
          {lines.map((line) => (
            <div key={line.id} className="flex justify-between gap-4 pt-4 first:pt-0">
              <div>
                <p className="text-sm">{line.title}</p>
                <p className="text-xs text-muted-foreground">
                  {[line.sizeLabel, line.frameLabel].filter(Boolean).join(" · ") ||
                    "Original artwork"}{" "}
                  · Qty {line.quantity}
                </p>
              </div>
              <p className="whitespace-nowrap text-sm">
                {format(line.unitPrice * line.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2 border-t border-border pt-6 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{format(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>
              {shippingRule ? format(shippingCost) : "Select a country"}
            </span>
          </div>
          {shippingRule && (
            <p className="text-xs text-muted-foreground">
              Estimated delivery: {shippingRule.estimatedDaysMin}–
              {shippingRule.estimatedDaysMax} business days
            </p>
          )}
          <div className="flex justify-between border-t border-border pt-4 text-base">
            <span>Total</span>
            <span>{format(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
